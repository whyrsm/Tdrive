import { X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  itemName: string;
  itemType: 'file' | 'folder';
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({
  isOpen,
  itemName,
  itemType,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      <div className="relative bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
          Delete {itemType}?
        </h2>
        
        <p className="text-[var(--text-secondary)] mb-6">
          Are you sure you want to delete <span className="font-medium text-[var(--text-primary)]">"{itemName}"</span>?
          {itemType === 'folder' && ' All contents will be permanently deleted.'}
          {' '}This action cannot be undone.
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#dc2626', color: '#ffffff', fontSize: '0.875rem', fontWeight: '500' }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
