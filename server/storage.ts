import {
  type ApiEndpoint,
  type HealingMessage,
  type InsertApiEndpoint,
  type InsertHealingMessage,
  type InsertPackage,
  type InsertProjectStructure,
  type InsertScript,
  type InsertService,
  type InsertUser,
  type Package,
  type ProjectStructure,
  type Script,
  type Service,
  type User
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  updateUserLastLogin(id: string): Promise<void>;

  getAllServices(): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(
    id: string,
    updates: Partial<Service>
  ): Promise<Service | undefined>;

  getAllApiEndpoints(): Promise<ApiEndpoint[]>;
  createApiEndpoint(endpoint: InsertApiEndpoint): Promise<ApiEndpoint>;

  getAllProjectStructure(): Promise<ProjectStructure[]>;
  createProjectStructure(
    item: InsertProjectStructure
  ): Promise<ProjectStructure>;

  getAllPackages(): Promise<Package[]>;
  createPackage(pkg: InsertPackage): Promise<Package>;

  getAllScripts(): Promise<Script[]>;
  createScript(script: InsertScript): Promise<Script>;

  getAllHealingMessages(): Promise<HealingMessage[]>;
  createHealingMessage(message: InsertHealingMessage): Promise<HealingMessage>;
  getHealingMessagesByUserId(userId: string): Promise<HealingMessage[]>;
  getHealingMessagesBySessionId(
    sessionId: string,
    userId: string
  ): Promise<HealingMessage[]>;
  updateHealingMessageFeedback(
    id: string,
    userId: string,
    isHelpful: boolean,
    feedback?: string
  ): Promise<void>;

  removeDuplicates(): Promise<{ removed: number; details: string[] }>;

  updateUserStripeInfo(
    userId: string,
    stripeCustomerId: string,
    stripeSubscriptionId: string
  ): Promise<User | undefined>;
  updateUserSubscription(
    userId: string,
    tier: string,
    status: string,
    endDate?: Date
  ): Promise<User | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private services: Map<string, Service>;
  private apiEndpoints: Map<string, ApiEndpoint>;
  private projectStructure: Map<string, ProjectStructure>;
  private packages: Map<string, Package>;
  private scripts: Map<string, Script>;
  private healingMessages: Map<string, HealingMessage>;

  constructor() {
    this.users = new Map();
    this.services = new Map();
    this.apiEndpoints = new Map();
    this.projectStructure = new Map();
    this.packages = new Map();
    this.scripts = new Map();
    this.healingMessages = new Map();

    this.initializeData();
  }

  private initializeData() {
    // Initialize services - Single integrated server
    const mainService: Service = {
      id: randomUUID(),
      name: "Full-Stack Application",
      type: "Express + Vite",
      port: 5000,
      status: "running",
      pid: process.pid,
      uptime: null,
      lastChecked: new Date()
    };

    this.services.set(mainService.id, mainService);

    // Initialize API endpoints - Include all actual endpoints
    const endpoints: InsertApiEndpoint[] = [
      {
        method: "GET",
        path: "/api/health",
        description: "Health check and system status",
        status: "active"
      },
      {
        method: "GET",
        path: "/api/services",
        description: "Get all running services",
        status: "active"
      },
      {
        method: "GET",
        path: "/api/endpoints",
        description: "Get all API endpoints",
        status: "active"
      },
      {
        method: "GET",
        path: "/api/structure",
        description: "Get project structure",
        status: "active"
      },
      {
        method: "GET",
        path: "/api/packages",
        description: "Get installed packages",
        status: "active"
      },
      {
        method: "GET",
        path: "/api/scripts",
        description: "Get available npm scripts",
        status: "active"
      },
      {
        method: "POST",
        path: "/api/healing-ai",
        description: "AI therapeutic response endpoint",
        status: "active"
      },
      {
        method: "POST",
        path: "/api/healing-employee",
        description: "AI healing employee endpoint",
        status: "active"
      },
      {
        method: "POST",
        path: "/api/remove-duplicates",
        description: "Remove duplicate data entries",
        status: "active"
      }
    ];

    endpoints.forEach((endpoint) => {
      const apiEndpoint: ApiEndpoint = {
        ...endpoint,
        id: randomUUID(),
        status: endpoint.status || "active"
      };
      this.apiEndpoints.set(apiEndpoint.id, apiEndpoint);
    });

    // Initialize project structure
    const structure: InsertProjectStructure[] = [
      { name: "client", type: "folder", path: "/client", parentId: null },
      { name: "server", type: "folder", path: "/server", parentId: null },
      { name: "shared", type: "folder", path: "/shared", parentId: null },
      {
        name: "package.json",
        type: "file",
        path: "/package.json",
        parentId: null
      },
      {
        name: "vite.config.ts",
        type: "file",
        path: "/vite.config.ts",
        parentId: null
      },
      {
        name: "tailwind.config.ts",
        type: "file",
        path: "/tailwind.config.ts",
        parentId: null
      }
    ];

    structure.forEach((item) => {
      const structureItem: ProjectStructure = {
        ...item,
        id: randomUUID(),
        parentId: item.parentId || null
      };
      this.projectStructure.set(structureItem.id, structureItem);
    });

    // Initialize packages - Core dependencies only
    const packageList: InsertPackage[] = [
      {
        name: "express",
        version: "^4.21.2",
        environment: "backend",
        isDev: false
      },
      {
        name: "react",
        version: "^18.3.1",
        environment: "frontend",
        isDev: false
      },
      {
        name: "vite",
        version: "^7.1.6",
        environment: "fullstack",
        isDev: true
      },
      {
        name: "@tanstack/react-query",
        version: "^5.60.5",
        environment: "frontend",
        isDev: false
      },
      {
        name: "tailwindcss",
        version: "^3.4.17",
        environment: "frontend",
        isDev: true
      },
      {
        name: "typescript",
        version: "5.6.3",
        environment: "fullstack",
        isDev: true
      },
      {
        name: "openai",
        version: "^5.22.0",
        environment: "backend",
        isDev: false
      },
      {
        name: "drizzle-orm",
        version: "^0.39.1",
        environment: "backend",
        isDev: false
      }
    ];

    packageList.forEach((pkg) => {
      const packageItem: Package = {
        ...pkg,
        id: randomUUID(),
        isDev: pkg.isDev || false
      };
      this.packages.set(packageItem.id, packageItem);
    });

    // Initialize scripts - Actual npm scripts
    const scriptList: InsertScript[] = [
      {
        name: "dev",
        command: "npm run dev",
        description: "Start development server (Express + Vite)",
        environment: "fullstack"
      },
      {
        name: "build",
        command: "npm run build",
        description: "Build for production",
        environment: "fullstack"
      },
      {
        name: "start",
        command: "npm run start",
        description: "Start production server",
        environment: "fullstack"
      },
      {
        name: "check",
        command: "npm run check",
        description: "TypeScript type checking",
        environment: "fullstack"
      },
      {
        name: "db:push",
        command: "npm run db:push",
        description: "Push database schema changes",
        environment: "backend"
      }
    ];

    scriptList.forEach((script) => {
      const scriptItem: Script = {
        ...script,
        id: randomUUID(),
        name: script.name,
        command: script.command,
        environment: script.environment || "fullstack",
        description: script.description || null
      } as Script;
      this.scripts.set(scriptItem.id, scriptItem);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      id,
      username: insertUser.username,
      email: (insertUser as any).email || "",
      password: insertUser.password,
      name: (insertUser as any).name || "",
      role: (insertUser as any).role || "user",
      isActive: true,
      createdAt: new Date(),
      lastLogin: null,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      subscriptionTier: "free",
      subscriptionStatus: "inactive",
      subscriptionEndDate: null,
      profileImage: null,
      preferences: {}
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(
    id: string,
    updates: Partial<User>
  ): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateUserLastLogin(id: string): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      const updatedUser = { ...user, lastLogin: new Date() };
      this.users.set(id, updatedUser);
    }
  }

  async getAllServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async getService(id: string): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async createService(service: InsertService): Promise<Service> {
    // Check for duplicate by name and port
    const existing = Array.from(this.services.values()).find(
      (s) => s.name === service.name && s.port === service.port
    );
    if (existing) {
      // Update existing instead of creating duplicate
      return this.updateService(existing.id, service) as Promise<Service>;
    }

    const id = randomUUID();
    const newService: Service = {
      ...service,
      id,
      type: (service as any).type || "backend",
      name: (service as any).name || "",
      port: (service as any).port || 0,
      lastChecked: new Date(),
      status: service.status || "stopped",
      pid: service.pid || null,
      uptime: service.uptime || null
    } as Service;
    this.services.set(id, newService);
    return newService;
  }

  async updateService(
    id: string,
    updates: Partial<Service>
  ): Promise<Service | undefined> {
    const service = this.services.get(id);
    if (!service) return undefined;

    const updatedService = { ...service, ...updates, lastChecked: new Date() };
    this.services.set(id, updatedService);
    return updatedService;
  }

  async getAllApiEndpoints(): Promise<ApiEndpoint[]> {
    return Array.from(this.apiEndpoints.values());
  }

  async createApiEndpoint(endpoint: InsertApiEndpoint): Promise<ApiEndpoint> {
    // Check for duplicate by method and path
    const existing = Array.from(this.apiEndpoints.values()).find(
      (e) => e.method === endpoint.method && e.path === endpoint.path
    );
    if (existing) {
      // Update existing instead of creating duplicate
      const updated = {
        ...existing,
        ...endpoint,
        status: endpoint.status || existing.status
      };
      this.apiEndpoints.set(existing.id, updated);
      return updated;
    }

    const id = randomUUID();
    const newEndpoint: ApiEndpoint = {
      ...endpoint,
      id,
      method: (endpoint as any).method || "GET",
      path: (endpoint as any).path || "/",
      description: (endpoint as any).description || "",
      status: endpoint.status || "active"
    } as ApiEndpoint;
    this.apiEndpoints.set(id, newEndpoint);
    return newEndpoint;
  }

  async getAllProjectStructure(): Promise<ProjectStructure[]> {
    return Array.from(this.projectStructure.values());
  }

  async createProjectStructure(
    item: InsertProjectStructure
  ): Promise<ProjectStructure> {
    // Check for duplicate by path
    const existing = Array.from(this.projectStructure.values()).find(
      (i) => i.path === item.path
    );
    if (existing) {
      // Update existing instead of creating duplicate
      const updated = { ...existing, ...item };
      this.projectStructure.set(existing.id, updated);
      return updated;
    }

    const id = randomUUID();
    const newItem: ProjectStructure = {
      ...item,
      id,
      type: (item as any).type || "file",
      name: (item as any).name || "",
      path: (item as any).path || "",
      parentId: item.parentId || null
    } as ProjectStructure;
    this.projectStructure.set(id, newItem);
    return newItem;
  }

  async getAllPackages(): Promise<Package[]> {
    return Array.from(this.packages.values());
  }

  async createPackage(pkg: InsertPackage): Promise<Package> {
    // Check for duplicate by name and environment
    const existing = Array.from(this.packages.values()).find(
      (p) => p.name === pkg.name && p.environment === pkg.environment
    );
    if (existing) {
      // Update existing version instead of creating duplicate
      const updated = { ...existing, ...pkg };
      this.packages.set(existing.id, updated);
      return updated;
    }

    const id = randomUUID();
    const newPackage: Package = {
      ...pkg,
      id,
      name: (pkg as any).name || "",
      version: (pkg as any).version || "1.0.0",
      environment: (pkg as any).environment || "fullstack",
      isDev: pkg.isDev || false
    } as Package;
    this.packages.set(id, newPackage);
    return newPackage;
  }

  async getAllScripts(): Promise<Script[]> {
    return Array.from(this.scripts.values());
  }

  async createScript(script: InsertScript): Promise<Script> {
    // Check for duplicate by name and command
    const existing = Array.from(this.scripts.values()).find(
      (s) => s.name === script.name && s.command === script.command
    );
    if (existing) {
      // Update existing instead of creating duplicate
      const updated = { ...existing, ...script };
      this.scripts.set(existing.id, updated);
      return updated;
    }

    const id = randomUUID();
    const newScript: Script = {
      ...script,
      id,
      name: (script as any).name || "",
      command: (script as any).command || "",
      environment: (script as any).environment || "fullstack",
      description: script.description || null
    } as Script;
    this.scripts.set(id, newScript);
    return newScript;
  }

  async getAllHealingMessages(): Promise<HealingMessage[]> {
    return Array.from(this.healingMessages.values());
  }

  async createHealingMessage(
    message: InsertHealingMessage
  ): Promise<HealingMessage> {
    const id = randomUUID();
    const newMessage: HealingMessage = {
      ...message,
      id,
      userMessage: (message as any).userMessage || "",
      aiResponse: (message as any).aiResponse || "",
      timestamp: new Date(),
      userId: message.userId || null,
      sessionId: message.sessionId || null,
      emotion: message.emotion || null,
      sentiment: message.sentiment || null,
      tokensUsed: message.tokensUsed || null,
      isHelpful: message.isHelpful || null,
      tags: message.tags || null
    } as HealingMessage;
    this.healingMessages.set(id, newMessage);
    return newMessage;
  }

  async getHealingMessagesByUserId(userId: string): Promise<HealingMessage[]> {
    return Array.from(this.healingMessages.values())
      .filter((msg) => msg.userId === userId)
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
  }

  async getHealingMessagesBySessionId(
    sessionId: string,
    userId: string
  ): Promise<HealingMessage[]> {
    return Array.from(this.healingMessages.values())
      .filter((msg) => msg.sessionId === sessionId && msg.userId === userId)
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
  }

  async updateHealingMessageFeedback(
    id: string,
    userId: string,
    isHelpful: boolean,
    feedback?: string
  ): Promise<void> {
    const message = this.healingMessages.get(id);
    if (message && message.userId === userId) {
      message.isHelpful = isHelpful;
      // Store feedback in tags or metadata if needed
      if (feedback) {
        message.tags = [...(message.tags || []), `feedback:${feedback}`];
      }
      this.healingMessages.set(id, message);
    }
  }

  async removeDuplicates(): Promise<{ removed: number; details: string[] }> {
    let removed = 0;
    const details: string[] = [];

    // Remove duplicate services (same name + port)
    const servicesSeen = new Map<string, Service>();
    const servicesToRemove: string[] = [];

    this.services.forEach((service, id) => {
      const key = `${service.name}:${service.port}`;
      if (servicesSeen.has(key)) {
        servicesToRemove.push(id);
        details.push(
          `Removed duplicate service: ${service.name} on port ${service.port}`
        );
        removed++;
      } else {
        servicesSeen.set(key, service);
      }
    });
    servicesToRemove.forEach((id) => this.services.delete(id));

    // Remove duplicate API endpoints (same method + path)
    const endpointsSeen = new Map<string, ApiEndpoint>();
    const endpointsToRemove: string[] = [];

    this.apiEndpoints.forEach((endpoint, id) => {
      const key = `${endpoint.method}:${endpoint.path}`;
      if (endpointsSeen.has(key)) {
        endpointsToRemove.push(id);
        details.push(
          `Removed duplicate endpoint: ${endpoint.method} ${endpoint.path}`
        );
        removed++;
      } else {
        endpointsSeen.set(key, endpoint);
      }
    });
    endpointsToRemove.forEach((id) => this.apiEndpoints.delete(id));

    // Remove duplicate packages (same name + environment)
    const packagesSeen = new Map<string, Package>();
    const packagesToRemove: string[] = [];

    this.packages.forEach((pkg, id) => {
      const key = `${pkg.name}:${pkg.environment}`;
      if (packagesSeen.has(key)) {
        packagesToRemove.push(id);
        details.push(
          `Removed duplicate package: ${pkg.name} in ${pkg.environment}`
        );
        removed++;
      } else {
        packagesSeen.set(key, pkg);
      }
    });
    packagesToRemove.forEach((id) => this.packages.delete(id));

    // Remove duplicate scripts (same name + command)
    const scriptsSeen = new Map<string, Script>();
    const scriptsToRemove: string[] = [];

    this.scripts.forEach((script, id) => {
      const key = `${script.name}:${script.command}`;
      if (scriptsSeen.has(key)) {
        scriptsToRemove.push(id);
        details.push(`Removed duplicate script: ${script.name}`);
        removed++;
      } else {
        scriptsSeen.set(key, script);
      }
    });
    scriptsToRemove.forEach((id) => this.scripts.delete(id));

    // Remove duplicate project structure (same path)
    const structureSeen = new Map<string, ProjectStructure>();
    const structureToRemove: string[] = [];

    this.projectStructure.forEach((item, id) => {
      const key = item.path;
      if (structureSeen.has(key)) {
        structureToRemove.push(id);
        details.push(`Removed duplicate path: ${item.path}`);
        removed++;
      } else {
        structureSeen.set(key, item);
      }
    });
    structureToRemove.forEach((id) => this.projectStructure.delete(id));

    return { removed, details };
  }

  async updateUserStripeInfo(
    userId: string,
    stripeCustomerId: string,
    stripeSubscriptionId: string
  ): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;

    const updatedUser = {
      ...user,
      stripeCustomerId,
      stripeSubscriptionId,
      subscriptionStatus: "active"
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async updateUserSubscription(
    userId: string,
    tier: string,
    status: string,
    endDate?: Date
  ): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;

    const updatedUser = {
      ...user,
      subscriptionTier: tier,
      subscriptionStatus: status,
      subscriptionEndDate: endDate || null
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
}

export const storage = new MemStorage();
