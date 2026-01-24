/**
 * Chat storage for AI conversations
 * Uses in-memory storage - can be swapped to database later
 */

interface Conversation {
  id: number;
  title: string;
  createdAt: Date;
}

interface Message {
  id: number;
  conversationId: number;
  role: string;
  content: string;
  createdAt: Date;
}

export interface IChatStorage {
  getConversation(id: number): Promise<Conversation | undefined>;
  getAllConversations(): Promise<Conversation[]>;
  createConversation(title: string): Promise<Conversation>;
  deleteConversation(id: number): Promise<void>;
  getMessagesByConversation(conversationId: number): Promise<Message[]>;
  createMessage(conversationId: number, role: string, content: string): Promise<Message>;
}

class MemoryChatStorage implements IChatStorage {
  private conversations: Map<number, Conversation> = new Map();
  private messages: Map<number, Message> = new Map();
  private conversationIdCounter = 1;
  private messageIdCounter = 1;

  async getConversation(id: number): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async getAllConversations(): Promise<Conversation[]> {
    return Array.from(this.conversations.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createConversation(title: string): Promise<Conversation> {
    const conversation: Conversation = {
      id: this.conversationIdCounter++,
      title,
      createdAt: new Date(),
    };
    this.conversations.set(conversation.id, conversation);
    return conversation;
  }

  async deleteConversation(id: number): Promise<void> {
    this.conversations.delete(id);
    // Delete associated messages
    const messageEntries = Array.from(this.messages.entries());
    for (const [msgId, msg] of messageEntries) {
      if (msg.conversationId === id) {
        this.messages.delete(msgId);
      }
    }
  }

  async getMessagesByConversation(conversationId: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(m => m.conversationId === conversationId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createMessage(conversationId: number, role: string, content: string): Promise<Message> {
    const message: Message = {
      id: this.messageIdCounter++,
      conversationId,
      role,
      content,
      createdAt: new Date(),
    };
    this.messages.set(message.id, message);
    return message;
  }
}

export const chatStorage: IChatStorage = new MemoryChatStorage();
