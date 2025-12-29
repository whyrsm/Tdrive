import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { FileItem, FolderItem } from '@/stores/drive.store';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number | string): string {
  const size = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes;
  if (size === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(size) / Math.log(k));
  return parseFloat((size / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getFileIcon(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.includes('pdf')) return 'pdf';
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) return 'archive';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'doc';
  if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'sheet';
  return 'file';
}

type SortField = 'name' | 'size' | 'modified';
type SortDirection = 'asc' | 'desc';

export function sortItems<T extends FileItem | FolderItem>(
  items: T[],
  field: SortField,
  direction: SortDirection
): T[] {
  const sorted = [...items].sort((a, b) => {
    let comparison = 0;

    switch (field) {
      case 'name':
        comparison = a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
        break;
      case 'size':
        // Folders don't have size, treat as 0
        const sizeA = 'size' in a ? parseInt(a.size, 10) : 0;
        const sizeB = 'size' in b ? parseInt(b.size, 10) : 0;
        comparison = sizeA - sizeB;
        break;
      case 'modified':
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
    }

    return direction === 'asc' ? comparison : -comparison;
  });

  return sorted;
}
