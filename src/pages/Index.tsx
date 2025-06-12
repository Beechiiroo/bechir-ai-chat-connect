import { useState } from "react";
import { ConversationList } from "@/components/ConversationList";
import { ChatArea } from "@/components/ChatArea";

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
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  isOnline?: boolean;
}

const initialConversations: Conversation[] = [
  {
    id: "1",
    name: "Bechir AI Assistant",
    lastMessage: "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
    timestamp: "10:30",
    unreadCount: 1,
    isOnline: true,
  },
  {
    id: "2",
    name: "Support Technique",
    lastMessage: "Votre demande a été traitée avec succès",
    timestamp: "09:15",
    isOnline: false,
  },
  {
    id: "3",
    name: "Assistant Personnel",
    lastMessage: "N'hésitez pas si vous avez des questions",
    timestamp: "Hier",
    isOnline: true,
  },
  {
    id: "4",
    name: "Analyse de Documents",
    lastMessage: "Le document a été analysé correctement",
    timestamp: "Hier",
    isOnline: false,
  },
];

const initialMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      content: "Bonjour ! Je suis Bechir AI, votre assistant intelligent. Comment puis-je vous aider aujourd'hui ?",
      timestamp: "10:30",
      isOwn: false,
    },
  ],
  "2": [
    {
      id: "1",
      content: "Bonjour, j'ai un problème technique",
      timestamp: "09:10",
      isOwn: true,
      status: "read",
    },
    {
      id: "2",
      content: "Bonjour ! Je vais vous aider à résoudre votre problème. Pouvez-vous me décrire le problème en détail ?",
      timestamp: "09:12",
      isOwn: false,
    },
    {
      id: "3",
      content: "Votre demande a été traitée avec succès. Y a-t-il autre chose que je puisse faire pour vous ?",
      timestamp: "09:15",
      isOwn: false,
    },
  ],
  "3": [
    {
      id: "1",
      content: "Bonjour ! Je suis votre assistant personnel. N'hésitez pas si vous avez des questions.",
      timestamp: "Hier",
      isOwn: false,
    },
  ],
  "4": [
    {
      id: "1",
      content: "Pouvez-vous analyser ce document pour moi ?",
      timestamp: "Hier",
      isOwn: true,
      status: "read",
    },
    {
      id: "2",
      content: "Bien sûr ! Veuillez télécharger le document et je l'analyserai pour vous.",
      timestamp: "Hier",
      isOwn: false,
    },
    {
      id: "3",
      content: "Le document a été analysé correctement. Voici un résumé des points clés...",
      timestamp: "Hier",
      isOwn: false,
    },
  ],
};

const Index = () => {
  const [conversations] = useState<Conversation[]>(initialConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>();
  const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
  };

  const handleSendMessage = (content: string) => {
    if (!activeConversationId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      timestamp: new Date().toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      isOwn: true,
      status: 'sent',
    };

    setMessages(prev => ({
      ...prev,
      [activeConversationId]: [
        ...(prev[activeConversationId] || []),
        newMessage,
      ],
    }));

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "Merci pour votre message ! Je traite votre demande et vous réponds dans quelques instants.",
        timestamp: new Date().toLocaleTimeString('fr-FR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        isOwn: false,
      };

      setMessages(prev => ({
        ...prev,
        [activeConversationId]: [
          ...(prev[activeConversationId] || []),
          aiResponse,
        ],
      }));
    }, 1000);
  };

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const activeMessages = activeConversationId ? messages[activeConversationId] || [] : [];

  return (
    <div className="h-screen flex bg-background">
      {/* Mobile/Desktop responsive layout */}
      <div className="w-full md:w-80 lg:w-96 h-full md:block">
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
        />
      </div>
      
      <div className="hidden md:flex flex-1">
        <ChatArea
          conversation={activeConversation}
          messages={activeMessages}
          onSendMessage={handleSendMessage}
        />
      </div>

      {/* Mobile chat view */}
      {activeConversationId && (
        <div className="md:hidden fixed inset-0 bg-background z-50">
          <ChatArea
            conversation={activeConversation}
            messages={activeMessages}
            onSendMessage={handleSendMessage}
          />
        </div>
      )}
    </div>
  );
};

export default Index;