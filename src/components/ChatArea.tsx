import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Phone, Video, MoreVertical, Paperclip, Mic, Search, Smile, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmojiPicker } from "./EmojiPicker";
import { FileUpload } from "./FileUpload";

interface Message {
  id: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  status?: 'sent' | 'delivered' | 'read';
  type?: 'text' | 'image' | 'file' | 'voice';
  fileUrl?: string;
  fileName?: string;
  reactions?: { emoji: string; count: number; users: string[] }[];
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
  onSendMessage: (content: string, type?: string, file?: File) => void;
  onSearchMessages?: (query: string) => void;
  isTyping?: boolean;
  isRecording?: boolean;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
  onAddReaction?: (messageId: string, emoji: string) => void;
}

export function ChatArea({ 
  conversation, 
  messages, 
  onSendMessage,
  onSearchMessages,
  isTyping = false,
  isRecording = false,
  onStartRecording,
  onStopRecording,
  onAddReaction
}: ChatAreaProps) {
  const [messageInput, setMessageInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

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

  const handleEmojiSelect = (emoji: string) => {
    setMessageInput(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFileUpload = (file: File) => {
    onSendMessage(`Fichier envoyé: ${file.name}`, 'file', file);
    setShowFileUpload(false);
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    if (onAddReaction) {
      onAddReaction(messageId, emoji);
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
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowSearch(!showSearch)}
          >
            <Search className="h-5 w-5" />
          </Button>
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

      {/* Search Bar */}
      {showSearch && (
        <div className="p-4 border-b border-border bg-card">
          <Input
            placeholder="Rechercher dans la conversation..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              onSearchMessages?.(e.target.value);
            }}
            className="w-full"
          />
        </div>
      )}

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
                  "max-w-[70%] rounded-lg px-4 py-2 break-words group relative",
                  message.isOwn
                    ? "bg-green-600 text-white rounded-br-sm"
                    : "bg-muted text-foreground rounded-bl-sm"
                )}
                onDoubleClick={() => handleAddReaction(message.id, "❤️")}
              >
                {message.type === 'image' && message.fileUrl && (
                  <img 
                    src={message.fileUrl} 
                    alt="Image partagée" 
                    className="max-w-full h-auto rounded mb-2"
                  />
                )}
                
                {message.type === 'file' && (
                  <div className="flex items-center space-x-2 mb-2 p-2 bg-black/10 rounded">
                    <Paperclip className="h-4 w-4" />
                    <span className="text-sm">{message.fileName || 'Fichier'}</span>
                  </div>
                )}

                <p className="text-sm">{message.content}</p>
                
                {/* Reactions */}
                {message.reactions && message.reactions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {message.reactions.map((reaction, index) => (
                      <button
                        key={index}
                        className="flex items-center space-x-1 bg-black/10 rounded-full px-2 py-1 text-xs hover:bg-black/20"
                        onClick={() => handleAddReaction(message.id, reaction.emoji)}
                      >
                        <span>{reaction.emoji}</span>
                        <span>{reaction.count}</span>
                      </button>
                    ))}
                  </div>
                )}

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

                {/* Quick reaction on hover */}
                <div className="absolute -top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex space-x-1 bg-background border rounded-full p-1 shadow-lg">
                    {['❤️', '👍', '😊', '😂', '😮', '😢'].map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => handleAddReaction(message.id, emoji)}
                        className="hover:scale-110 transition-transform p-1"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowFileUpload(!showFileUpload)}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tapez votre message..."
              className="pr-10"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onMouseDown={onStartRecording}
            onMouseUp={onStopRecording}
            onMouseLeave={onStopRecording}
            className={cn(
              "transition-colors",
              isRecording ? "bg-red-500 text-white" : ""
            )}
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          
          <Button 
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="absolute bottom-20 right-4">
            <EmojiPicker onSelect={handleEmojiSelect} onClose={() => setShowEmojiPicker(false)} />
          </div>
        )}

        {/* File Upload */}
        {showFileUpload && (
          <div className="absolute bottom-20 left-4">
            <FileUpload onUpload={handleFileUpload} onClose={() => setShowFileUpload(false)} />
          </div>
        )}
      </div>
    </div>
  );
}