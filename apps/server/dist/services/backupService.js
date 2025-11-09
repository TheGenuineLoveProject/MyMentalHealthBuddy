"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.backupService = exports.BackupService = void 0;
const storage_js_1 = require("../../storage.js");
const util_1 = require("util");
const child_process_1 = require("child_process");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class BackupService {
    backupDir;
    config;
    constructor(backupDir = './backups') {
        this.backupDir = backupDir;
        this.config = {
            enabled: true,
            schedule: 'daily',
            retentionDays: 30,
            includeDatabase: true,
            includeFiles: true
        };
        this.ensureBackupDirectory();
    }
    ensureBackupDirectory() {
        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
        }
    }
    async createBackup(userId, type = 'full') {
        const backupId = `backup-${userId}-${Date.now()}`;
        const timestamp = new Date().toISOString();
        const metadata = {
            id: backupId,
            timestamp,
            size: 0,
            type,
            status: 'in_progress'
        };
        try {
            const backupData = {};
            if (this.config.includeDatabase) {
                // Export user data
                const journals = await storage_js_1.storage.getJournalsByUserId(userId);
                const moods = await storage_js_1.storage.getMoodEntriesByUserId(userId);
                const user = await storage_js_1.storage.getUserById(userId);
                backupData.user = user;
                backupData.journals = journals;
                backupData.moods = moods;
                backupData.timestamp = timestamp;
                backupData.version = '1.0';
            }
            const backupPath = path.join(this.backupDir, `${backupId}.json`);
            const backupContent = JSON.stringify(backupData, null, 2);
            fs.writeFileSync(backupPath, backupContent);
            const stats = fs.statSync(backupPath);
            metadata.size = stats.size;
            metadata.status = 'completed';
            // Clean up old backups
            await this.cleanupOldBackups();
            return metadata;
        }
        catch (error) {
            metadata.status = 'failed';
            metadata.error = error instanceof Error ? error.message : 'Unknown error';
            throw error;
        }
    }
    async listBackups(userId) {
        const files = fs.readdirSync(this.backupDir);
        const backups = [];
        for (const file of files) {
            if (file.endsWith('.json')) {
                const filePath = path.join(this.backupDir, file);
                const stats = fs.statSync(filePath);
                const metadata = {
                    id: file.replace('.json', ''),
                    timestamp: stats.mtime.toISOString(),
                    size: stats.size,
                    type: 'full',
                    status: 'completed'
                };
                if (!userId || file.includes(userId)) {
                    backups.push(metadata);
                }
            }
        }
        return backups.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
    async restoreBackup(backupId) {
        // Validate backup ID format - allow alphanumeric, hyphens, underscores but prevent path traversal
        // No forward/back slashes, no dots, no path separators
        const validBackupIdPattern = /^backup-[\w-]+-\d+$/;
        if (!validBackupIdPattern.test(backupId) || backupId.includes('/') || backupId.includes('\\') || backupId.includes('..')) {
            throw new Error('Invalid backup ID format');
        }
        // Prevent path traversal by ensuring resolved path is within backup directory
        const backupPath = path.resolve(this.backupDir, `${backupId}.json`);
        const normalizedBackupDir = path.resolve(this.backupDir);
        if (!backupPath.startsWith(normalizedBackupDir + path.sep)) {
            throw new Error('Invalid backup path - potential path traversal detected');
        }
        if (!fs.existsSync(backupPath)) {
            throw new Error(`Backup ${backupId} not found`);
        }
        const backupContent = fs.readFileSync(backupPath, 'utf-8');
        const backupData = JSON.parse(backupContent);
        // Restore user data
        // This is a simplified version - in production, you'd want more sophisticated merge logic
        if (backupData.journals) {
            for (const journal of backupData.journals) {
                await storage_js_1.storage.createJournal(journal);
            }
        }
        if (backupData.moods) {
            for (const mood of backupData.moods) {
                await storage_js_1.storage.createMoodEntry(mood);
            }
        }
    }
    async deleteBackup(backupId) {
        // Validate backup ID format - allow alphanumeric, hyphens, underscores but prevent path traversal
        // No forward/back slashes, no dots, no path separators
        const validBackupIdPattern = /^backup-[\w-]+-\d+$/;
        if (!validBackupIdPattern.test(backupId) || backupId.includes('/') || backupId.includes('\\') || backupId.includes('..')) {
            throw new Error('Invalid backup ID format');
        }
        // Prevent path traversal by ensuring resolved path is within backup directory
        const backupPath = path.resolve(this.backupDir, `${backupId}.json`);
        const normalizedBackupDir = path.resolve(this.backupDir);
        if (!backupPath.startsWith(normalizedBackupDir + path.sep)) {
            throw new Error('Invalid backup path - potential path traversal detected');
        }
        if (fs.existsSync(backupPath)) {
            fs.unlinkSync(backupPath);
        }
    }
    async cleanupOldBackups() {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - this.config.retentionDays);
        const files = fs.readdirSync(this.backupDir);
        for (const file of files) {
            if (file.endsWith('.json')) {
                const filePath = path.join(this.backupDir, file);
                const stats = fs.statSync(filePath);
                if (stats.mtime < cutoffDate) {
                    fs.unlinkSync(filePath);
                }
            }
        }
    }
    updateConfig(config) {
        this.config = { ...this.config, ...config };
    }
    getConfig() {
        return { ...this.config };
    }
    async getBackupStats() {
        const backups = await this.listBackups();
        const totalSize = backups.reduce((sum, b) => sum + b.size, 0);
        const oldestBackup = backups.length > 0 ? backups[backups.length - 1].timestamp : null;
        const newestBackup = backups.length > 0 ? backups[0].timestamp : null;
        return {
            totalBackups: backups.length,
            totalSize,
            oldestBackup,
            newestBackup
        };
    }
}
exports.BackupService = BackupService;
exports.backupService = new BackupService();
