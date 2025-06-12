import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Phone, Video, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  status?: 'sent' | 'delivered' | 'read';
}

interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  isOnline?: boolean;
}

interface ChatAreaProps {
  conversation?: Conversation;
  messages: Message[];
  onSendMessage: (content: string) => void;
}

export function ChatArea({ conversation, messages, onSendMessage }: ChatAreaProps) {
  const [messageInput, setMessageInput] = useState("");

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      onSendMessage(messageInput.trim());
      setMessageInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-64 h-64 mx-auto mb-8 opacity-20">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <circle cx="100" cy="100" r="80" fill="currentColor" opacity="0.1"/>
              <path d="M60 80 L140 80 L140 120 L60 120 Z" fill="currentColor" opacity="0.2"/>
              <circle cx="80" cy="100" r="8" fill="currentColor" opacity="0.3"/>
              <circle cx="120" cy="100" r="8" fill="currentColor" opacity="0.3"/>
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Bienvenue sur Bechir AI</h2>
          <p className="text-muted-foreground max-w-md">
            Sélectionnez une conversation pour commencer à discuter avec l'intelligence artificielle.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={conversation.avatar} alt={conversation.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {conversation.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-foreground">{conversation.name}</h2>
            <p className="text-xs text-muted-foreground">
              {conversation.isOnline ? "En ligne" : "Hors ligne"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.isOwn ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[70%] rounded-lg px-4 py-2 break-words",
                  message.isOwn
                    ? "bg-green-600 text-white rounded-br-sm"
                    : "bg-muted text-foreground rounded-bl-sm"
                )}
              >
                <p className="text-sm">{message.content}</p>
                <div className={cn(
                  "flex items-center justify-end mt-1 space-x-1",
                  message.isOwn ? "text-green-100" : "text-muted-foreground"
                )}>
                  <span className="text-xs">{message.timestamp}</span>
                  {message.isOwn && (
                    <div className="text-xs">
                      {message.status === 'read' && '✓✓'}
                      {message.status === 'delivered' && '✓✓'}
                      {message.status === 'sent' && '✓'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-center space-x-2">
          <Input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tapez votre message..."
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}