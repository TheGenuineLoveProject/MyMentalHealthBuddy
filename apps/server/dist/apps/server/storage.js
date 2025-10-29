export class MemStorage {
    users = new Map();
    usersByUsername = new Map();
    healingMessages = new Map();
    journals = new Map();
    moodEntries = new Map();
    crisisResources = new Map();
    billingTransactions = new Map();
    constructor() {
        this.seedCrisisResources();
    }
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    async createUser(insertUser) {
        const id = this.generateId();
        const user = {
            id,
            username: insertUser.username,
            email: insertUser.email || null,
            password: insertUser.password,
            name: insertUser.name || null,
            role: "user",
            isActive: true,
            createdAt: new Date(),
            lastLogin: null,
            stripeCustomerId: null,
            stripeSubscriptionId: null,
            subscriptionTier: "free",
            subscriptionStatus: "inactive",
            subscriptionEndDate: null,
            profileImage: null,
            preferences: "{}",
            canvaAccessToken: null,
            canvaRefreshToken: null,
            canvaTokenExpiresAt: null
        };
        this.users.set(id, user);
        this.usersByUsername.set(user.username, user);
        return user;
    }
    async getUserById(id) {
        return this.users.get(id) || null;
    }
    async getUserByUsername(username) {
        return this.usersByUsername.get(username) || null;
    }
    async updateUser(id, updates) {
        const user = this.users.get(id);
        if (!user)
            return null;
        const updatedUser = { ...user, ...updates };
        this.users.set(id, updatedUser);
        // Update username index if username changed
        if (updates.username && updates.username !== user.username) {
            this.usersByUsername.delete(user.username);
            this.usersByUsername.set(updates.username, updatedUser);
        }
        return updatedUser;
    }
    async createHealingMessage(insertMessage) {
        const id = this.generateId();
        const message = {
            id,
            userId: insertMessage.userId || null,
            sessionId: insertMessage.sessionId || null,
            userMessage: insertMessage.userMessage,
            aiResponse: insertMessage.aiResponse,
            emotion: insertMessage.emotion || null,
            sentiment: insertMessage.sentiment || null,
            timestamp: new Date(),
            tokensUsed: insertMessage.tokensUsed || null,
            isHelpful: insertMessage.isHelpful || null,
            tags: insertMessage.tags || null
        };
        this.healingMessages.set(id, message);
        return message;
    }
    async getHealingMessagesByUserId(userId) {
        return Array.from(this.healingMessages.values())
            .filter(m => m.userId === userId)
            .sort((a, b) => (a.timestamp?.getTime() || 0) - (b.timestamp?.getTime() || 0));
    }
    async getHealingMessagesBySessionId(sessionId) {
        return Array.from(this.healingMessages.values())
            .filter(m => m.sessionId === sessionId)
            .sort((a, b) => (a.timestamp?.getTime() || 0) - (b.timestamp?.getTime() || 0));
    }
    async createJournal(insertJournal) {
        const id = this.generateId();
        const journal = {
            id,
            userId: insertJournal.userId,
            title: insertJournal.title || null,
            content: insertJournal.content,
            mood: insertJournal.mood || null,
            tags: insertJournal.tags || null,
            isPrivate: insertJournal.isPrivate ?? true,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.journals.set(id, journal);
        return journal;
    }
    async getJournalsByUserId(userId) {
        return Array.from(this.journals.values())
            .filter(j => j.userId === userId)
            .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    }
    async getJournalById(id) {
        return this.journals.get(id) || null;
    }
    async updateJournal(id, update) {
        const journal = this.journals.get(id);
        if (!journal)
            return null;
        const updated = {
            ...journal,
            ...update,
            updatedAt: new Date()
        };
        this.journals.set(id, updated);
        return updated;
    }
    async deleteJournal(id) {
        return this.journals.delete(id);
    }
    async createMoodEntry(insertEntry) {
        const id = this.generateId();
        const entry = {
            id,
            userId: insertEntry.userId,
            mood: insertEntry.mood,
            intensity: insertEntry.intensity,
            notes: insertEntry.notes || null,
            activities: insertEntry.activities || null,
            triggers: insertEntry.triggers || null,
            createdAt: new Date()
        };
        this.moodEntries.set(id, entry);
        return entry;
    }
    async getMoodEntriesByUserId(userId) {
        return Array.from(this.moodEntries.values())
            .filter(e => e.userId === userId)
            .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    }
    async getMoodEntriesByUserIdAndDateRange(userId, startDate, endDate) {
        return Array.from(this.moodEntries.values())
            .filter(e => {
            if (e.userId !== userId)
                return false;
            const entryDate = e.createdAt?.getTime() || 0;
            return entryDate >= startDate.getTime() && entryDate <= endDate.getTime();
        })
            .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    }
    async getCrisisResources() {
        return Array.from(this.crisisResources.values())
            .filter(r => r.isActive)
            .sort((a, b) => (b.priority || 0) - (a.priority || 0));
    }
    async getCrisisResourcesByCountry(country) {
        return Array.from(this.crisisResources.values())
            .filter(r => r.isActive && r.country === country)
            .sort((a, b) => (b.priority || 0) - (a.priority || 0));
    }
    async createBillingTransaction(insertTransaction) {
        const id = this.generateId();
        const transaction = {
            id,
            userId: insertTransaction.userId,
            stripeSessionId: insertTransaction.stripeSessionId || null,
            amount: insertTransaction.amount,
            currency: insertTransaction.currency || "USD",
            status: insertTransaction.status,
            type: insertTransaction.type,
            description: insertTransaction.description || null,
            createdAt: new Date(),
            metadata: insertTransaction.metadata || null
        };
        this.billingTransactions.set(id, transaction);
        return transaction;
    }
    async getBillingTransactionsByUserId(userId) {
        return Array.from(this.billingTransactions.values())
            .filter(t => t.userId === userId)
            .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    }
    async getBillingTransactionById(id) {
        return this.billingTransactions.get(id) || null;
    }
    seedCrisisResources() {
        const resources = [
            {
                id: "crisis-1",
                name: "National Suicide Prevention Lifeline",
                type: "hotline",
                phoneNumber: "988",
                website: "https://988lifeline.org",
                description: "24/7 free and confidential support for people in distress",
                country: "US",
                isActive: true,
                priority: 100
            },
            {
                id: "crisis-2",
                name: "Crisis Text Line",
                type: "text",
                phoneNumber: "Text HOME to 741741",
                website: "https://www.crisistextline.org",
                description: "Free 24/7 support via text message",
                country: "US",
                isActive: true,
                priority: 90
            },
            {
                id: "crisis-3",
                name: "NAMI Helpline",
                type: "hotline",
                phoneNumber: "1-800-950-NAMI (6264)",
                website: "https://www.nami.org/help",
                description: "Information and referral services for mental health support",
                country: "US",
                isActive: true,
                priority: 80
            },
            {
                id: "crisis-4",
                name: "SAMHSA National Helpline",
                type: "hotline",
                phoneNumber: "1-800-662-4357",
                website: "https://www.samhsa.gov/find-help/national-helpline",
                description: "Treatment referral and information service for mental health",
                country: "US",
                isActive: true,
                priority: 70
            }
        ];
        resources.forEach(r => this.crisisResources.set(r.id, r));
    }
}
export const storage = new MemStorage();
