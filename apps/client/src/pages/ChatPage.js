import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { Send, Copy, Trash2, Bot, User, Check } from "lucide-react";
import { AtmosphericBackground } from "@/components/atmospheric";
export function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [sessionId] = useState(`session-${Date.now()}`);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const messagesEndRef = useRef(null);
    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    const chatMutation = useMutation({
        mutationFn: async (message) => {
            return apiRequest("/api/chat", {
                method: "POST",
                body: JSON.stringify({ message }),
                headers: { "x-session-id": sessionId }
            });
        },
        onSuccess: (data) => {
            setMessages(prev => [...prev, {
                    role: "assistant",
                    content: data.reply,
                    timestamp: new Date()
                }]);
        }
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || chatMutation.isPending)
            return;
        setMessages(prev => [...prev, {
                role: "user",
                content: input,
                timestamp: new Date()
            }]);
        chatMutation.mutate(input);
        setInput("");
    };
    const handleCopy = async (content, index) => {
        await navigator.clipboard.writeText(content);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };
    const handleClearChat = () => {
        if (window.confirm("Are you sure you want to clear this conversation?")) {
            setMessages([]);
        }
    };
    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    return (_jsxs(_Fragment, { children: [_jsx(AtmosphericBackground, { scene: "serenity", intensity: "subtle", showParticles: true }), _jsxs("div", { className: "flex flex-col h-[calc(100vh-4rem)] bg-transparent relative z-10", children: [_jsxs("div", { className: "bg-white border-b px-6 py-4 flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-gray-900", children: "AI Chat Support" }), _jsx("p", { className: "text-sm text-gray-600", children: "Your compassionate mental health companion" })] }), messages.length > 0 && (_jsxs("button", { onClick: handleClearChat, className: "flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition", "data-testid": "button-clear-chat", children: [_jsx(Trash2, { size: 18 }), "Clear Chat"] }))] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-6 space-y-6", children: [messages.length === 0 && (_jsxs("div", { className: "text-center mt-12", children: [_jsx("div", { className: "inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-4", children: _jsx(Bot, { className: "text-blue-600", size: 40 }) }), _jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Welcome to AI Chat Support" }), _jsx("p", { className: "text-gray-600 max-w-md mx-auto", children: "I'm here to listen and support you. Share your thoughts, feelings, or concerns. Everything is confidential and judgment-free." }), _jsxs("div", { className: "mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl mx-auto", children: [_jsx("div", { className: "bg-white p-4 rounded-lg shadow text-left", children: _jsx("p", { className: "text-sm text-gray-600", children: "\uD83D\uDCAD How are you feeling today?" }) }), _jsx("div", { className: "bg-white p-4 rounded-lg shadow text-left", children: _jsx("p", { className: "text-sm text-gray-600", children: "\uD83C\uDF31 What's been on your mind?" }) }), _jsx("div", { className: "bg-white p-4 rounded-lg shadow text-left", children: _jsx("p", { className: "text-sm text-gray-600", children: "\uD83D\uDCAA How can I support you?" }) })] })] })), messages.map((msg, i) => (_jsxs("div", { className: `flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`, "data-testid": `message-${msg.role}-${i}`, children: [_jsx("div", { className: `flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${msg.role === "user" ? "bg-blue-500" : "bg-gray-300"}`, children: msg.role === "user" ? (_jsx(User, { className: "text-white", size: 20 })) : (_jsx(Bot, { className: "text-gray-700", size: 20 })) }), _jsxs("div", { className: `flex-1 max-w-[70%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`, children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-xs font-medium text-gray-600", children: msg.role === "user" ? "You" : "AI Support" }), _jsx("span", { className: "text-xs text-gray-400", children: formatTime(msg.timestamp) })] }), _jsx("div", { className: `rounded-lg px-4 py-3 ${msg.role === "user"
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-white text-gray-900 shadow"}`, children: _jsx("p", { className: "whitespace-pre-wrap", children: msg.content }) }), _jsx("button", { onClick: () => handleCopy(msg.content, i), className: `text-xs flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 transition ${msg.role === "user" ? "self-end" : "self-start"}`, "data-testid": `button-copy-${i}`, children: copiedIndex === i ? (_jsxs(_Fragment, { children: [_jsx(Check, { size: 12, className: "text-green-600" }), _jsx("span", { className: "text-green-600", children: "Copied!" })] })) : (_jsxs(_Fragment, { children: [_jsx(Copy, { size: 12, className: "text-gray-500" }), _jsx("span", { className: "text-gray-500", children: "Copy" })] })) })] })] }, i))), chatMutation.isPending && (_jsxs("div", { className: "flex gap-3", children: [_jsx("div", { className: "flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center", children: _jsx(Bot, { className: "text-gray-700", size: 20 }) }), _jsx("div", { className: "bg-white rounded-lg px-4 py-3 shadow", children: _jsxs("div", { className: "flex gap-2", children: [_jsx("div", { className: "w-2 h-2 bg-gray-400 rounded-full animate-pulse" }), _jsx("div", { className: "w-2 h-2 bg-gray-400 rounded-full animate-pulse", style: { animationDelay: "0.2s" } }), _jsx("div", { className: "w-2 h-2 bg-gray-400 rounded-full animate-pulse", style: { animationDelay: "0.4s" } })] }) })] })), _jsx("div", { ref: messagesEndRef })] }), _jsx("form", { onSubmit: handleSubmit, className: "bg-white border-t p-4", children: _jsxs("div", { className: "max-w-4xl mx-auto flex gap-3", children: [_jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), placeholder: "Share what's on your mind...", className: "flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent", "data-testid": "input-chat-message", disabled: chatMutation.isPending }), _jsxs("button", { type: "submit", disabled: !input.trim() || chatMutation.isPending, className: "px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 transition transform hover:scale-105", "data-testid": "button-send-chat", children: [_jsx(Send, { size: 18 }), _jsx("span", { className: "font-medium", children: "Send" })] })] }) })] })] }));
}
