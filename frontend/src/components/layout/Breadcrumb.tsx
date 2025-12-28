import { ChevronRight, Home } from 'lucide-react';
import { useDriveStore } from '@/stores/drive.store';

export function Breadcrumb() {
  const { folderPath, navigateToPathIndex } = useDriveStore();

  return (
    <div className="flex items-center gap-1 px-4 py-2 text-sm border-b border-[var(--border-color)] bg-white">
      <button
        onClick={() => navigateToPathIndex(-1)}
        className="flex items-center gap-1 px-2 py-1 rounded hover:bg-[var(--hover-bg)]"
      >
        <Home size={14} />
        <span>My Drive</span>
      </button>

      {folderPath.map((folder, index) => (
        <div key={folder.id} className="flex items-center">
          <ChevronRight size={14} className="text-[var(--text-secondary)]" />
          <button
            onClick={() => navigateToPathIndex(index)}
            className="px-2 py-1 rounded hover:bg-[var(--hover-bg)]"
          >
            {folder.name}
          </button>
        </div>
      ))}
    </div>
  );
}
