import { Download, Pencil, Trash2, FolderInput, FolderPlus, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContextMenuProps {
  x: number;
  y: number;
  type: 'file' | 'folder' | 'background';
  onClose: () => void;
  onDownload?: () => void;
  onRename: () => void;
  onMove: () => void;
  onDelete: () => void;
  onNewFolder?: () => void;
  onUpload?: () => void;
}

export function ContextMenu({
  x,
  y,
  type,
  onClose,
  onDownload,
  onRename,
  onMove,
  onDelete,
  onNewFolder,
  onUpload,
}: ContextMenuProps) {
  const menuItems = type === 'background' 
    ? [
        { icon: FolderPlus, label: 'New Folder', onClick: onNewFolder || (() => {}) },
        { icon: Upload, label: 'Upload Files', onClick: onUpload || (() => {}) },
      ]
    : [
        ...(type === 'file' && onDownload
          ? [{ icon: Download, label: 'Download', onClick: onDownload }]
          : []),
        { icon: Pencil, label: 'Rename', onClick: onRename },
        { icon: FolderInput, label: 'Move to...', onClick: onMove },
        { icon: Trash2, label: 'Delete', onClick: onDelete, danger: true },
      ];

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="fixed z-50 bg-white rounded-lg p-1 min-w-[160px] animate-slideUp shadow-[0_0_0_1px_rgba(15,15,15,0.05),0_3px_6px_rgba(15,15,15,0.1),0_9px_24px_rgba(15,15,15,0.2)]"
        style={{ left: x, top: y }}
      >
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              item.onClick();
              onClose();
            }}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left rounded',
              'hover:bg-[var(--bg-hover)] transition-colors',
              item.danger ? 'text-[var(--accent-red)]' : 'text-[var(--text-primary)]'
            )}
          >
            <item.icon size={14} strokeWidth={2} className={item.danger ? '' : 'text-[var(--text-secondary)]'} />
            {item.label}
          </button>
        ))}
      </div>
    </>
  );
}
