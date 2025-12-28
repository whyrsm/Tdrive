import { useState } from 'react';
import { X, ArrowLeft, Search, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { importApi } from '../../lib/api';
import { formatFileSize } from '../../lib/utils';
import { cn } from '../../lib/utils';

interface Dialog {
  id: string;
  name: string;
  type: 'user' | 'group' | 'channel' | 'saved';
}

interface FileInfo {
  messageId: number;
  name: string;
  size: number;
  mimeType: string;
  date: string;
}

interface ImportProgress {
  current: number;
  total: number;
  currentFileName: string;
  completed: number[];
  failed: number[];
}

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: () => void;
}

export default function ImportModal({ isOpen, onClose, onImportComplete }: ImportModalProps) {
  const [step, setStep] = useState<'dialogs' | 'files' | 'importing'>('dialogs');
  const [dialogs, setDialogs] = useState<Dialog[]>([]);
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [selectedDialog, setSelectedDialog] = useState<Dialog | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState<ImportProgress | null>(null);

  const loadDialogs = async () => {
    setLoading(true);
    try {
      const response = await importApi.getDialogs();
      setDialogs(response.data);
    } catch (error) {
      console.error('Failed to load dialogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFiles = async (dialog: Dialog) => {
    setLoading(true);
    try {
      const response = await importApi.getDialogFiles(dialog.id, dialog.type);
      setFiles(response.data);
      setSelectedDialog(dialog);
      setStep('files');
    } catch (error) {
      console.error('Failed to load files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!selectedDialog || selectedFiles.size === 0) return;

    setImporting(true);
    setStep('importing');
    
    const messageIds = Array.from(selectedFiles);
    const filesToImport = files.filter(f => selectedFiles.has(f.messageId));
    
    const progress: ImportProgress = {
      current: 0,
      total: messageIds.length,
      currentFileName: '',
      completed: [],
      failed: [],
    };
    setImportProgress(progress);

    for (let i = 0; i < messageIds.length; i++) {
      const messageId = messageIds[i];
      const fileInfo = filesToImport.find(f => f.messageId === messageId);
      
      progress.current = i + 1;
      progress.currentFileName = fileInfo?.name || `File ${i + 1}`;
      setImportProgress({ ...progress });

      try {
        await importApi.importSingleFile(
          selectedDialog.id,
          selectedDialog.name,
          selectedDialog.type,
          messageId
        );
        progress.completed.push(messageId);
      } catch (error) {
        console.error(`Failed to import file ${messageId}:`, error);
        progress.failed.push(messageId);
      }
      
      setImportProgress({ ...progress });
    }

    setImporting(false);
    
    const successCount = progress.completed.length;
    const failCount = progress.failed.length;
    
    if (successCount > 0) {
      onImportComplete();
    }
    
    if (failCount === 0) {
      alert(`Successfully imported ${successCount} files to folder "${selectedDialog.name}"`);
      handleClose();
    } else {
      alert(`Imported ${successCount} files. ${failCount} files failed.`);
    }
  };

  const handleClose = () => {
    if (importing) return;
    setStep('dialogs');
    setDialogs([]);
    setFiles([]);
    setSelectedDialog(null);
    setSelectedFiles(new Set());
    setSearchQuery('');
    setImportProgress(null);
    onClose();
  };

  const toggleFile = (messageId: number) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(messageId)) {
      newSelected.delete(messageId);
    } else {
      newSelected.add(messageId);
    }
    setSelectedFiles(newSelected);
  };

  const toggleAll = () => {
    if (selectedFiles.size === files.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(files.map(f => f.messageId)));
    }
  };

  const filteredDialogs = dialogs.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDialogIcon = (type: string) => {
    switch (type) {
      case 'saved': return '💾';
      case 'user': return '👤';
      case 'group': return '👥';
      case 'channel': return '📢';
      default: return '💬';
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.startsWith('video/')) return '🎥';
    if (mimeType.startsWith('audio/')) return '🎵';
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('zip') || mimeType.includes('rar')) return '📦';
    return '📄';
  };

  const selectedSize = files
    .filter(f => selectedFiles.has(f.messageId))
    .reduce((sum, f) => sum + f.size, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={handleClose}>
      <div 
        className="bg-white rounded-lg w-full max-w-xl max-h-[80vh] flex flex-col animate-slideUp shadow-[0_0_0_1px_rgba(15,15,15,0.05),0_3px_6px_rgba(15,15,15,0.1),0_9px_24px_rgba(15,15,15,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            {step === 'files' && !importing && (
              <button
                onClick={() => setStep('dialogs')}
                className="p-1 hover:bg-[var(--bg-hover)] rounded transition-colors text-[var(--text-secondary)]"
              >
                <ArrowLeft size={16} strokeWidth={2} />
              </button>
            )}
            <h2 className="font-medium text-[var(--text-primary)]">
              {step === 'dialogs' ? 'Import from Telegram' : 
               step === 'importing' ? 'Importing...' : selectedDialog?.name}
            </h2>
          </div>
          <button 
            onClick={handleClose} 
            className="p-1 hover:bg-[var(--bg-hover)] rounded transition-colors disabled:opacity-40 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            disabled={importing}
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {step === 'importing' && importProgress ? (
            <div className="py-2">
              <div className="mb-6">
                <div className="flex justify-between text-xs text-[var(--text-secondary)] mb-2">
                  <span>Progress: {importProgress.current} of {importProgress.total}</span>
                  <span>{Math.round((importProgress.current / importProgress.total) * 100)}%</span>
                </div>
                <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-1.5">
                  <div 
                    className="bg-[var(--text-primary)] h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[var(--bg-secondary)] rounded mb-4">
                <Loader2 size={16} strokeWidth={2} className="animate-spin text-[var(--text-secondary)]" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[var(--text-tertiary)]">Currently importing:</p>
                  <p className="text-sm font-medium truncate text-[var(--text-primary)]">{importProgress.currentFileName}</p>
                </div>
              </div>

              <div className="space-y-1 max-h-52 overflow-y-auto">
                {files.filter(f => selectedFiles.has(f.messageId)).map((file) => {
                  const isCompleted = importProgress.completed.includes(file.messageId);
                  const isFailed = importProgress.failed.includes(file.messageId);
                  const isPending = !isCompleted && !isFailed && 
                    importProgress.currentFileName !== file.name;
                  
                  return (
                    <div
                      key={file.messageId}
                      className={cn(
                        'flex items-center gap-3 p-2 rounded',
                        isCompleted ? 'bg-[var(--accent-green)]/10' : 
                        isFailed ? 'bg-[var(--accent-red)]/10' : 
                        'bg-[var(--bg-secondary)]'
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle size={14} strokeWidth={2} className="text-[var(--accent-green)] flex-shrink-0" />
                      ) : isFailed ? (
                        <XCircle size={14} strokeWidth={2} className="text-[var(--accent-red)] flex-shrink-0" />
                      ) : isPending ? (
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-[var(--border-strong)] flex-shrink-0" />
                      ) : (
                        <Loader2 size={14} strokeWidth={2} className="animate-spin text-[var(--text-secondary)] flex-shrink-0" />
                      )}
                      <span className={cn(
                        'truncate text-sm',
                        isCompleted ? 'text-[var(--accent-green)]' : 
                        isFailed ? 'text-[var(--accent-red)]' : 
                        'text-[var(--text-secondary)]'
                      )}>
                        {file.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              {importProgress.completed.length > 0 && (
                <div className="mt-4 text-xs text-[var(--text-secondary)]">
                  ✓ {importProgress.completed.length} completed
                  {importProgress.failed.length > 0 && (
                    <span className="text-[var(--accent-red)] ml-3">
                      ✗ {importProgress.failed.length} failed
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : step === 'dialogs' ? (
            <>
              <p className="text-sm text-[var(--text-secondary)] mb-4">Select a chat to import files from:</p>
              
              <div className="relative mb-4">
                <Search size={14} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => !dialogs.length && loadDialogs()}
                  className={cn(
                    'w-full pl-9 pr-4 py-2 rounded text-sm',
                    'border border-[var(--border-color)]',
                    'focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/25',
                    'placeholder:text-[var(--text-placeholder)]',
                    'transition-shadow'
                  )}
                />
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={20} strokeWidth={2} className="animate-spin text-[var(--text-tertiary)]" />
                </div>
              ) : (
                <div className="space-y-0.5">
                  {filteredDialogs.map((dialog) => (
                    <button
                      key={dialog.id}
                      onClick={() => loadFiles(dialog)}
                      className="w-full flex items-center gap-3 p-2.5 hover:bg-[var(--bg-hover)] rounded text-left transition-colors"
                    >
                      <span className="text-xl">{getDialogIcon(dialog.type)}</span>
                      <span className="flex-1 text-sm font-medium text-[var(--text-primary)]">{dialog.name}</span>
                      <span className="text-[var(--text-tertiary)]">→</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <p className="text-sm text-[var(--text-secondary)] mb-1">Select files to import:</p>
              <p className="text-xs text-[var(--text-tertiary)] mb-4">
                Will be saved to folder: <span className="font-medium text-[var(--text-secondary)]">"{selectedDialog?.name}"</span>
              </p>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={20} strokeWidth={2} className="animate-spin text-[var(--text-tertiary)]" />
                </div>
              ) : files.length === 0 ? (
                <p className="text-center text-sm text-[var(--text-tertiary)] py-8">No files found in this chat</p>
              ) : (
                <>
                  <div className="mb-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFiles.size === files.length}
                        onChange={toggleAll}
                        className="w-4 h-4 rounded border-[var(--border-strong)]"
                      />
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        Select All ({files.length} files)
                      </span>
                    </label>
                  </div>

                  <div className="space-y-0.5 max-h-72 overflow-y-auto">
                    {files.map((file) => (
                      <label
                        key={file.messageId}
                        className="flex items-center gap-3 p-2.5 hover:bg-[var(--bg-hover)] rounded cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFiles.has(file.messageId)}
                          onChange={() => toggleFile(file.messageId)}
                          className="w-4 h-4 rounded border-[var(--border-strong)]"
                        />
                        <span className="text-xl">{getFileIcon(file.mimeType)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate text-[var(--text-primary)]">{file.name}</p>
                          <p className="text-xs text-[var(--text-tertiary)]">{formatFileSize(file.size)}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {step === 'files' && files.length > 0 && (
          <div className="border-t border-[var(--border-color)] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-[var(--text-secondary)]">
                Selected: {selectedFiles.size} files ({formatFileSize(selectedSize)})
              </span>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={handleClose}
                className="px-3 py-1.5 text-sm rounded hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={selectedFiles.size === 0 || importing}
                className={cn(
                  'px-3 py-1.5 text-sm rounded flex items-center gap-2',
                  'bg-[var(--text-primary)] text-white',
                  'hover:opacity-85 disabled:opacity-40',
                  'transition-opacity'
                )}
              >
                {importing && <Loader2 size={14} strokeWidth={2} className="animate-spin" />}
                Import Selected
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
