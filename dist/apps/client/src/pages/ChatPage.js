import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { Send } from "lucide-react";
export function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [sessionId] = useState(`session-${Date.now()}`);
    const chatMutation = useMutation({
        mutationFn: async (message) => {
            return apiRequest("/api/chat", {
                method: "POST",
                body: JSON.stringify({ message }),
                headers: { "x-session-id": sessionId }
            });
        },
        onSuccess: (data) => {
            setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
        }
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || chatMutation.isPending)
            return;
        setMessages(prev => [...prev, { role: "user", content: input }]);
        chatMutation.mutate(input);
        setInput("");
    };
    return (_jsxs("div", { className: "flex flex-col h-[calc(100vh-4rem)]", children: [_jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [messages.length === 0 && (_jsxs("div", { className: "text-center text-gray-500 mt-8", children: [_jsx("p", { className: "text-lg", children: "Welcome to your mental health support chat." }), _jsx("p", { children: "I'm here to listen and support you. How are you feeling today?" })] })), messages.map((msg, i) => (_jsx("div", { className: `flex ${msg.role === "user" ? "justify-end" : "justify-start"}`, "data-testid": `message-${msg.role}-${i}`, children: _jsx("div", { className: `max-w-[70%] rounded-lg px-4 py-2 ${msg.role === "user"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-900"}`, children: msg.content }) }, i))), chatMutation.isPending && (_jsx("div", { className: "flex justify-start", children: _jsx("div", { className: "bg-gray-200 rounded-lg px-4 py-2 text-gray-600", children: "Thinking..." }) }))] }), _jsx("form", { onSubmit: handleSubmit, className: "border-t p-4", children: _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), placeholder: "Share what's on your mind...", className: "flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", "data-testid": "input-chat-message", disabled: chatMutation.isPending }), _jsxs("button", { type: "submit", disabled: !input.trim() || chatMutation.isPending, className: "px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2", "data-testid": "button-send-chat", children: [_jsx(Send, { size: 18 }), "Send"] })] }) })] }));
}
