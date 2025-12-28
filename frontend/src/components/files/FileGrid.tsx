import { memo } from 'react';
import { Folder, Loader2 } from 'lucide-react';
import { cn, formatFileSize, getFileIcon } from '@/lib/utils';
import { useDriveStore, FileItem, FolderItem } from '@/stores/drive.store';
import { FILE_ICON_MAP } from '@/lib/constants';
import { useFileItemHandlers } from '@/hooks/useFileItemHandlers';

interface FileGridProps {
  files: FileItem[];
  folders: FolderItem[];
  isLoading?: boolean;
  onFolderOpen: (folder: FolderItem) => void;
  onFileOpen: (file: FileItem) => void;
  onContextMenu: (e: React.MouseEvent, item: FileItem | FolderItem, type: 'file' | 'folder') => void;
}

export const FileGrid = memo(function FileGrid({
  files,
  folders,
  isLoading,
  onFolderOpen,
  onFileOpen,
  onContextMenu,
}: FileGridProps) {
  const { selectedItems } = useDriveStore();
  const { handleClick, handleDoubleClick } = useFileItemHandlers(onFolderOpen, onFileOpen);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--text-tertiary)]" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-1 p-3">
      {folders.map((folder) => (
        <div
          key={folder.id}
          data-folder-item
          className={cn(
            'flex flex-col items-center p-3 rounded cursor-pointer transition-colors',
            'hover:bg-[var(--bg-hover)]',
            selectedItems.has(folder.id) && 'bg-[var(--selected-bg)]'
          )}
          onClick={(e) => handleClick(e, folder, 'folder')}
          onDoubleClick={() => handleDoubleClick(folder, 'folder')}
          onContextMenu={(e) => onContextMenu(e, folder, 'folder')}
        >
          <Folder size={40} strokeWidth={1.5} className="text-[var(--text-secondary)] mb-2" />
          <span className="text-xs text-center truncate w-full text-[var(--text-primary)]">{folder.name}</span>
        </div>
      ))}

      {files.map((file) => {
        const iconType = getFileIcon(file.mimeType);
        const Icon = FILE_ICON_MAP[iconType];

        return (
          <div
            key={file.id}
            data-file-item
            className={cn(
              'flex flex-col items-center p-3 rounded cursor-pointer transition-colors',
              'hover:bg-[var(--bg-hover)]',
              selectedItems.has(file.id) && 'bg-[var(--selected-bg)]'
            )}
            onClick={(e) => handleClick(e, file, 'file')}
            onDoubleClick={() => handleDoubleClick(file, 'file')}
            onContextMenu={(e) => onContextMenu(e, file, 'file')}
          >
            <Icon size={40} strokeWidth={1.5} className="text-[var(--text-secondary)] mb-2" />
            <span className="text-xs text-center truncate w-full text-[var(--text-primary)]">{file.name}</span>
            <span className="text-[10px] text-[var(--text-tertiary)]">
              {formatFileSize(file.size)}
            </span>
          </div>
        );
      })}

      {folders.length === 0 && files.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center py-16 text-[var(--text-tertiary)]">
          <Folder size={40} strokeWidth={1.5} className="mb-2 opacity-50" />
          <p className="text-sm">This folder is empty</p>
        </div>
      )}
    </div>
  );
});
