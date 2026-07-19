"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardBody, Button, Input, ScrollShadow, Divider, Skeleton } from "@heroui/react";
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
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-140px)] max-h-[900px] flex gap-6 max-w-6xl">
      
      {/* Sidebar - Sessions */}
      <Card className="w-1/4 hidden lg:flex flex-col h-full bg-surface border border-border">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h2 className="font-bold">Chat History</h2>
          <Button size="sm" color="primary" variant="flat" onPress={startNewChat}>
            New Chat
          </Button>
        </div>
        <ScrollShadow className="flex-1 p-2">
          {isLoadingSessions ? (
            <div className="space-y-2 p-2">
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ) : sessions?.length === 0 ? (
            <p className="text-center text-muted text-sm mt-4">No previous chats</p>
          ) : (
            <div className="flex flex-col gap-1">
              {sessions?.map((s: Session) => (
                <Button 
                  key={s._id}
                  variant={currentSessionId === s._id ? "flat" : "light"}
                  color={currentSessionId === s._id ? "primary" : "default"}
                  className="justify-start truncate w-full"
                  onPress={() => loadSession(s._id)}
                >
                  <span className="truncate">{s.title}</span>
                </Button>
              ))}
            </div>
          )}
        </ScrollShadow>
      </Card>

      {/* Main Chat Area */}
      <Card className="flex-1 flex flex-col h-full bg-surface border border-border">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xl">
            🤖
          </div>
          <div>
            <h2 className="font-bold">AI Career Coach</h2>
            <p className="text-xs text-success">Online</p>
          </div>
        </div>

        <ScrollShadow className="flex-1 p-4 flex flex-col gap-6" ref={scrollRef}>
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
            >
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm ${msg.role === 'user' ? 'bg-secondary/20' : 'bg-primary/20'}`}>
                {msg.role === 'user' ? '👤' : '🤖'}
              </div>
              <div 
                className={`p-4 rounded-2xl whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-tr-none shadow-md' 
                    : 'bg-background border border-border rounded-tl-none shadow-sm text-foreground'
                }`}
              >
                {msg.content || <span className="animate-pulse">...</span>}
              </div>
            </div>
          ))}
          {isStreaming && messages[messages.length - 1].role === 'user' && (
            <div className="flex gap-4 max-w-[85%] self-start">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center text-sm">🤖</div>
              <div className="p-4 rounded-2xl bg-background border border-border rounded-tl-none shadow-sm">
                <span className="animate-pulse">Thinking...</span>
              </div>
            </div>
          )}
        </ScrollShadow>

        <Divider />
        
        <div className="p-4 bg-background/50">
          <form onSubmit={sendMessage} className="flex gap-2 relative">
            <Input
              fullWidth
              placeholder="Ask for resume advice, interview prep, or career guidance..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              variant="bordered"
              size="lg"
              disabled={isStreaming}
              className="pr-12"
            />
            <Button 
              isIconOnly 
              color="primary" 
              type="submit" 
              isLoading={isStreaming}
              size="lg"
              className="absolute right-1 top-1 z-10"
              isDisabled={!input.trim()}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </Button>
          </form>
          <p className="text-center text-xs text-muted mt-2">
            AI can make mistakes. Consider verifying important information.
          </p>
        </div>
      </Card>
    </div>
  );
}
