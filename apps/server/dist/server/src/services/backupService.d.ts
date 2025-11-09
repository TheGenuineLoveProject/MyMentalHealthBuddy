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
export declare class BackupService {
    private backupDir;
    private config;
    constructor(backupDir?: string);
    private ensureBackupDirectory;
    createBackup(userId: string, type?: 'full' | 'incremental'): Promise<BackupMetadata>;
    listBackups(userId?: string): Promise<BackupMetadata[]>;
    restoreBackup(backupId: string): Promise<void>;
    deleteBackup(backupId: string): Promise<void>;
    private cleanupOldBackups;
    updateConfig(config: Partial<BackupConfig>): void;
    getConfig(): BackupConfig;
    getBackupStats(): Promise<{
        totalBackups: number;
        totalSize: number;
        oldestBackup: string | null;
        newestBackup: string | null;
    }>;
}
export declare const backupService: BackupService;
