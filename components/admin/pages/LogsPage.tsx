import React, { useState, useEffect } from 'react';
import {
    Search,
    RefreshCw,
    Download,
    Trash2,
    Info,
    AlertTriangle,
    AlertCircle,
    Bug,
    Terminal,
} from 'lucide-react';

interface LogEntry {
    id: string;
    timestamp: string;
    level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
    source: string;
    message: string;
    metadata?: Record<string, any>;
    userAgent?: string;
    ip?: string;
    url?: string;
}

interface LogsResponse {
    logs: LogEntry[];
    stats: {
        total: number;
        byLevel: Record<string, number>;
        bySource: Record<string, number>;
    };
    timestamp: string;
}

export const LogsPage: React.FC = () => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [stats, setStats] = useState<LogsResponse['stats'] | null>(null);
    const [search, setSearch] = useState('');
    const [levelFilter, setLevelFilter] = useState<string>('ALL');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<string>('');

    const fetchLogs = async () => {
        try {
            const response = await fetch('/api/logs');
            if (!response.ok) throw new Error('Failed to fetch logs');
            const result = await response.json();
            if (result.success) {
                const data: LogsResponse = result.data;
                setLogs(data.logs);
                setStats(data.stats);
                setLastUpdated(data.timestamp);
            } else {
                throw new Error(result.error?.message || 'Failed to fetch logs');
            }
        } catch (error) {
            console.error('Failed to fetch logs:', error);
        }
    };

    useEffect(() => {
        fetchLogs();
        const interval = setInterval(fetchLogs, 5000);
        return () => clearInterval(interval);
    }, []);

    const filteredLogs = logs.filter((log) => {
        const matchesSearch =
            log.message.toLowerCase().includes(search.toLowerCase()) ||
            log.source.toLowerCase().includes(search.toLowerCase());
        const matchesLevel = levelFilter === 'ALL' || log.level === levelFilter;
        return matchesSearch && matchesLevel;
    });

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchLogs();
        setIsRefreshing(false);
    };

    const handleExport = () => {
        const dataStr =
            'data:text/json;charset=utf-8,' +
            encodeURIComponent(
                JSON.stringify(
                    {
                        logs,
                        stats,
                        exportedAt: new Date().toISOString(),
                        lastUpdated,
                    },
                    null,
                    2
                )
            );
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute('href', dataStr);
        downloadAnchorNode.setAttribute('download', `system_logs_${new Date().toISOString()}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleClear = async () => {
        try {
            const response = await fetch('/api/logs', { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to clear logs');
            await fetchLogs();
        } catch (error) {
            console.error('Failed to clear logs:', error);
        }
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'INFO':
                return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-400/10 border-blue-200 dark:border-blue-400/20';
            case 'WARN':
                return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10 border-amber-200 dark:border-amber-400/20';
            case 'ERROR':
                return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-400/10 border-red-200 dark:border-red-400/20';
            case 'DEBUG':
                return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-400/10 border-purple-200 dark:border-purple-400/20';
            default:
                return 'text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-400/10 border-zinc-200 dark:border-zinc-400/20';
        }
    };

    const getLevelIcon = (level: string) => {
        switch (level) {
            case 'INFO':
                return <Info size={14} />;
            case 'WARN':
                return <AlertTriangle size={14} />;
            case 'ERROR':
                return <AlertCircle size={14} />;
            case 'DEBUG':
                return <Bug size={14} />;
            default:
                return <Info size={14} />;
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
                        System Logs
                    </h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        Real-time monitoring and debug information.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="flex items-center px-3 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors disabled:opacity-50"
                    >
                        <RefreshCw
                            size={14}
                            className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
                        />
                        Refresh
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex items-center px-3 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors"
                    >
                        <Download size={14} className="mr-2" />
                        Export
                    </button>
                    <button
                        onClick={handleClear}
                        className="flex items-center px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/30 rounded-md hover:bg-red-100 dark:hover:bg-red-950/20 transition-colors"
                    >
                        <Trash2 size={14} className="mr-2" />
                        Clear
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 bg-white dark:bg-zinc-900/50 p-2 rounded-lg border border-zinc-200 dark:border-zinc-800/50 shadow-sm">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search logs by message or source..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-sm text-zinc-900 dark:text-zinc-300 focus:outline-none focus:border-blue-500 dark:focus:border-zinc-700 placeholder-zinc-400 dark:placeholder-zinc-600 transition-colors"
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                    {['ALL', 'INFO', 'WARN', 'ERROR', 'DEBUG'].map((level) => (
                        <button
                            key={level}
                            onClick={() => setLevelFilter(level)}
                            className={`
                px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap
                ${
                    levelFilter === level
                        ? 'bg-zinc-800 dark:bg-zinc-800 text-white border-zinc-600 dark:border-zinc-600'
                        : 'bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-300'
                }
              `}
                        >
                            {level}
                        </button>
                    ))}
                </div>
            </div>

            {/* Logs Console */}
            <div className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden flex flex-col font-mono text-sm shadow-inner transition-colors">
                <div className="flex-1 overflow-y-auto p-4 space-y-1">
                    {filteredLogs.length > 0 ? (
                        filteredLogs.map((log) => (
                            <div
                                key={log.id}
                                className="group flex items-start gap-3 p-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 rounded transition-colors"
                            >
                                <span className="text-zinc-500 dark:text-zinc-600 shrink-0 select-none w-36 text-xs pt-0.5">
                                    {new Date(log.timestamp).toLocaleTimeString([], {
                                        hour12: false,
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                    })}
                                </span>

                                <span
                                    className={`shrink-0 flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${getLevelColor(log.level)} w-20 justify-center select-none`}
                                >
                                    {getLevelIcon(log.level)}
                                    {log.level}
                                </span>

                                <span
                                    className="text-zinc-600 dark:text-zinc-500 shrink-0 w-32 truncate hidden sm:block"
                                    title={log.source}
                                >
                                    [{log.source}]
                                </span>

                                <span className="text-zinc-800 dark:text-zinc-300 break-all whitespace-pre-wrap">
                                    {log.message}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600">
                            <Terminal size={48} className="mb-4 opacity-20" />
                            <p>No logs found matching your criteria.</p>
                        </div>
                    )}
                </div>

                {/* Status Bar */}
                <div className="bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 px-4 py-1.5 flex justify-between items-center text-xs text-zinc-500 dark:text-zinc-500 transition-colors">
                    <div className="flex items-center gap-4">
                        <span>Total: {logs.length}</span>
                        <span>Showing: {filteredLogs.length}</span>
                        {stats && (
                            <span>
                                Errors: {stats.byLevel.ERROR || 0} | Warnings:{' '}
                                {stats.byLevel.WARN || 0}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span>Live Monitoring Active</span>
                        {lastUpdated && (
                            <span className="hidden sm:block">
                                Last: {new Date(lastUpdated).toLocaleTimeString()}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
