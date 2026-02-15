import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, Loader2, Maximize2, Minimize2, Plus, Search, Image, LayoutGrid, Microscope, Heart, Settings, Trash2, PanelLeftClose, PanelLeftOpen, Star, User, ArrowRight, HelpCircle, MoreHorizontal, Edit2, Share2, Pin, PinOff, Rocket, Check, QrCode, Keyboard, PlayCircle, MessageSquareDashed } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "@/lib/config";

interface Message {
    id: number;
    text: string;
    sender: "user" | "bot";
    shouldAnimate?: boolean;
}

interface ChatSession {
    id: string;
    title: string;
    messages: Message[];
    createdAt: number;
    pinned?: boolean;
}

const FormattedText = ({ text }: { text: string }) => {
    const parseBold = (str: string) => {
        const parts = str.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    return (
        <div className="space-y-1">
            {text.split('\n').map((line, i) => {
                const trimmed = line.trim();
                if (!trimmed && i === text.split('\n').length - 1) return null;
                if (!trimmed) return <div key={i} className="h-2" />;

                if (trimmed.startsWith('• ') || trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
                    return (
                        <div key={i} className="flex items-start gap-2 pl-1">
                            <span className="opacity-70 mt-1.5 text-[10px] scale-75">●</span>
                            <span className="flex-1 leading-relaxed">{parseBold(trimmed.substring(2))}</span>
                        </div>
                    );
                }

                return <p key={i} className="leading-relaxed">{parseBold(line)}</p>;
            })}
        </div>
    );
};

const Typewriter = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
    const [display, setDisplay] = useState("");
    const onCompleteRef = useRef(onComplete);

    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                setDisplay(text.slice(0, i + 1));
                i++;
            } else {
                clearInterval(interval);
                onCompleteRef.current?.();
            }
        }, 30);

        return () => clearInterval(interval);
    }, [text]);

    return <FormattedText text={display} />;
};

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeView, setActiveView] = useState<'chat' | 'settings'>('chat');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [userName, setUserName] = useState<string>(() => localStorage.getItem("chatbot_username") || "");
    const [tempName, setTempName] = useState("");
    const [tourStep, setTourStep] = useState(0);
    const [activeMenuSessionId, setActiveMenuSessionId] = useState<string | null>(null);
    const [renamingSessionId, setRenamingSessionId] = useState<string | null>(null);
    const renameInputRef = useRef<HTMLInputElement>(null);

    // Tour Effect
    useEffect(() => {
        if (tourStep > 0) {
            setIsExpanded(true);
            if (tourStep <= 5) {
                setIsSidebarOpen(true);
                if (activeView !== 'chat') setActiveView('chat');
            }
            if (tourStep === 6) {
                setIsSidebarOpen(true);
                setActiveView('settings');
            }
        }
    }, [tourStep, activeView]);

    // Initialize sessions from localStorage
    const [sessions, setSessions] = useState<ChatSession[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem("chat_sessions");
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });

    const [currentSessionId, setCurrentSessionId] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [input, setInput] = useState("");
    const [isLaunching, setIsLaunching] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState("");
    const [showHelpMenu, setShowHelpMenu] = useState(false);
    const [showShortcutsModal, setShowShortcutsModal] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);
    const [isTemporaryChat, setIsTemporaryChat] = useState(false);
    const [tempMessages, setTempMessages] = useState<Message[]>(() => {
        const storedTempMessages = sessionStorage.getItem("temporary_chat_messages");
        return storedTempMessages ? JSON.parse(storedTempMessages) : [];
    });
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Clear sessionStorage when chat is closed
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (!isTemporaryChat) {
                sessionStorage.removeItem("temporary_chat_messages");
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isTemporaryChat]);

    // Initial load
    useEffect(() => {
        if (sessions.length > 0 && !currentSessionId && !isTemporaryChat) {
            setCurrentSessionId(sessions[0].id);
            setMessages(sessions[0].messages);
        } else if (sessions.length === 0 && !currentSessionId && !isTemporaryChat) {
            handleNewChat();
        }
        // Remove automatic loading of temporary chat - only load when explicitly enabled
    }, [isOpen, isTemporaryChat]); // Run when opened to ensure content is ready

    // Persist temporary messages to sessionStorage
    useEffect(() => {
        if (isTemporaryChat) {
            sessionStorage.setItem("temporary_chat_messages", JSON.stringify(tempMessages));
        } else {
            sessionStorage.removeItem("temporary_chat_messages");
        }
    }, [tempMessages, isTemporaryChat]);

    // Persist sessions
    useEffect(() => {
        localStorage.setItem("chat_sessions", JSON.stringify(sessions));
    }, [sessions]);

    // Sync messages to current session (only if not temporary chat)
    useEffect(() => {
        if (!currentSessionId || isTemporaryChat) return;

        setSessions(prev => prev.map(s => {
            if (s.id === currentSessionId) {
                // Determine title based on first user message
                let title = s.title;
                if (title === "New Chat") {
                    const firstUserMsg = messages.find(m => m.sender === "user");
                    if (firstUserMsg) {
                        title = firstUserMsg.text.slice(0, 30) + (firstUserMsg.text.length > 30 ? "..." : "");
                    }
                }
                return { ...s, messages, title };
            }
            return s;
        }));
    }, [messages, currentSessionId, isTemporaryChat]);

    // Update display messages based on mode
    useEffect(() => {
        if (isTemporaryChat) {
            setMessages(tempMessages);
        }
    }, [tempMessages, isTemporaryChat]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleNewChat = () => {
        setMessages([]);
        setCurrentSessionId("");
        setInput("");
        setIsTyping(false);
        setActiveView('chat');
        setIsTemporaryChat(false);
        setTempMessages([]);
        sessionStorage.removeItem("temporary_chat_messages"); // Clear temporary chat from session storage
    };

    const handleTemporaryChat = () => {
        if (isTemporaryChat) {
            // Turn OFF temporary chat
            setIsTemporaryChat(false);
            setTempMessages([]);
            sessionStorage.removeItem("temporary_chat_messages");
            handleNewChat(); // Start a fresh normal chat
        } else {
            // Turn ON temporary chat
            setMessages([]);
            setCurrentSessionId("");
            setInput("");
            setIsTyping(false);
            setActiveView('chat');
            setIsTemporaryChat(true);
            
            // Load existing temporary messages if any
            const storedTempMessages = sessionStorage.getItem("temporary_chat_messages");
            if (storedTempMessages) {
                const parsed = JSON.parse(storedTempMessages);
                setTempMessages(parsed);
                setMessages(parsed);
            } else {
                setTempMessages([]);
            }
        }
    };

    const handleClearAllHistory = () => {
        setShowDeleteConfirm(true);
    };

    const handleUpdateName = () => {
        if (newName.trim()) {
            setUserName(newName.trim());
            localStorage.setItem("chatbot_username", newName.trim());
            setIsEditingName(false);
        }
    };

    const confirmDelete = () => {
        setSessions([]);
        localStorage.removeItem("chat_sessions");
        setMessages([]);
        // setSessionId(null); // sessionIdState might differ
        setCurrentSessionId(""); // Changed from setActiveSessionId to setCurrentSessionId
        setShowDeleteConfirm(false);
        setUserName("");
        localStorage.removeItem("chatbot_username");
        // localStorage.removeItem("chat_history"); // If used
    };

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) {
                // Allow opening with Alt+O maybe? Or keep it simple.
                // If closed, maybe Alt+O opens it?
                if (e.altKey && e.key.toLowerCase() === 'o') {
                    e.preventDefault();
                    setIsOpen(true);
                }
                return;
            }

            // Shortcuts with Alt key
            if (e.altKey) {
                switch (e.key.toLowerCase()) {
                    case 'n': // New Chat
                        e.preventDefault();
                        handleNewChat();
                        break;
                    case 's': // Settings
                        e.preventDefault();
                        setActiveView('settings');
                        break;
                    case 'm': // Maximize/Restore
                        e.preventDefault();
                        setIsExpanded(prev => !prev); // Changed from setIsMaximized to setIsExpanded
                        break;
                    case 'w': // Close (Close Window/Widget)
                        e.preventDefault();
                        setIsOpen(false);
                        break;
                    case 'h': // Help (Tour)
                        e.preventDefault();
                        setTourStep(1);
                        break;
                    case 'f': // Find/Search
                        e.preventDefault();
                        setIsSearchOpen(true);
                        setSearchQuery("");
                        break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, handleNewChat, setActiveView, setIsExpanded, setIsOpen, setTourStep, setIsSearchOpen, setSearchQuery]);

    const handleLoadSession = (sessionId: string) => {
        const session = sessions.find(s => s.id === sessionId);
        if (session) {
            setCurrentSessionId(sessionId);
            setMessages(session.messages);
            setInput("");
            setIsTyping(false);
            setActiveView('chat');
        }
    };

    const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
        e.stopPropagation();
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        if (currentSessionId === sessionId) {
            handleNewChat();
        }
        setActiveMenuSessionId(null);
    };

    const handleStartRename = (e: React.MouseEvent, sessionId: string) => {
        e.stopPropagation();
        setRenamingSessionId(sessionId);
        setActiveMenuSessionId(null);
        setTimeout(() => renameInputRef.current?.focus(), 100);
    };

    const handleRenameSubmit = (sessionId: string, newTitle: string) => {
        if (newTitle.trim()) {
            setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, title: newTitle.trim() } : s));
        }
        setRenamingSessionId(null);
    };

    const handleTogglePin = (e: React.MouseEvent, sessionId: string) => {
        e.stopPropagation();
        setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, pinned: !s.pinned } : s));
        setActiveMenuSessionId(null);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleAnimationComplete = (id: number) => {
        setMessages(prev => prev.map(msg =>
            msg.id === id ? { ...msg, shouldAnimate: false } : msg
        ));
        setIsTyping(false);
    };

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim()) return;

        const userMessage: Message = { id: Date.now(), text: input, sender: "user" };

        let activeSessionId = currentSessionId;
        if (!activeSessionId && !isTemporaryChat) {
            const newId = Date.now().toString();
            const newSession: ChatSession = {
                id: newId,
                title: input,
                messages: [...messages, userMessage],
                createdAt: Date.now()
            };
            setSessions(prev => [newSession, ...prev]);
            setCurrentSessionId(newId);
            activeSessionId = newId;
        }

        const currentMessages = isTemporaryChat ? tempMessages : messages;
        if (isTemporaryChat) {
            setTempMessages(prev => [...prev, userMessage]);
        } else {
            setMessages(prev => [...prev, userMessage]);
        }
        setInput("");
        setIsTyping(true);

        try {
            // Format history (use current messages context)
            const history = (isTemporaryChat ? tempMessages : messages).map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text
            }));

            // Call the local backend (FastAPI)
            const response = await fetch("http://localhost:8000/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userprompt: input,
                    history: history
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `Server error: ${response.status}`);
            }

            const data = await response.json();
            await new Promise(resolve => setTimeout(resolve, 600)); // Ensure typing dots are visible
            let botText = data.chatresponse || data.answer;
            if (typeof botText === 'string' && botText.includes('{"chatname":')) {
                botText = botText.split('{"chatname":')[0].trim();
            }
            const botMessage: Message = { id: Date.now() + 1, text: botText, sender: "bot", shouldAnimate: true };

            if (data.chatname && activeSessionId) {
                setSessions(prev => prev.map(s =>
                    s.id === activeSessionId ? { ...s, title: data.chatname } : s
                ));
            }

            // Launch Animation Sequence
            setIsLaunching(true);
            await new Promise(resolve => setTimeout(resolve, 800)); // Wait for flight
            setIsLaunching(false);
            setIsTyping(false);

            if (isTemporaryChat) {
                setTempMessages(prev => [...prev, botMessage]);
            } else {
                setMessages(prev => [...prev, botMessage]);
            }
        } catch (error: any) {
            console.error("Error connecting to backend:", error);

            // Fallback response
            setTimeout(() => {
                const lowerInput = input.toLowerCase();
                let fallbackResponse = "I'm having trouble reaching the backend server on port 8000. ";

                if (lowerInput.includes("project") || lowerInput.includes("work")) {
                    fallbackResponse += "However, you can view my work in the Projects section.";
                } else if (lowerInput.includes("contact")) {
                    fallbackResponse += "You can reach me via the contact form.";
                } else {
                    fallbackResponse += "To enable AI, please run the backend server.";
                }

                const errorMessage: Message = {
                    id: Date.now() + 1,
                    text: fallbackResponse,
                    sender: "bot",
                    shouldAnimate: true
                };
                setMessages(prev => [...prev, errorMessage]);
            }, 1000);
        }
    };

    const handleNameSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (tempName.trim()) {
            setUserName(tempName.trim());
            localStorage.setItem("chatbot_username", tempName.trim());
        }
    };

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 20 }}
                            className={`glass-panel glow-border rounded-lg overflow-hidden flex flex-col shadow-2xl transition-all duration-300 ease-in-out ${isExpanded
                                ? "fixed inset-0 m-auto z-[100] w-[90vw] md:w-[1000px] h-[85vh]"
                                : "mb-4 w-80 md:w-96 h-[60vh]"
                                }`}
                            style={{ maxHeight: isExpanded ? "90vh" : "500px" }}
                        >
                            {/* Header */}
                            {/* Header */}
                            <div className="bg-primary/10 p-4 border-b border-primary/20 flex justify-between items-center shrink-0">
                                <div className="flex items-center gap-2">
                                    <Bot size={18} className="text-primary" />
                                    <span className="font-display text-sm tracking-wider text-primary">
                                        SYSTEM ASSISTANT {isTemporaryChat && <span className="text-xs text-muted-foreground ml-2">(Temporary)</span>}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* Temporary Chat Button */}
                                    <button
                                        onClick={handleTemporaryChat}
                                        className={`text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-white/5 ${
                                            isTemporaryChat ? 'text-primary bg-primary/10' : ''
                                        }`}
                                        title={isTemporaryChat ? "Turn Off Temporary Chat" : "Start Temporary Chat"}
                                    >
                                        <MessageSquareDashed size={18} className={isTemporaryChat ? 'fill-current' : ''} />
                                    </button>

                                    {/* Help Dropdown */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowHelpMenu(!showHelpMenu)}
                                            className="text-muted-foreground hover:text-foreground transition-colors mr-2 p-1 rounded hover:bg-white/5"
                                            title="Help Menu"
                                        >
                                            <HelpCircle size={18} />
                                        </button>

                                        <AnimatePresence>
                                            {showHelpMenu && (
                                                <>
                                                    <div className="fixed inset-0 z-40" onClick={() => setShowHelpMenu(false)} />
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        className="absolute right-0 top-full mt-2 w-48 bg-background border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden"
                                                    >
                                                        <div className="p-1">
                                                            <button
                                                                onClick={() => { setShowShortcutsModal(true); setShowHelpMenu(false); }}
                                                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-md transition-colors"
                                                            >
                                                                <Keyboard size={14} />
                                                                <span>Shortcuts</span>
                                                            </button>
                                                            <button
                                                                onClick={() => { setTourStep(1); setShowHelpMenu(false); }}
                                                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-md transition-colors"
                                                            >
                                                                <PlayCircle size={14} />
                                                                <span>Start Tour</span>
                                                            </button>
                                                            <button
                                                                onClick={() => { setShowQRModal(true); setShowHelpMenu(false); }}
                                                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-md transition-colors"
                                                            >
                                                                <QrCode size={14} />
                                                                <span>Mobile Access</span>
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                </>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <button
                                        onClick={() => setIsExpanded(!isExpanded)}
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                        title={isExpanded ? "Collapse" : "Expand"}
                                    >
                                        {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                                    </button>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex flex-1 overflow-hidden">
                                {isExpanded && (
                                    <div className={`hidden md:flex border-r border-primary/20 bg-secondary/10 backdrop-blur-sm flex-col gap-2 shrink-0 h-full overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'w-64 p-4' : 'w-16 p-2 items-center'}`}>
                                        <div id="tour-sidebar-top" className={`flex items-center shrink-0 mb-4 ${isSidebarOpen ? 'justify-between px-1' : 'justify-center'}`}>
                                            {isSidebarOpen ? (
                                                <>
                                                    <div className="text-primary">
                                                        <Bot size={24} />
                                                    </div>
                                                    <button
                                                        onClick={() => setIsSidebarOpen(false)}
                                                        className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-primary/10 rounded"
                                                        title="Collapse sidebar"
                                                    >
                                                        <PanelLeftClose size={18} />
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => setIsSidebarOpen(true)}
                                                    className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-primary/10 rounded"
                                                    title="Expand sidebar"
                                                >
                                                    <PanelLeftOpen size={18} />
                                                </button>
                                            )}
                                        </div>

                                        <button
                                            id="tour-new-chat"
                                            onClick={handleNewChat}
                                            className={`flex items-center gap-3 rounded-md hover:bg-primary/10 text-sm transition-colors shrink-0 ${isSidebarOpen ? 'px-3 py-2 text-left border border-white/5 mb-2 bg-background/50 text-foreground w-full' : 'p-2 justify-center mb-2'}`}
                                            title="New Chat"
                                        >
                                            <Plus size={16} className="text-primary" />
                                            {isSidebarOpen && <span>New chat</span>}
                                        </button>

                                        <button
                                            id="tour-search"
                                            onClick={() => { setIsSearchOpen(true); setSearchQuery(""); }}
                                            className={`flex items-center gap-3 rounded-md hover:bg-primary/10 text-sm transition-colors shrink-0 ${isSidebarOpen ? 'px-3 py-2 text-left border border-white/5 mb-4 bg-transparent text-muted-foreground hover:text-foreground w-full' : 'p-2 justify-center mb-4 text-muted-foreground'}`}
                                            title="Search chats"
                                        >
                                            <Search size={16} />
                                            {isSidebarOpen && <span>Search chats...</span>}
                                        </button>

                                        {isSidebarOpen && (
                                            <div id="tour-recent" className="flex-1 overflow-y-auto min-h-0 flex flex-col gap-1 pr-1 custom-scrollbar w-full">
                                                <div className="text-xs font-medium text-muted-foreground mb-2 px-2 uppercase tracking-wider sticky top-0 bg-transparent backdrop-blur-sm py-1 z-10">Recent</div>
                                                {[...sessions].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)).map(session => (
                                                    <div
                                                        key={session.id}
                                                        className={`group relative flex items-center gap-3 px-3 py-2 rounded-md transition-colors w-full cursor-pointer ${currentSessionId === session.id ? 'bg-primary/20 text-primary border border-primary/20' : 'text-muted-foreground hover:text-foreground hover:bg-primary/10'
                                                            }`}
                                                        onClick={() => handleLoadSession(session.id)}
                                                    >
                                                        {session.pinned ? <Pin size={14} className="shrink-0 text-primary rotate-45 fill-primary/20" /> : <MessageSquare size={14} className="shrink-0" />}

                                                        {renamingSessionId === session.id ? (
                                                            <input
                                                                ref={renameInputRef}
                                                                type="text"
                                                                defaultValue={session.title}
                                                                className="flex-1 bg-background border border-primary/50 rounded px-1 text-xs focus:outline-none min-w-0"
                                                                onClick={(e) => e.stopPropagation()}
                                                                onBlur={(e) => handleRenameSubmit(session.id, e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') handleRenameSubmit(session.id, e.currentTarget.value);
                                                                    if (e.key === 'Escape') setRenamingSessionId(null);
                                                                }}
                                                            />
                                                        ) : (
                                                            <span className="truncate flex-1 text-left">{session.title}</span>
                                                        )}

                                                        {/* Three Dots Button */}
                                                        {!renamingSessionId && (
                                                            <div className={`transition-opacity flex items-center ${activeMenuSessionId === session.id ? 'opacity-100' : 'opacity-100'}`}>
                                                                <motion.button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setActiveMenuSessionId(activeMenuSessionId === session.id ? null : session.id);
                                                                    }}
                                                                    className="relative w-7 h-7 flex items-center justify-center rounded-full focus:outline-none"
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                >
                                                                    {/* Star Ball */}
                                                                    <motion.div
                                                                        className="w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 shadow-[0_0_10px_cyan] flex items-center justify-center relative z-10"
                                                                        animate={{ rotate: 360 }}
                                                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                                                    >
                                                                        <Star size={10} className="text-white fill-white" />
                                                                    </motion.div>

                                                                    {/* Blast/Ripple Effect */}
                                                                    {activeMenuSessionId === session.id && (
                                                                        <motion.span
                                                                            className="absolute inset-0 rounded-full border-2 border-cyan-400 opacity-0"
                                                                            initial={{ opacity: 1, scale: 0.8 }}
                                                                            animate={{ opacity: 0, scale: 2 }}
                                                                            transition={{ duration: 0.6, ease: "easeOut" }}
                                                                        />
                                                                    )}
                                                                </motion.button>
                                                            </div>
                                                        )}

                                                        {/* Dropdown Menu */}
                                                        {activeMenuSessionId === session.id && (
                                                            <>
                                                                <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setActiveMenuSessionId(null); }} />
                                                                <div className="absolute right-2 top-8 z-50 bg-popover border border-white/10 rounded-md shadow-xl py-1 min-w-[140px] flex flex-col animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                                                                    <button
                                                                        onClick={(e) => handleTogglePin(e, session.id)}
                                                                        className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-secondary/50 text-left w-full text-foreground/80 hover:text-foreground transition-colors"
                                                                    >
                                                                        {session.pinned ? <PinOff size={12} /> : <Pin size={12} />}
                                                                        {session.pinned ? "Unpin Chat" : "Pin Chat"}
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => handleStartRename(e, session.id)}
                                                                        className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-secondary/50 text-left w-full text-foreground/80 hover:text-foreground transition-colors"
                                                                    >
                                                                        <Edit2 size={12} />
                                                                        Rename
                                                                    </button>
                                                                    {/* Share (Placeholder) */}
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); alert("Share feature coming soon!"); setActiveMenuSessionId(null); }}
                                                                        className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-secondary/50 text-left w-full text-foreground/80 hover:text-foreground transition-colors"
                                                                    >
                                                                        <Share2 size={12} />
                                                                        Share
                                                                    </button>
                                                                    <div className="h-px bg-white/5 my-1" />
                                                                    <button
                                                                        onClick={(e) => handleDeleteSession(e, session.id)}
                                                                        className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-red-500/10 text-left w-full text-red-400 hover:text-red-300 transition-colors"
                                                                    >
                                                                        <Trash2 size={12} />
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className={`pt-2 mt-auto border-t border-white/5 shrink-0 ${isSidebarOpen ? 'w-full' : 'w-full flex justify-center'}`}>
                                            <button
                                                id="tour-settings"
                                                onClick={() => setActiveView('settings')}
                                                className={`flex items-center gap-3 rounded-md hover:bg-primary/10 text-sm transition-colors ${isSidebarOpen ? 'px-3 py-2 text-left w-full' : 'p-2 justify-center'} ${activeView === 'settings' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'}`}
                                                title="Settings"
                                            >
                                                <Settings size={16} />
                                                {isSidebarOpen && <span>Settings</span>}
                                            </button>
                                        </div>
                                    </div>
                                )}
                                <div className="flex-1 flex flex-col h-full min-w-0 bg-background/40">
                                    {activeView === 'chat' ? (
                                        !userName ? (
                                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95 duration-500">
                                                <div className="bg-primary/10 p-6 rounded-full mb-6">
                                                    <User size={32} className="text-primary" />
                                                </div>
                                                <h2 className="text-2xl font-bold font-display text-foreground mb-3">Welcome!</h2>
                                                <p className="text-muted-foreground mb-6 text-sm">Please tell me your name so I can address you properly.</p>
                                                <form onSubmit={handleNameSubmit} className="w-full max-w-xs flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={tempName}
                                                        onChange={(e) => setTempName(e.target.value)}
                                                        placeholder="Your Name"
                                                        className="flex-1 bg-secondary/50 border border-primary/20 rounded-md px-4 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                                                        autoFocus
                                                    />
                                                    <button
                                                        type="submit"
                                                        disabled={!tempName.trim()}
                                                        className="bg-primary/20 hover:bg-primary/40 text-primary p-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <ArrowRight size={20} />
                                                    </button>
                                                </form>
                                            </div>
                                        ) : (
                                            <>
                                                {/* Messages Area */}
                                                {messages.length === 0 ? (
                                                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95 duration-500">
                                                        <div className="bg-primary/10 p-6 rounded-full mb-6 relative group">
                                                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            <Bot size={48} className="text-primary relative z-10" />
                                                        </div>
                                                        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
                                                            How can I help you, {userName}?
                                                        </h2>
                                                        <p className="text-muted-foreground max-w-xs mx-auto text-sm leading-relaxed">
                                                            Ask me about Manikandan's projects, skills, or experience.
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                                        {messages.map((msg) => (
                                                            <div
                                                                key={msg.id}
                                                                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                                                            >
                                                                <div
                                                                    className={`max-w-[80%] px-4 py-2.5 rounded-lg text-sm ${msg.sender === "user"
                                                                        ? "bg-primary text-primary-foreground rounded-tr-none"
                                                                        : "bg-secondary text-secondary-foreground rounded-tl-none border border-primary/10"
                                                                        }`}
                                                                >
                                                                    {msg.sender === "bot" ? (
                                                                        msg.shouldAnimate ? (
                                                                            <Typewriter
                                                                                text={msg.text}
                                                                                onComplete={() => handleAnimationComplete(msg.id)}
                                                                            />
                                                                        ) : (
                                                                            <FormattedText text={msg.text} />
                                                                        )
                                                                    ) : (
                                                                        <div className="whitespace-pre-wrap">{msg.text}</div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {/* Rocket Typing Indicator */}
                                                        {(isTyping || isLaunching) && messages[messages.length - 1]?.sender === "user" && (
                                                            <div className="flex justify-start">
                                                                <div className="bg-transparent border-none flex items-center justify-center relative w-16 h-8">
                                                                    <div className="flex items-center justify-center w-full h-full relative">
                                                                        <motion.div
                                                                            className="relative flex items-center drop-shadow-[0_0_15px_rgba(249,115,22,0.8)] z-50"
                                                                            variants={{
                                                                                hover: {
                                                                                    x: 0,
                                                                                    y: [-1, 1, -1],
                                                                                    opacity: 1,
                                                                                    transition: { y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" } }
                                                                                },
                                                                                launch: {
                                                                                    x: 400,
                                                                                    opacity: 0,
                                                                                    y: 0,
                                                                                    transition: { duration: 0.8, ease: "easeIn" }
                                                                                }
                                                                            }}
                                                                            initial="hover"
                                                                            animate={isLaunching ? "launch" : "hover"}
                                                                        >
                                                                            {/* Rocket Body - Pointing Right */}
                                                                            <Rocket size={20} className="text-white fill-white/10 rotate-45 z-10" />

                                                                            {/* Main Engine Blast - Behind (Left) */}
                                                                            <motion.div
                                                                                className="absolute right-[16px] top-1/2 -translate-y-1/2 w-8 h-3 bg-gradient-to-l from-orange-500 via-yellow-400 to-transparent rounded-l-full blur-[2px]"
                                                                                variants={{
                                                                                    hover: {
                                                                                        scaleX: [1, 1.5, 0.8, 1.3],
                                                                                        opacity: [0.8, 1, 0.7],
                                                                                        transition: { duration: 0.1, repeat: Infinity }
                                                                                    },
                                                                                    launch: {
                                                                                        scaleX: 3,
                                                                                        opacity: 1,
                                                                                        transition: { duration: 0.2 }
                                                                                    }
                                                                                }}
                                                                                style={{ transformOrigin: "right center" }}
                                                                            />

                                                                            {/* Inner White Core */}
                                                                            <motion.div
                                                                                className="absolute right-[16px] top-1/2 -translate-y-1/2 w-4 h-1.5 bg-white rounded-l-full blur-[1px]"
                                                                                variants={{
                                                                                    hover: { scaleX: [1, 1.2, 0.9], transition: { duration: 0.1, repeat: Infinity } },
                                                                                    launch: { scaleX: 2, transition: { duration: 0.2 } }
                                                                                }}
                                                                                style={{ transformOrigin: "right center" }}
                                                                            />
                                                                        </motion.div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div ref={messagesEndRef} />
                                                    </div>
                                                )}

                                                {/* Input */}
                                                <form onSubmit={handleSend} className="p-3 border-t border-primary/20 bg-background/50 backdrop-blur-sm shrink-0">
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={input}
                                                            onChange={(e) => setInput(e.target.value)}
                                                            placeholder="Type a command..."
                                                            className="flex-1 bg-secondary/50 border border-primary/10 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                                                        />
                                                        <button
                                                            type="submit"
                                                            className="p-2 bg-primary/20 hover:bg-primary/40 text-primary rounded transition-colors"
                                                            disabled={!input.trim() || isTyping}
                                                        >
                                                            {isTyping ? <Star size={16} className="animate-spin text-primary fill-current" /> : <Send size={16} />}
                                                        </button>
                                                    </div>
                                                </form>
                                            </>
                                        )) : (
                                        /* Settings View */
                                        <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
                                            <h2 className="text-xl font-display font-bold text-primary border-b border-primary/20 pb-4">Settings</h2>

                                            <div className="space-y-4">
                                                {/* Profile Settings */}
                                                <div className="p-4 rounded-lg bg-secondary/10 border border-white/5 space-y-4">
                                                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Profile</h3>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-primary/20 rounded-full text-primary">
                                                                <User size={20} />
                                                            </div>
                                                            {isEditingName ? (
                                                                <input
                                                                    className="bg-transparent border-b border-primary/50 text-foreground focus:outline-none px-1 py-0.5 min-w-[150px]"
                                                                    value={newName}
                                                                    onChange={(e) => setNewName(e.target.value)}
                                                                    autoFocus
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter') handleUpdateName();
                                                                        if (e.key === 'Escape') setIsEditingName(false);
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div className="flex flex-col">
                                                                    <span className="font-medium text-foreground">{userName || "Guest"}</span>
                                                                    <span className="text-xs text-muted-foreground">Display Name</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {isEditingName ? (
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={handleUpdateName}
                                                                    className="p-1.5 bg-primary/20 hover:bg-green-500/20 text-primary hover:text-green-400 rounded transition-colors"
                                                                    title="Save Name"
                                                                >
                                                                    <Check size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => setIsEditingName(false)}
                                                                    className="p-1.5 hover:bg-red-500/20 text-muted-foreground hover:text-red-400 rounded transition-colors"
                                                                    title="Cancel"
                                                                >
                                                                    <X size={16} />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => {
                                                                    setNewName(userName);
                                                                    setIsEditingName(true);
                                                                }}
                                                                className="p-2 hover:bg-secondary/50 rounded-full text-muted-foreground hover:text-foreground transition-colors"
                                                                title="Edit Name"
                                                            >
                                                                <Edit2 size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="p-4 rounded-lg bg-secondary/10 border border-white/5 space-y-4">
                                                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Data & Storage</h3>
                                                    <button
                                                        id="tour-clear-history"
                                                        onClick={handleClearAllHistory}
                                                        className="flex items-center gap-3 w-full px-4 py-3 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition-all text-sm font-medium"
                                                    >
                                                        <Trash2 size={18} />
                                                        <span>Clear All Chat History</span>
                                                    </button>
                                                    <p className="text-xs text-muted-foreground">This will permanently delete all your conversation history from this device.</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Shortcuts Modal */}
                            <AnimatePresence>
                                {showShortcutsModal && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
                                        onClick={() => setShowShortcutsModal(false)}
                                    >
                                        <motion.div
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.9, opacity: 0 }}
                                            className="bg-background/95 border border-primary/20 rounded-xl p-6 max-w-sm w-full shadow-2xl relative overflow-hidden"
                                            onClick={e => e.stopPropagation()}
                                        >
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-primary" />
                                            <h3 className="text-lg font-display font-bold text-foreground mb-4 flex items-center gap-2">
                                                <Keyboard size={20} className="text-primary" /> Keyboard Shortcuts
                                            </h3>
                                            <div className="space-y-3">
                                                <div className="flex justify-between text-sm"><span className="text-muted-foreground">New Chat</span> <code className="bg-secondary/30 px-2 py-0.5 rounded text-primary font-mono">Alt + N</code></div>
                                                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Settings</span> <code className="bg-secondary/30 px-2 py-0.5 rounded text-primary font-mono">Alt + S</code></div>
                                                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Maximize</span> <code className="bg-secondary/30 px-2 py-0.5 rounded text-primary font-mono">Alt + M</code></div>
                                                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Close</span> <code className="bg-secondary/30 px-2 py-0.5 rounded text-primary font-mono">Alt + W</code></div>
                                                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Find</span> <code className="bg-secondary/30 px-2 py-0.5 rounded text-primary font-mono">Alt + F</code></div>
                                                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Help</span> <code className="bg-secondary/30 px-2 py-0.5 rounded text-primary font-mono">Alt + H</code></div>
                                            </div>
                                            <button
                                                onClick={() => setShowShortcutsModal(false)}
                                                className="mt-6 w-full py-2 bg-secondary/20 hover:bg-secondary/40 rounded-lg text-sm text-foreground transition-colors"
                                            >
                                                Close
                                            </button>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* QR Modal */}
                            <AnimatePresence>
                                {showQRModal && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
                                        onClick={() => setShowQRModal(false)}
                                    >
                                        <motion.div
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.9, opacity: 0 }}
                                            className="bg-background/95 border border-primary/20 rounded-xl p-6 max-w-sm w-full shadow-2xl relative overflow-hidden flex flex-col items-center text-center"
                                            onClick={e => e.stopPropagation()}
                                        >
                                            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-full -mr-10 -mt-10" />
                                            <h3 className="text-lg font-display font-bold text-foreground mb-2">Mobile Access</h3>
                                            <p className="text-sm text-muted-foreground mb-6">Scan to continue on your phone</p>

                                            <div className="p-4 bg-white rounded-xl mb-6 shadow-inner flex items-center justify-center">
                                                <QrCode size={128} className="text-black/80" strokeWidth={1.5} />
                                            </div>

                                            <p className="text-xs text-muted-foreground mb-4">Make sure your devices are on the same network.</p>

                                            <button
                                                onClick={() => setShowQRModal(false)}
                                                className="w-full py-2 bg-primary hover:bg-primary/90 rounded-lg text-sm text-primary-foreground transition-colors font-medium"
                                            >
                                                Done
                                            </button>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Delete Confirmation Modal */}
                            <AnimatePresence>
                                {showDeleteConfirm && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
                                    >
                                        <motion.div
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.9, opacity: 0 }}
                                            className="bg-background/95 border border-red-500/30 rounded-xl p-6 max-w-sm w-full shadow-2xl relative overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-red-500/5 pointer-events-none" />

                                            <h3 className="text-lg font-display font-bold text-foreground mb-2 relative z-10">Clear History?</h3>
                                            <p className="text-sm text-muted-foreground mb-6 relative z-10 leading-relaxed">
                                                Are you sure you want to delete all chat history? This action cannot be undone.
                                            </p>

                                            <div className="flex justify-end gap-3 relative z-10">
                                                <button
                                                    onClick={() => setShowDeleteConfirm(false)}
                                                    className="px-4 py-2 text-sm text-foreground/70 hover:text-foreground transition-colors font-medium"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={confirmDelete}
                                                    className="px-4 py-2 text-sm bg-red-500/20 text-red-400 border border-red-500/30 rounded-md hover:bg-red-500/30 transition-all font-bold tracking-wide"
                                                >
                                                    DELETE
                                                </button>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Search Modal */}
                            <AnimatePresence>
                                {isSearchOpen && (
                                    <div className="absolute inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
                                        <motion.div
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="w-full max-w-md bg-background border border-primary/20 rounded-xl shadow-2xl flex flex-col max-h-[60vh] overflow-hidden"
                                        >
                                            <div className="p-3 border-b border-white/5 flex items-center gap-3 shrink-0">
                                                <Search className="text-muted-foreground/70" size={16} />
                                                <input
                                                    autoFocus
                                                    className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-sm"
                                                    placeholder="Search history..."
                                                    value={searchQuery}
                                                    onChange={e => setSearchQuery(e.target.value)}
                                                />
                                                <button
                                                    onClick={() => setIsSearchOpen(false)}
                                                    className="text-muted-foreground hover:text-foreground p-1"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                            <div className="overflow-y-auto p-2 flex-1 custom-scrollbar">
                                                {(() => {
                                                    const filtered = sessions.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()));
                                                    if (filtered.length === 0) {
                                                        return <div className="p-8 text-center text-muted-foreground text-sm">No results found</div>;
                                                    }

                                                    const now = new Date();
                                                    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
                                                    const yesterdayStart = todayStart - 86400000;
                                                    const lastWeekStart = todayStart - 86400000 * 7;

                                                    const groups: Record<string, ChatSession[]> = {
                                                        'Today': [],
                                                        'Yesterday': [],
                                                        'Previous 7 Days': [],
                                                        'Older': []
                                                    };

                                                    filtered.forEach(session => {
                                                        if (session.createdAt >= todayStart) groups['Today'].push(session);
                                                        else if (session.createdAt >= yesterdayStart) groups['Yesterday'].push(session);
                                                        else if (session.createdAt >= lastWeekStart) groups['Previous 7 Days'].push(session);
                                                        else groups['Older'].push(session);
                                                    });

                                                    return Object.entries(groups).map(([label, groupSessions]) => {
                                                        if (groupSessions.length === 0) return null;
                                                        return (
                                                            <div key={label} className="mb-4 last:mb-0">
                                                                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</div>
                                                                <div className="space-y-0.5">
                                                                    {groupSessions.map(session => (
                                                                        <button
                                                                            key={session.id}
                                                                            onClick={() => {
                                                                                handleLoadSession(session.id);
                                                                                setIsSearchOpen(false);
                                                                            }}
                                                                            className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-3 text-sm transition-colors ${currentSessionId === session.id
                                                                                ? 'bg-primary/20 text-primary'
                                                                                : 'hover:bg-primary/10 text-foreground/80 hover:text-foreground'
                                                                                }`}
                                                                        >
                                                                            <MessageSquare size={14} className="shrink-0 opacity-70" />
                                                                            <span className="truncate">{session.title}</span>
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        );
                                                    });
                                                })()}
                                            </div>
                                        </motion.div>
                                    </div>
                                )}
                            </AnimatePresence>
                        </motion.div >
                    )}
                </AnimatePresence >

                {/* Toggle Button */}
                {/* Toggle Button - Glowing Star */}
                <motion.button
                    id="chatbot-toggle-btn"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative group focus:outline-none"
                >
                    {/* Pulsing Glow Background */}
                    <div className="absolute inset-0 bg-primary/60 blur-[20px] rounded-full animate-pulse-glow" />

                    {/* Rotating Star Container */}
                    <motion.div
                        className="w-16 h-16 flex items-center justify-center relative z-10"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    >
                        {/* 5-Point Star Shape */}
                        <svg viewBox="0 0 24 24" fill="hsl(185, 100%, 70%)" className="w-12 h-12 drop-shadow-[0_0_15px_rgba(0,255,255,0.8)]">
                            <path d="M12 2 L15.09 8.26 L22 9.27 L17 14.14 L18.18 21.02 L12 17.77 L5.82 21.02 L7 14.14 L2 9.27 L8.91 8.26 Z" />
                        </svg>
                    </motion.div>


                </motion.button>
            </div >

            <AnimatePresence>
                {tourStep > 0 && <TourOverlay step={tourStep} setStep={setTourStep} onClose={() => setTourStep(0)} />}
            </AnimatePresence>
        </>
    );
};

function TourOverlay({ step, setStep, onClose }: { step: number; setStep: (s: number) => void; onClose: () => void }) {
    const [pos, setPos] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

    const steps = [
        { id: 'tour-sidebar-top', title: 'Sidebar Controls', desc: 'Toggle the sidebar to save space, or check the Bot status.' },
        { id: 'tour-new-chat', title: 'New Chat', desc: 'Start a fresh conversation here.' },
        { id: 'tour-search', title: 'Search', desc: 'Find past conversations quickly.' },
        { id: 'tour-recent', title: 'Recent History', desc: 'Access your recent chats here.' },
        { id: 'tour-settings', title: 'Settings', desc: 'Configure options and manage data.' },
        { id: 'tour-clear-history', title: 'Clear History', desc: 'Permanently delete all data if needed.' },
    ];

    const current = steps[step - 1];

    useEffect(() => {
        const updatePos = () => {
            // Handle case where element might be inside a hidden parent becoming visible
            const el = document.getElementById(current.id);
            if (el) {
                const rect = el.getBoundingClientRect();
                setPos({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
            }
        };
        // Delay slightly to allow transitions (sidebar opening, etc)
        const timer = setTimeout(updatePos, 300);
        window.addEventListener('resize', updatePos);
        return () => {
            window.removeEventListener('resize', updatePos);
            clearTimeout(timer);
        };
    }, [step, current.id]);

    if (!pos) return null;

    return (
        <div className="fixed inset-0 z-[200] overflow-hidden">
            {/* Cutout Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 transition-all duration-300"
                style={{
                    clipPath: `polygon(
                        0% 0%, 0% 100%, 
                        ${pos.left}px 100%, 
                        ${pos.left}px ${pos.top}px, 
                        ${pos.left + pos.width}px ${pos.top}px, 
                        ${pos.left + pos.width}px ${pos.top + pos.height}px, 
                        ${pos.left}px ${pos.top + pos.height}px, 
                        ${pos.left}px 100%, 
                        100% 100%, 100% 0%
                    )`
                }}
                onClick={onClose}
            />
            {/* Highlight Border */}
            <motion.div
                className="absolute border-2 border-primary rounded-md pointer-events-none box-border shadow-[0_0_20px_rgba(var(--primary),0.5)]"
                initial={false}
                animate={{ top: pos.top - 4, left: pos.left - 4, width: pos.width + 8, height: pos.height + 8 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />

            {/* Tooltip */}
            <motion.div
                className="absolute bg-popover text-popover-foreground p-4 rounded-lg shadow-xl max-w-xs border border-primary/20 bg-background"
                style={{
                    top: pos.top + pos.height + 16 > window.innerHeight - 150 ? pos.top - 150 : pos.top + pos.height + 16,
                    left: pos.left + 320 > window.innerWidth ? window.innerWidth - 340 : pos.left
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                key={step}
            >
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-sm text-primary">{current.title}</h3>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={14} /></button>
                </div>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{current.desc}</p>
                <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground font-mono">{step} / {steps.length}</span>
                    <div className="flex gap-2">
                        {step > 1 && (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="px-3 py-1 text-xs rounded hover:bg-secondary transition-colors"
                            >
                                Back
                            </button>
                        )}
                        <button
                            onClick={() => {
                                if (step < steps.length) setStep(step + 1);
                                else onClose();
                            }}
                            className="bg-primary text-primary-foreground px-3 py-1 text-xs rounded hover:bg-primary/90 transition-colors font-medium"
                        >
                            {step === steps.length ? 'Finish' : 'Next'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default Chatbot;
