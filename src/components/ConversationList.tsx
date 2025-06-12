import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  isOnline?: boolean;
}

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId?: string;
  onSelectConversation: (id: string) => void;
}

export function ConversationList({ 
  conversations, 
  activeConversationId, 
  onSelectConversation 
}: ConversationListProps) {
  return (
    <div className="w-full h-full bg-card border-r border-border">
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-semibold text-foreground">Bechir AI</h1>
        <p className="text-sm text-muted-foreground">Messages</p>
      </div>
      
      <ScrollArea className="h-full">
        <div className="p-2">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={cn(
                "flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent",
                activeConversationId === conversation.id && "bg-accent"
              )}
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={conversation.avatar} alt={conversation.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {conversation.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {conversation.isOnline && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground truncate">
                    {conversation.name}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {conversation.timestamp}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.lastMessage}
                  </p>
                  {conversation.unreadCount && conversation.unreadCount > 0 && (
                    <Badge variant="default" className="ml-2 h-5 min-w-5 flex items-center justify-center text-xs bg-green-600 hover:bg-green-700">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}