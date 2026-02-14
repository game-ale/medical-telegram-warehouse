export interface PipelineRun {
    id: string;
    pipelineName: string;
    status: 'STARTING' | 'RUNNING' | 'SUCCESS' | 'FAILURE' | 'QUEUED' | 'UNKNOWN';
    startTime: string;
    duration?: string;
    trigger: string;
}

export interface RunStats {
    totalRuns: number;
    successRate: number;
    avgDuration: string;
    lastRunStatus: string;
    lastRunTime: string;
}

export interface LogEntry {
    id: string;
    timestamp: string;
    level: 'info' | 'warn' | 'error';
    message: string;
    step?: string;
}
