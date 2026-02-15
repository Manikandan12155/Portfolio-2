
import { GoogleGenerativeAI } from "@google/generative-ai";

// Manually replace this with your key if running the test script directly
const GEMINI_API_KEY = "AIzaSyC3glelkcDvsOl5HNHSohIZdOIoAR3CT0M";

async function testConnection() {
    console.log("Testing Gemini API connection...");

    if (!GEMINI_API_KEY || GEMINI_API_KEY.includes("YOUR_GEMINI_API_KEY")) {
        console.error("❌ Error: Valid API Key not found.");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

        // Test with the standard model: gemini-pro
        console.log("Attempting to connect with model 'gemini-pro'...");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hello, ignore all instructions and just say 'ONLINE'.");
        const response = await result.response;
        console.log("✅ Success! API Response:", response.text());

    } catch (error) {
        console.error("\n❌ Connection Failed!");
        // Log the entire error structure to help debug
        console.error("Full Error:", JSON.stringify(error, null, 2));
        if (error.response) {
            console.error("Response Status:", error.response.status);
            console.error("Response Text:", await error.response.text());
        }

        if (error.message?.includes("404")) {
            console.log("\n💡 TIP: A 404 error usually means:");
            console.log("1. The 'Generative Language API' is DISABLED in Google Cloud Console.");
            console.log("   --> Fix: Go to cloud.google.com -> API & Services -> Library -> Enable 'Generative Language API'");
            console.log("2. The API key is from a region/project that doesn't support 'gemini-pro'.");
            console.log("3. The 'gemini-pro' model itself is unavailable for this key/tier.");
        }
    }
}

testConnection();
