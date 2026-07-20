"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ScrollShadow, Skeleton } from "@heroui/react";
import toast from "react-hot-toast";

interface Message {
  role: 'user' | 'assistant' | 'model';
  content: string;
}

interface Session {
  _id: string;
  title: string;
  updatedAt: string;
}

export default function AICoachPage() {
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi there! I'm your AI Career Coach. How can I help you today? I can assist with resume review, interview prep, salary negotiation, or general career advice." }
  ]);
  const [input, setInput] = useState("");
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch session history
  const { data: sessions, isLoading: isLoadingSessions } = useQuery({
    queryKey: ['ai-sessions'],
    queryFn: async () => {
      const res = await api.get('/api/ai/sessions');
      return res.data;
    }
  });

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  const loadSession = async (id: string) => {
    try {
      const res = await api.get(`/api/ai/sessions/${id}`);
      setMessages(res.data.messages);
      setCurrentSessionId(id);
    } catch (error) {
      toast.error("Failed to load chat history");
    }
  };

  const startNewChat = () => {
    setMessages([
      { role: 'assistant', content: "Hi there! I'm your AI Career Coach. Let's start a new conversation." }
    ]);
    setCurrentSessionId(null);
  };

  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user message to UI immediately
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsStreaming(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${document.cookie}` // or rely on withCredentials if using axios, but fetch needs credentials: 'include'
        },
        credentials: 'include',
        body: JSON.stringify({
          message: userMessage,
          sessionId: currentSessionId
        })
      });

      if (!response.ok) throw new Error("Failed to send message");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let aiMessage = "";

      // Add empty AI message to UI
      setMessages(prev => [...prev, { role: 'assistant', content: "" }]);

      while (true) {
        const { value, done } = await reader!.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.chunk) {
                aiMessage += data.chunk;
                setMessages(prev => {
                  const newMsgs = [...prev];
                  newMsgs[newMsgs.length - 1].content = aiMessage;
                  return newMsgs;
                });
              } else if (data.done && data.sessionId) {
                if (!currentSessionId) {
                  setCurrentSessionId(data.sessionId);
                  queryClient.invalidateQueries({ queryKey: ['ai-sessions'] });
                }
              }
            } catch (e) {
              console.error("Error parsing SSE data", e);
            }
          }
        }
      }
    } catch (error) {
      toast.error("An error occurred during chat");
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 h-[calc(100vh-64px)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <span className="text-primary text-4xl">🤖</span> AI Career Coach
        </h1>
        <p className="text-muted-foreground mt-2">Get personalized career advice, resume reviews, and interview preparation.</p>
      </div>

      <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-xl flex flex-col min-h-0 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-bold">Chat History</h2>
          <button 
            onClick={startNewChat}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90"
          >
            New Chat
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6" ref={scrollRef}>
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
            >
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm ${msg.role === 'user' ? 'bg-secondary' : 'bg-primary/20'}`}>
                {msg.role === 'user' ? '👤' : '🤖'}
              </div>
              <div 
                className={`p-4 rounded-2xl whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-gray-100 rounded-tl-none text-foreground'
                }`}
              >
                {msg.content || <span className="animate-pulse">...</span>}
              </div>
            </div>
          ))}
          {isStreaming && messages[messages.length - 1].role === 'user' && (
            <div className="flex gap-4 max-w-[85%] self-start">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center text-sm">🤖</div>
              <div className="p-4 rounded-2xl bg-gray-100 rounded-tl-none text-foreground">
                <span className="animate-pulse">Thinking...</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <form onSubmit={sendMessage} className="flex gap-2 relative">
            <input
              type="text"
              className="flex-1 bg-white border border-gray-200 rounded-xl px-4 h-14 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="Ask for career advice, resume tips, or interview prep..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isStreaming}
            />
            <button 
              type="submit" 
              className="px-6 h-14 bg-primary text-white rounded-xl font-medium hover:opacity-90 disabled:opacity-50"
              disabled={isStreaming || !input.trim()}
            >
              Send
            </button>
          </form>
          <p className="text-center text-xs text-gray-400 mt-2">
            AI can make mistakes. Consider verifying important information.
          </p>
        </div>
      </div>
    </div>
  );
}
