import { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

export function NewFolderModal({ isOpen, onClose, onCreate }: NewFolderModalProps) {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name.trim());
      setName('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div 
        className="bg-white rounded-lg w-full max-w-sm mx-4 animate-slideUp shadow-[0_0_0_1px_rgba(15,15,15,0.05),0_3px_6px_rgba(15,15,15,0.1),0_9px_24px_rgba(15,15,15,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)]">
          <h2 className="font-medium text-[var(--text-primary)]">New Folder</h2>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-[var(--bg-hover)] rounded transition-colors text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Folder name"
              autoFocus
              className={cn(
                'w-full px-3 py-2 rounded',
                'border border-[var(--border-color)]',
                'focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/25',
                'text-sm placeholder:text-[var(--text-placeholder)]',
                'transition-shadow'
              )}
            />
          </div>

          <div className="flex justify-end gap-2 px-4 py-3 border-t border-[var(--border-color)]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-sm rounded hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className={cn(
                'px-3 py-1.5 text-sm rounded btn-primary',
                'text-white',
                'hover:opacity-85 disabled:opacity-40',
                'transition-opacity'
              )}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
