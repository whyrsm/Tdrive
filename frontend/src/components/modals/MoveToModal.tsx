import { useState, useMemo } from 'react';
import { X, Folder, ChevronRight, ChevronDown, HardDrive, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFolderTree } from '@/lib/queries';
import { FolderItem } from '@/stores/drive.store';

interface MoveToModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMove: (targetFolderId: string | null) => void;
  itemCount: number;
  itemType: 'file' | 'folder' | 'mixed';
  excludeFolderIds?: string[];
  isLoading?: boolean;
}

interface FolderTreeItemProps {
  folder: FolderItem;
  level: number;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

function FolderTreeItem({ folder, level, selectedId, onSelect }: FolderTreeItemProps) {
  const [isOpen, setIsOpen] = useState(true); // Default to open so nested folders are visible
  const hasChildren = folder.children && folder.children.length > 0;
  const isSelected = selectedId === folder.id;

  return (
    <div>
      <div
        className={cn(
          'group flex items-center py-2 cursor-pointer rounded-lg mx-2 transition-colors',
          'hover:bg-black/5',
          isSelected && 'bg-black/10 hover:bg-black/10'
        )}
        style={{ paddingLeft: `${8 + level * 20}px`, paddingRight: '8px' }}
        onClick={() => onSelect(folder.id)}
      >
        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mr-1">
          {hasChildren && (
            <button
              className={cn(
                'p-0.5 rounded transition-colors',
                'hover:bg-black/10'
              )}
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
            >
              {isOpen ? (
                <ChevronDown size={14} strokeWidth={2} className="text-gray-500" />
              ) : (
                <ChevronRight size={14} strokeWidth={2} className="text-gray-500" />
              )}
            </button>
          )}
        </div>
        <Folder size={16} strokeWidth={2} className="text-gray-500" />
        <span className={cn('truncate text-sm ml-2', isSelected ? 'font-medium text-[#37352f]' : 'text-[#37352f]')}>
          {folder.name}
        </span>
      </div>
      {isOpen && hasChildren && (
        <div>
          {folder.children!.map((child) => (
            <FolderTreeItem
              key={child.id}
              folder={child}
              level={level + 1}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function MoveToModal({
  isOpen,
  onClose,
  onMove,
  itemCount,
  itemType,
  excludeFolderIds = [],
  isLoading = false,
}: MoveToModalProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const { data: folderTree = [], isLoading: isLoadingTree } = useFolderTree();

  // Recursively filter out excluded folders from the entire tree
  // This must be called before any early returns to follow React hooks rules
  const filteredTree = useMemo(() => {
    const filterFolderTree = (folders: FolderItem[]): FolderItem[] => {
      return folders
        .filter(f => !excludeFolderIds.includes(f.id))
        .map(folder => ({
          ...folder,
          children: folder.children ? filterFolderTree(folder.children) : undefined
        }));
    };
    return filterFolderTree(folderTree);
  }, [folderTree, excludeFolderIds]);

  if (!isOpen) return null;

  const getItemLabel = () => {
    if (itemCount === 1) {
      return itemType === 'file' ? '1 file' : itemType === 'folder' ? '1 folder' : '1 item';
    }
    return itemType === 'file'
      ? `${itemCount} files`
      : itemType === 'folder'
        ? `${itemCount} folders`
        : `${itemCount} items`;
  };

  const handleMove = () => {
    onMove(selectedFolderId);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-black/10">
            <h2 className="text-base font-semibold text-[#37352f]">
              Move {getItemLabel()}
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-black/5 rounded transition-colors text-gray-500"
            >
              <X size={18} strokeWidth={2} />
            </button>
          </div>

          {/* Folder tree */}
          <div className="max-h-96 overflow-y-auto py-2">
            {isLoadingTree ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              </div>
            ) : (
              <>
                {/* My Drive (root) option */}
                <div
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 cursor-pointer rounded-lg mx-2 transition-colors',
                    'hover:bg-black/5',
                    selectedFolderId === null && 'bg-black/10 hover:bg-black/10'
                  )}
                  onClick={() => setSelectedFolderId(null)}
                >
                  <HardDrive size={16} strokeWidth={2} className="text-gray-500" />
                  <span className={cn('text-sm font-medium', selectedFolderId === null ? 'text-[#37352f]' : 'text-[#37352f]')}>
                    My Drive
                  </span>
                </div>

                {/* Folder tree */}
                {filteredTree.length > 0 && (
                  <div className="mt-1">
                    {filteredTree.map((folder) => (
                      <FolderTreeItem
                        key={folder.id}
                        folder={folder}
                        level={0}
                        selectedId={selectedFolderId}
                        onSelect={setSelectedFolderId}
                      />
                    ))}
                  </div>
                )}

                {filteredTree.length === 0 && (
                  <p className="text-sm text-[#9b9a97] text-center py-4">
                    No folders available
                  </p>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 px-4 py-3 border-t border-black/10 bg-[#f7f6f3]">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-[#787774] hover:bg-black/5 rounded transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleMove}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium rounded transition-opacity bg-[#37352f] text-white hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Moving...</span>
                </>
              ) : (
                'Move here'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
