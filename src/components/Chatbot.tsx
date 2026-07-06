import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, Maximize2, Minimize2, Plus, Search, Settings, Trash2, PanelLeftClose, PanelLeftOpen, Star, User, ArrowRight, HelpCircle, Edit2, Share2, Pin, PinOff, Rocket, Check, QrCode, Keyboard, PlayCircle, MessageSquareDashed, Menu, Loader2 } from "lucide-react";
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
                return <strong key={part + i} className="font-semibold">{part.slice(2, -2)}</strong>; // NOSONAR - text parts are stable
            }
            return part;
        });
    };

    return (
        <div className="space-y-1">
            {text.split('\n').map((line, i) => {
                const trimmed = line.trim();
                if (!trimmed && i === text.split('\n').length - 1) return null;
                if (!trimmed) return <div key={`empty-${i}`} className="h-2" />; // NOSONAR - static text index is stable

                if (trimmed.startsWith('• ') || trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
                    return (
                        <div key={`bullet-${i}`} className="flex items-start gap-2 pl-1"> {/* NOSONAR - static text index is stable */}
                            <span className="opacity-70 mt-1.5 text-[10px] scale-75">●</span>
                            <span className="flex-1 leading-relaxed">{parseBold(trimmed.substring(2))}</span>
                        </div>
                    );
                }

                return <p key={`line-${i}`} className="leading-relaxed">{parseBold(line)}</p>; // NOSONAR - static text index is stable
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

    return (
        <span className="relative">
            <FormattedText text={display} />
            {display.length < text.length && (
                <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block w-1.5 h-4 bg-[#70ff9b] ml-1 align-middle shadow-[0_0_8px_#70ff9b]"
                />
            )}
        </span>
    );
};

const Chatbot = () => { // NOSONAR - Fix requires business logic changes and may impact functionality
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeView, setActiveView] = useState<'chat' | 'settings'>('chat');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

    // Auto-collapse sidebar in small view, auto-expand in full view
    useEffect(() => {
        if (isExpanded) {
            setIsSidebarOpen(true);
        } else {
            setIsSidebarOpen(false);
        }
    }, [isExpanded]);

    // Initialize sessions from localStorage
    const [sessions, setSessions] = useState<ChatSession[]>(() => {
        if (globalThis.window !== undefined) {
            const saved = globalThis.window.localStorage.getItem("chat_sessions");
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });

    const [currentSessionId, setCurrentSessionId] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
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
    const [loadingPhase, setLoadingPhase] = useState(0);

    useEffect(() => {
        if (isTyping && messages.filter(m => m.sender === 'user').length === 1) {
            const interval = setInterval(() => {
                setLoadingPhase(p => (p + 1) % 5);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [isTyping, messages]);

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
    }, []); // Only run on mount to avoid overriding New Chat on toggle

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

        const updateSession = (s: ChatSession) => {
            if (s.id !== currentSessionId) return s;

            let title = s.title;
            if (title === "New Chat") {
                const firstUserMsg = messages.find(m => m.sender === "user");
                if (firstUserMsg) {
                    title = firstUserMsg.text.slice(0, 30) + (firstUserMsg.text.length > 30 ? "..." : "");
                }
            }
            return { ...s, messages, title };
        };

        setSessions(prev => prev.map(updateSession));
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

        globalThis.window.addEventListener('keydown', handleKeyDown);
        return () => globalThis.window.removeEventListener('keydown', handleKeyDown);
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
            const response = await fetch("https://portfolio-backend-c9uc.onrender.com/chat", {
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
                            initial={{ clipPath: "circle(0% at 100% 100%)", scale: 0.95 }}
                            animate={{ clipPath: "circle(150% at 100% 100%)", scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
                            exit={{ clipPath: "circle(0% at 100% 100%)", scale: 0.95, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
                            className={`border border-cyan-500/30 rounded-lg overflow-hidden flex flex-col shadow-2xl transition-all duration-300 ease-in-out bg-[#020204]/80 backdrop-blur-md ${isExpanded
                                ? "fixed inset-0 m-auto z-[100] w-[95vw] md:w-[1000px] h-[85dvh] md:h-[80vh]"
                                : "mb-4 w-[calc(100vw-24px)] xs:w-80 md:w-96 h-[60dvh] md:h-[450px]"
                                } shadow-[0_0_40px_rgba(56,189,248,0.15)]`}
                            style={{ maxHeight: isExpanded ? "90dvh" : "550px" }}
                        >
                            <div className="crt-scanline"></div>
                            {/* Header */}
                            {/* Header */}
                            <div className="bg-black/60 p-4 border-b border-cyan-500/30 flex justify-between items-center shrink-0 relative z-10">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                        className="text-[#00f2ff] hover:bg-[#00f2ff]/10 p-1.5 rounded transition-all"
                                        title="Toggle Sidebar"
                                    >
                                        <Menu size={18} />
                                    </button>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                                            <span className="font-mono text-[10px] font-bold text-[#00f2ff] tracking-[0.2em] uppercase">
                                                NASA | MISSION CONTROL CENTER
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 mt-1">
                                            <span className="text-[8px] font-mono text-[#00f2ff]/60 uppercase tracking-tighter">LINK: ACTIVE</span>
                                            <span className="text-[8px] font-mono text-[#00f2ff]/60 uppercase tracking-tighter hidden xs:inline">LATENCY: 42MS</span>
                                            <span className="text-[8px] font-mono text-[#00f2ff]/60 uppercase tracking-tighter hidden xs:inline">SIG: HIGH</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* Temporary Chat Button */}
                                    <button
                                        onClick={handleTemporaryChat}
                                        className={`text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-white/5 ${isTemporaryChat ? 'text-primary bg-primary/10' : ''
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
                                                    <button type="button" aria-label="Close overlay" className="fixed inset-0 z-40 bg-transparent border-none outline-none cursor-default w-full h-full" onClick={() => setShowHelpMenu(false)} />
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

                            {/* Content Wrapper */}
                            <div className="flex flex-1 min-h-0 overflow-hidden">
                                {/* Sidebar */}
                                <div className={`flex border-r border-cyan-500/30 bg-black/40 flex-col gap-2 shrink-0 h-full overflow-hidden transition-all duration-300 relative z-10 ${isSidebarOpen ? 'w-48 md:w-64 p-4' : 'w-12 md:w-16 p-2 items-center'}`}>
                                    <div id="tour-sidebar-top" className={`flex items-center shrink-0 mb-4 ${isSidebarOpen ? 'justify-between px-1' : 'justify-center'}`}>
                                        {isSidebarOpen ? (
                                            <>
                                                <div className="text-[#00f2ff] drop-shadow-[0_0_8px_rgba(0,242,255,0.4)]">
                                                    <Bot size={22} />
                                                </div>
                                                <button
                                                    onClick={() => setIsSidebarOpen(false)}
                                                    className="text-[#00f2ff]/60 hover:text-[#00f2ff] transition-colors p-1 hover:bg-[#00f2ff]/10 rounded font-mono hidden md:block"
                                                    title="Collapse sidebar"
                                                >
                                                    <PanelLeftClose size={18} />
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => setIsSidebarOpen(true)}
                                                className="text-[#00f2ff]/60 hover:text-[#00f2ff] transition-colors p-1 hover:bg-[#00f2ff]/10 rounded font-mono"
                                                title="Expand sidebar"
                                            >
                                                <PanelLeftOpen size={18} />
                                            </button>
                                        )}
                                    </div>

                                    <button
                                        id="tour-new-chat"
                                        onClick={handleNewChat}
                                        className={`flex items-center gap-3 rounded-md hover:bg-[#00f2ff]/10 text-xs font-mono transition-colors shrink-0 ${isSidebarOpen ? 'px-3 py-2 text-left border border-[#00f2ff]/20 mb-2 bg-[#00f2ff]/5 text-[#00f2ff] w-full uppercase tracking-wider' : 'p-2 justify-center mb-2'}`}
                                        title="New Chat"
                                    >
                                        <Plus size={16} className="text-[#00f2ff]" />
                                        {isSidebarOpen && <span>New Session</span>}
                                    </button>

                                    <button
                                        id="tour-search"
                                        onClick={() => { setIsSearchOpen(true); setSearchQuery(""); }}
                                        className={`flex items-center gap-3 rounded-md hover:bg-[#00f2ff]/10 text-xs font-mono transition-colors shrink-0 ${isSidebarOpen ? 'px-3 py-2 text-left border border-[#00f2ff]/10 mb-4 bg-transparent text-[#00f2ff]/60 hover:text-[#00f2ff] w-full uppercase tracking-wider' : 'p-2 justify-center mb-4 text-[#00f2ff]/60'}`}
                                        title="Search logs"
                                    >
                                        <Search size={16} />
                                        {isSidebarOpen && <span>Search Logs...</span>}
                                    </button>

                                    {isSidebarOpen && (
                                        <div id="tour-recent" className="flex-1 overflow-y-auto scroll-smooth min-h-0 flex flex-col gap-1 pr-1 custom-scrollbar w-full" style={{ WebkitOverflowScrolling: 'touch' }}>
                                            <div className="text-[10px] font-mono font-medium text-[#00f2ff]/40 mb-2 px-2 uppercase tracking-[0.2em] sticky top-0 bg-black/40 backdrop-blur-xl py-1 z-10 border-b border-[#00f2ff]/10">Recent Logs</div>
                                            {[...sessions].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)).map(session => (
                                                <div
                                                    key={session.id}
                                                    className={`group relative flex items-center gap-3 px-3 py-2 rounded transition-colors w-full cursor-pointer font-mono text-[11px] ${currentSessionId === session.id ? 'bg-[#00f2ff]/20 text-[#00f2ff] border border-[#00f2ff]/30 shadow-[0_0_10px_rgba(0,242,255,0.1)]' : 'text-[#00f2ff]/60 hover:text-[#00f2ff] hover:bg-[#00f2ff]/10'
                                                        }`}
                                                    role="menuitem"
                                                    tabIndex={0}
                                                    onKeyDown={(e) => { if (e.key === 'Enter') handleLoadSession(session.id) }}
                                                    onClick={() => handleLoadSession(session.id)}
                                                >
                                                    {session.pinned ? <Pin size={12} className="shrink-0 text-[#00f2ff] rotate-45 fill-[#00f2ff]/20" /> : <MessageSquare size={12} className="shrink-0" />}

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
                                                        <div className={`transition-opacity flex items-center opacity-100`}>
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
                                                            <button type="button" aria-label="Close menu" className="fixed inset-0 z-40 bg-transparent border-none outline-none cursor-default w-full h-full" onClick={(e) => { e.stopPropagation(); setActiveMenuSessionId(null); }} />
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

                                    <div className={`pt-2 mt-auto border-t border-[#00f2ff]/10 shrink-0 ${isSidebarOpen ? 'w-full' : 'w-full flex justify-center'}`}>
                                        <button
                                            id="tour-settings"
                                            onClick={() => setActiveView('settings')}
                                            className={`flex items-center gap-3 rounded hover:bg-[#00f2ff]/10 text-xs font-mono uppercase tracking-widest transition-colors ${isSidebarOpen ? 'px-3 py-2 text-left w-full' : 'p-2 justify-center'} ${activeView === 'settings' ? 'text-[#00f2ff] bg-[#00f2ff]/10' : 'text-[#00f2ff]/60 hover:text-[#00f2ff]'}`}
                                            title="Settings"
                                        >
                                            <Settings size={16} />
                                            {isSidebarOpen && <span>Settings</span>}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-transparent">
                                    {activeView === 'chat' ? (
                                        !userName ? ( // NOSONAR - Fix requires business logic changes and may impact functionality
                                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95 duration-500">
                                                <div className="mb-6 relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24">
                                                    {/* Sound Waves / Ripples */}
                                                    {isSpeaking && [0, 1, 2].map((i) => (
                                                        <motion.div
                                                            key={i}
                                                            className="absolute inset-0 rounded-full border border-[#00f2ff]"
                                                            initial={{ scale: 1, opacity: 0.8 }}
                                                            animate={{ scale: 2.5, opacity: 0 }}
                                                            transition={{
                                                                duration: 2,
                                                                repeat: Infinity,
                                                                ease: "easeOut",
                                                                delay: i * 0.6,
                                                            }}
                                                        />
                                                    ))}

                                                    <div className="absolute inset-0 bg-[#00f2ff]/20 blur-[20px] rounded-full animate-pulse-glow" />
                                                    <motion.img
                                                        src={`${import.meta.env.BASE_URL}alien.png`}
                                                        alt="ZETA-9 AI"
                                                        animate={isSpeaking ? {
                                                            scale: [1, 1.05, 1],
                                                            filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"],
                                                        } : { scale: 1, filter: "brightness(1)" }}
                                                        transition={isSpeaking ? { duration: 0.2, repeat: Infinity, ease: "linear" } : {}}
                                                        className="w-full h-full object-cover rounded-full drop-shadow-[0_0_15px_rgba(0,242,255,0.8)] border border-cyan-500/30 relative z-10"
                                                    />
                                                </div>
                                                <h2 className="text-2xl font-bold font-display text-[#00f2ff] mb-1 uppercase tracking-widest drop-shadow-[0_0_8px_rgba(0,242,255,0.5)]">ZETA-9</h2>
                                                <h3 className="text-lg font-medium text-foreground mb-3">Welcome!</h3>
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
                                                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95 duration-500 relative z-10">
                                                        <div className="bg-[#00f2ff]/10 p-6 rounded-full mb-6 relative group border border-[#00f2ff]/30 shadow-[0_0_20px_rgba(0,242,255,0.2)]">
                                                            <div className="absolute inset-0 bg-[#00f2ff]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            <Bot size={48} className="text-[#00f2ff] relative z-10" />
                                                        </div>
                                                        <h2 className="text-2xl md:text-3xl font-mono font-bold text-[#00f2ff] mb-3 uppercase tracking-tighter">
                                                            Systems Online, {userName}
                                                        </h2>
                                                        <p className="text-[#00f2ff]/60 max-w-xs mx-auto text-sm leading-relaxed font-mono uppercase">
                                                            Awaiting telemetry requests regarding Manikandan's mission logs.
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="flex-1 overflow-y-auto scroll-smooth min-h-0 p-4 space-y-4" style={{ WebkitOverflowScrolling: 'touch' }}>
                                                        {messages.map((msg) => (
                                                            <div
                                                                key={msg.id}
                                                                className={`flex flex-col mb-4 ${msg.sender === "user" ? "items-end text-right" : "items-start"}`}
                                                            >
                                                                <div className={`flex items-center gap-2 mb-1 px-1 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                                                                    <span className="text-[10px] font-mono text-[#00f2ff]/40">
                                                                        [{new Date(msg.id).toLocaleTimeString([], { hour12: false })}]
                                                                    </span>
                                                                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${msg.sender === "user" ? "text-[#00f2ff]" : "text-[#70ff9b]"}`}>
                                                                        {msg.sender === "user" ? (userName || "PILOT") : "CAPCOM"}
                                                                    </span>
                                                                    <span className="text-[10px] font-mono text-[#00f2ff]/60">{msg.sender === "user" ? "<<" : ">>"}</span>
                                                                </div>
                                                                <div
                                                                    className={`max-w-[95%] px-0 py-0 bg-transparent text-sm font-mono leading-relaxed ${msg.sender === "user"
                                                                        ? "text-[#00f2ff]"
                                                                        : "text-[#70ff9b]"
                                                                        }`}
                                                                >
                                                                    {msg.sender === "bot" ? (
                                                                        msg.shouldAnimate ? ( // NOSONAR - Fix requires business logic changes and may impact functionality
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
                                                        {/* Rocket Typing Indicator / Boot Sequence */}
                                                        {(isTyping || isLaunching) && messages[messages.length - 1]?.sender === "user" && (
                                                            <div className="flex justify-start my-2">
                                                                {messages.filter(m => m.sender === 'user').length === 1 ? (
                                                                    <div className="flex flex-col gap-2 font-mono text-[10px] sm:text-xs">
                                                                        <div className="flex items-center gap-3">
                                                                            <Loader2 size={14} className="text-[#00f2ff] animate-spin" />
                                                                            <span className="text-[#00f2ff] animate-pulse">
                                                                                {
                                                                                    [
                                                                                        "Establishing deep space connection...",
                                                                                        "Bypassing quantum security protocols...",
                                                                                        "Routing signal through Orion relays...",
                                                                                        "Waking up ZETA-9 Neural Network...",
                                                                                        "Analyzing user intent parameters..."
                                                                                    ][loadingPhase]
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex gap-1 mt-1 ml-6">
                                                                            <div className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] animate-bounce" style={{ animationDelay: "0ms" }} />
                                                                            <div className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] animate-bounce" style={{ animationDelay: "150ms" }} />
                                                                            <div className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] animate-bounce" style={{ animationDelay: "300ms" }} />
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="bg-transparent border-none flex items-center justify-center relative w-16 h-8">
                                                                        <div className="flex items-center justify-center w-full h-full relative">
                                                                            <motion.div
                                                                                className="relative flex items-center drop-shadow-[0_0_15px_rgba(0,242,255,0.8)] z-50"
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
                                                                                <Rocket size={20} className="text-[#00f2ff] fill-[#00f2ff]/10 rotate-45 z-10" />

                                                                                {/* Main Engine Blast - Behind (Left) */}
                                                                                <motion.div
                                                                                    className="absolute right-[16px] top-1/2 -translate-y-1/2 w-8 h-3 bg-gradient-to-l from-[#00f2ff] via-[#70ff9b] to-transparent rounded-l-full blur-[2px]"
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
                                                                )}
                                                            </div>
                                                        )}
                                                        <div ref={messagesEndRef} />
                                                    </div>
                                                )}

                                                {/* Input */}
                                                <form onSubmit={handleSend} className="p-3 border-t border-[#00f2ff]/20 bg-[#001a24]/95 shrink-0 relative z-10">
                                                    <div className="flex gap-2 items-center">
                                                        <span className="text-[#00f2ff] font-bold font-mono text-sm ml-1">$</span>
                                                        <input
                                                            type="text"
                                                            value={input}
                                                            onChange={(e) => setInput(e.target.value)}
                                                            placeholder="ENTER COMMAND..."
                                                            className="flex-1 bg-transparent border-none text-[#00f2ff] font-mono text-sm placeholder:text-[#00f2ff]/30 focus:outline-none py-2"
                                                        />
                                                        <button
                                                            type="submit"
                                                            className="p-2 text-[#00f2ff] hover:bg-[#00f2ff]/10 rounded transition-colors"
                                                            disabled={!input.trim() || isTyping}
                                                        >
                                                            {isTyping ? <Star size={16} className="animate-spin text-[#00f2ff]" /> : <Send size={16} />}
                                                        </button>
                                                    </div>
                                                </form>
                                            </>
                                        )) : (
                                        /* Settings View */
                                        <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto scroll-smooth relative z-10 font-mono" style={{ WebkitOverflowScrolling: 'touch' }}>
                                            <h2 className="text-xl font-bold text-[#00f2ff] border-b border-[#00f2ff]/20 pb-4 uppercase tracking-[0.2em]">User Profile / Configuration</h2>

                                            <div className="space-y-4">
                                                {/* Profile Settings */}
                                                <div className="p-4 rounded bg-[#001822]/60 border border-[#00f2ff]/20 space-y-4 shadow-inner">
                                                    <h3 className="text-[10px] font-bold text-[#00f2ff]/40 uppercase tracking-[0.2em]">Pilot Credentials</h3>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-[#00f2ff]/10 rounded border border-[#00f2ff]/20 text-[#00f2ff]">
                                                                <User size={20} />
                                                            </div>
                                                            {isEditingName ? (
                                                                <input
                                                                    className="bg-transparent border-b border-[#00f2ff]/50 text-[#00f2ff] focus:outline-none px-1 py-0.5 min-w-[150px] font-mono"
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
                                                                    <span className="font-bold text-[#00f2ff] uppercase tracking-wider">{userName || "UNASSIGNED"}</span>
                                                                    <span className="text-[10px] text-[#00f2ff]/40 uppercase">Designation</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {isEditingName ? (
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={handleUpdateName}
                                                                    className="p-1.5 bg-[#70ff9b]/10 hover:bg-[#70ff9b]/20 text-[#70ff9b] rounded border border-[#70ff9b]/30 transition-colors"
                                                                    title="Update Designation"
                                                                >
                                                                    <Check size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => setIsEditingName(false)}
                                                                    className="p-1.5 hover:bg-red-500/20 text-[#00f2ff]/60 hover:text-red-400 rounded transition-colors"
                                                                    title="Abort"
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
                                                                className="p-2 hover:bg-[#00f2ff]/10 rounded border border-transparent hover:border-[#00f2ff]/20 text-[#00f2ff]/60 hover:text-[#00f2ff] transition-colors"
                                                                title="Edit Credentials"
                                                            >
                                                                <Edit2 size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="p-4 rounded bg-[#001822]/60 border border-[#00f2ff]/20 space-y-4">
                                                    <h3 className="text-[10px] font-bold text-[#00f2ff]/40 uppercase tracking-[0.2em]">Data & Storage</h3>
                                                    <button
                                                        id="tour-clear-history"
                                                        onClick={handleClearAllHistory}
                                                        className="flex items-center gap-3 w-full px-4 py-3 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition-all text-xs font-bold uppercase tracking-widest"
                                                    >
                                                        <Trash2 size={18} />
                                                        <span>Purge All Mission Logs</span>
                                                    </button>
                                                    <p className="text-[10px] text-[#00f2ff]/40 uppercase tracking-tighter">Warning: This action will permanently erase all local telemetry data.</p>
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
                                                                            onClick={() => { // NOSONAR - Fix requires business logic changes and may impact functionality
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

                {/* Toggle Button Container */}
                <div className="relative flex items-end justify-end w-full mt-4">
                    <AnimatePresence>
                        {!isOpen && (
                            <motion.div
                                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                                transition={{ type: "spring", damping: 12, stiffness: 150, delay: 0.5 }}
                                className="absolute right-20 bottom-2 w-max max-w-[200px] bg-black/60 backdrop-blur-md border border-cyan-500/40 p-3 rounded-xl rounded-br-sm shadow-[0_0_20px_rgba(0,242,255,0.2)] z-0"
                            >
                                <p className="text-[11px] font-mono leading-relaxed text-cyan-50">
                                    <span className="text-[#00f2ff] font-bold uppercase tracking-wider">Hi, Welcome! 👽</span><br />
                                    Ask me anything. I can tell you all about my boss's details.
                                </p>
                                {/* Triangle pointer */}
                                <div className="absolute bottom-3 -right-2 w-4 h-4 bg-black/60 border-t border-r border-cyan-500/40 rotate-45"></div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Toggle Button - Glowing Alien Face */}
                    <motion.button
                        id="chatbot-toggle-btn"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                            if (!isOpen) {
                                handleNewChat();

                                // Silent Wake-up Ping for Render Free Tier backend
                                fetch("https://portfolio-backend-c9uc.onrender.com/chat", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ userprompt: "wakeup_ping", history: [] })
                                }).catch(() => { /* Ignore errors, just want to trigger the cold start */ });
                                // Play AI Voice greeting ONLY if user name is not set
                                if (!userName && 'speechSynthesis' in window) {
                                    window.speechSynthesis.cancel(); // Stop any ongoing speech
                                    const utterance = new SpeechSynthesisUtterance("Hi, Welcome! Ask me anything. I can tell you all about my boss's details.");
                                    // Try to use Indian English voice, or default English
                                    const voices = window.speechSynthesis.getVoices();
                                    const indVoice = voices.find(v => v.lang === 'en-IN' || v.name.includes('India')) || voices.find(v => v.lang.startsWith('en-'));
                                    if (indVoice) utterance.voice = indVoice;

                                    // Alien/Robotic modulation (low pitch, slightly slower)
                                    utterance.pitch = 0.4;
                                    utterance.rate = 0.85;

                                    utterance.onstart = () => setIsSpeaking(true);
                                    utterance.onend = () => setIsSpeaking(false);
                                    utterance.onerror = () => setIsSpeaking(false);

                                    window.speechSynthesis.speak(utterance);
                                }
                            } else {
                                // Stop speaking if closed before finishing
                                setIsSpeaking(false);
                                if ('speechSynthesis' in window) {
                                    window.speechSynthesis.cancel();
                                }
                            }
                            setIsOpen(!isOpen);
                        }}
                        className="relative group focus:outline-none z-10"
                    >
                        {/* Pulsing Glow Background */}
                        <div className="absolute inset-0 bg-[#00f2ff]/30 blur-[20px] rounded-full animate-pulse-glow" />

                        {/* Floating Alien Face */}
                        <motion.div
                            className="w-16 h-16 flex items-center justify-center relative z-10"
                            animate={{ y: [-3, 3, -3] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <video
                                src={`${import.meta.env.BASE_URL}Alienmeme.mp4`}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-14 h-14 object-cover rounded-full drop-shadow-[0_0_15px_rgba(0,242,255,0.8)] border border-cyan-500/30"
                            />
                        </motion.div>
                    </motion.button>
                </div>
            </div >

            <AnimatePresence>
                {tourStep > 0 && <TourOverlay step={tourStep} setStep={setTourStep} onClose={() => setTourStep(0)} />}
            </AnimatePresence>
        </>
    );
};

function TourOverlay({ step, setStep, onClose }: { readonly step: number; readonly setStep: (s: number) => void; readonly onClose: () => void }) {
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
            <button
                type="button"
                aria-label="Close tour"
                className="absolute inset-0 bg-black/50 transition-all duration-300 border-none outline-none cursor-default block w-full h-full p-0 m-0"
                onClick={onClose}
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
