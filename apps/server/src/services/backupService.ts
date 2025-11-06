import { storage } from '../storage.js';
import { promisify } from 'util';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

export interface BackupConfig {
  enabled: boolean;
  schedule: 'hourly' | 'daily' | 'weekly';
  retentionDays: number;
  includeDatabase: boolean;
  includeFiles: boolean;
}

export interface BackupMetadata {
  id: string;
  timestamp: string;
  size: number;
  type: 'full' | 'incremental';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  error?: string;
}

export class BackupService {
  private backupDir: string;
  private config: BackupConfig;

  constructor(backupDir: string = './backups') {
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

  private ensureBackupDirectory(): void {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  async createBackup(userId: string, type: 'full' | 'incremental' = 'full'): Promise<BackupMetadata> {
    const backupId = `backup-${userId}-${Date.now()}`;
    const timestamp = new Date().toISOString();

    const metadata: BackupMetadata = {
      id: backupId,
      timestamp,
      size: 0,
      type,
      status: 'in_progress'
    };

    try {
      const backupData: any = {};

      if (this.config.includeDatabase) {
        // Export user data
        const journals = await storage.getJournalsByUserId(userId);
        const moods = await storage.getMoodEntriesByUserId(userId);
        const user = await storage.getUserById(userId);

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
    } catch (error) {
      metadata.status = 'failed';
      metadata.error = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    }
  }

  async listBackups(userId?: string): Promise<BackupMetadata[]> {
    const files = fs.readdirSync(this.backupDir);
    const backups: BackupMetadata[] = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(this.backupDir, file);
        const stats = fs.statSync(filePath);
        
        const metadata: BackupMetadata = {
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

    return backups.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async restoreBackup(backupId: string): Promise<void> {
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
        await storage.createJournal(journal);
      }
    }

    if (backupData.moods) {
      for (const mood of backupData.moods) {
        await storage.createMoodEntry(mood);
      }
    }
  }

  async deleteBackup(backupId: string): Promise<void> {
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

  private async cleanupOldBackups(): Promise<void> {
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

  updateConfig(config: Partial<BackupConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfig(): BackupConfig {
    return { ...this.config };
  }

  async getBackupStats(): Promise<{
    totalBackups: number;
    totalSize: number;
    oldestBackup: string | null;
    newestBackup: string | null;
  }> {
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

export const backupService = new BackupService();
