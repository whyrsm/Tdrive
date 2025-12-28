import { useState, useRef } from 'react';
import { X, Upload, File } from 'lucide-react';
import { cn, formatFileSize } from '@/lib/utils';
import { useUploadStore } from '@/stores/upload.store';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  folderId?: string;
}

export function UploadModal({ isOpen, onClose, folderId }: UploadModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addUploads } = useUploadStore();

  if (!isOpen) return null;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      addUploads(selectedFiles, folderId);
      setSelectedFiles([]);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div 
        className="bg-white rounded-lg w-full max-w-md mx-4 animate-slideUp shadow-[0_0_0_1px_rgba(15,15,15,0.05),0_3px_6px_rgba(15,15,15,0.1),0_9px_24px_rgba(15,15,15,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)]">
          <h2 className="font-medium text-[var(--text-primary)]">Upload Files</h2>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-[var(--bg-hover)] rounded transition-colors text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        <div className="p-4">
          <div
            className={cn(
              'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer',
              'transition-colors',
              isDragging
                ? 'border-[var(--accent)] bg-[var(--accent)]/5'
                : 'border-[var(--border-strong)] hover:border-[var(--text-tertiary)]'
            )}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <Upload size={28} strokeWidth={1.5} className="mx-auto mb-2 text-[var(--text-tertiary)]" />
            <p className="text-sm text-[var(--text-primary)]">Drag and drop files here</p>
            <p className="text-xs text-[var(--text-tertiary)] mt-1">or click to browse</p>
            <input
              ref={inputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          {selectedFiles.length > 0 && (
            <div className="mt-4 max-h-48 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 py-2 border-b border-[var(--border-color)] last:border-0"
                >
                  <File size={14} strokeWidth={2} className="text-[var(--text-secondary)]" />
                  <span className="flex-1 text-sm truncate text-[var(--text-primary)]">{file.name}</span>
                  <span className="text-xs text-[var(--text-tertiary)]">
                    {formatFileSize(file.size)}
                  </span>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-1 hover:bg-[var(--bg-hover)] rounded transition-colors text-[var(--text-tertiary)]"
                  >
                    <X size={12} strokeWidth={2} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 px-4 py-3 border-t border-[var(--border-color)]">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm rounded hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={selectedFiles.length === 0}
            className={cn(
              'px-3 py-1.5 text-sm rounded btn-primary',
              'text-white',
              'hover:opacity-85 disabled:opacity-40',
              'transition-opacity'
            )}
          >
            Upload {selectedFiles.length > 0 && `(${selectedFiles.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}
