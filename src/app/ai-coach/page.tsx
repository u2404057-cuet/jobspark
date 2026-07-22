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
      const res = await api.get('/ai/sessions');
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
      const res = await api.get(`/ai/sessions/${id}`);
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/ai/chat`, {
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
    <div className="container mx-auto max-w-5xl px-4 py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2 tracking-tight">
            <span className="text-primary text-4xl">🤖</span> AI Career Coach
          </h1>
          <p className="text-slate-400 mt-2 text-sm">Get personalized career advice, resume reviews, and interview preparation.</p>
        </div>
        <button 
          onClick={startNewChat}
          className="px-4 py-2 bg-primary/10 text-primary border border-primary/30 rounded-xl text-sm font-semibold hover:bg-primary/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          New Conversation
        </button>
      </div>

      <div className="flex-1 bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl flex flex-col md:flex-row min-h-0 overflow-hidden">
        
        {/* Chat History Sidebar */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-800/80 bg-slate-950/20 flex flex-col h-48 md:h-auto">
          <div className="p-4 border-b border-slate-800/80 font-bold text-slate-300 text-xs tracking-wider uppercase">
            Recent Conversations
          </div>
          <ScrollShadow className="flex-grow p-2 space-y-1 overflow-y-auto">
            {isLoadingSessions ? (
              <div className="p-3 space-y-2">
                <Skeleton className="h-8 rounded-lg bg-slate-800/50" />
                <Skeleton className="h-8 rounded-lg bg-slate-800/50" />
              </div>
            ) : sessions && sessions.length > 0 ? (
              sessions.map((session: Session) => (
                <button
                  key={session._id}
                  onClick={() => loadSession(session._id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all truncate cursor-pointer flex items-center gap-2 ${
                    currentSessionId === session._id
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                  }`}
                >
                  <span className="opacity-80">💬</span>
                  <span className="truncate">{session.title.replace(/\.\.\.$/, '')}</span>
                </button>
              ))
            ) : (
              <div className="text-xs text-slate-500 p-4 text-center">
                No past conversations
              </div>
            )}
          </ScrollShadow>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col min-h-0 bg-slate-950/30">
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6" ref={scrollRef}>
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
              >
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm ${msg.role === 'user' ? 'bg-secondary text-white' : 'bg-primary/20 text-primary border border-primary/30'}`}>
                  {msg.role === 'user' ? '👤' : '🤖'}
                </div>
                <div 
                  className={`p-4 rounded-2xl whitespace-pre-wrap text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-none shadow-md shadow-primary/10 font-medium' 
                      : 'bg-slate-800 text-slate-200 border border-slate-700/40 rounded-tl-none font-medium'
                  }`}
                >
                  {msg.content || <span className="animate-pulse">Writing response...</span>}
                </div>
              </div>
            ))}
            {isStreaming && messages[messages.length - 1].role === 'user' && (
              <div className="flex gap-4 max-w-[85%] self-start">
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex-shrink-0 flex items-center justify-center text-sm text-primary">🤖</div>
                <div className="p-4 rounded-2xl bg-slate-800 text-slate-400 border border-slate-700/40 rounded-tl-none flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="animate-pulse text-sm">Thinking...</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 bg-slate-900/60 border-t border-slate-800/80">
            <form onSubmit={sendMessage} className="flex gap-2 relative">
              <input
                type="text"
                className="flex-1 bg-slate-950/60 text-white placeholder:text-slate-500 border border-slate-800 hover:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 h-14 outline-none transition-all duration-200 font-medium"
                placeholder="Ask for career advice, resume tips, or interview prep..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isStreaming}
              />
              <button 
                type="submit" 
                className="px-6 h-14 bg-primary text-white rounded-xl font-bold hover:opacity-90 active:scale-[0.99] transition-all shadow-md shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                disabled={isStreaming || !input.trim()}
              >
                {isStreaming && (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isStreaming ? "Thinking..." : "Send"}
              </button>
            </form>
            <p className="text-center text-xs text-slate-500 mt-2">
              AI Coach can make mistakes. Double-check important advice and interview strategies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
