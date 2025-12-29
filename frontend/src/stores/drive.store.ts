import { create } from 'zustand';

export interface FileItem {
  id: string;
  name: string;
  size: string;
  mimeType: string;
  messageId: string;
  folderId: string | null;
  isFavorite: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FolderItem {
  id: string;
  name: string;
  parentId: string | null;
  isFavorite: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  children?: FolderItem[];
}

type ViewMode = 'grid' | 'list';
type DriveView = 'drive' | 'favorites' | 'trash';
type SortField = 'name' | 'size' | 'modified';
type SortDirection = 'asc' | 'desc';

interface DriveState {
  // Navigation
  currentFolderId: string | null;
  folderPath: FolderItem[];
  currentView: DriveView;

  // UI state
  selectedItems: Set<string>;
  viewMode: ViewMode;
  searchQuery: string;
  sidebarOpen: boolean;
  sortField: SortField;
  sortDirection: SortDirection;

  // Actions
  setCurrentFolder: (folderId: string | null, path?: FolderItem[]) => void;
  setCurrentView: (view: DriveView) => void;
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (query: string) => void;
  setSortField: (field: SortField) => void;
  setSortDirection: (direction: SortDirection) => void;
  toggleSortDirection: () => void;
  toggleSelect: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  addToPath: (folder: FolderItem) => void;
  navigateToPathIndex: (index: number) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useDriveStore = create<DriveState>((set, get) => ({
  currentFolderId: null,
  folderPath: [],
  currentView: 'drive',
  selectedItems: new Set(),
  viewMode: 'grid',
  searchQuery: '',
  sidebarOpen: false,
  sortField: 'name',
  sortDirection: 'asc',

  setCurrentFolder: (folderId, path) => {
    set({
      currentFolderId: folderId,
      folderPath: path || [],
      selectedItems: new Set(),
      searchQuery: '',
      currentView: 'drive',
    });
  },

  setCurrentView: (view) => {
    set({
      currentView: view,
      selectedItems: new Set(),
      searchQuery: '',
    });
  },

  setViewMode: (mode) => set({ viewMode: mode }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortField: (field) => set({ sortField: field }),
  setSortDirection: (direction) => set({ sortDirection: direction }),
  toggleSortDirection: () => set((state) => ({ 
    sortDirection: state.sortDirection === 'asc' ? 'desc' : 'asc' 
  })),

  toggleSelect: (id) => {
    const selected = new Set(get().selectedItems);
    if (selected.has(id)) {
      selected.delete(id);
    } else {
      selected.add(id);
    }
    set({ selectedItems: selected });
  },

  selectAll: (ids) => {
    set({ selectedItems: new Set(ids) });
  },

  clearSelection: () => set({ selectedItems: new Set() }),

  addToPath: (folder) => {
    set((state) => ({
      folderPath: [...state.folderPath, folder],
      currentFolderId: folder.id,
      selectedItems: new Set(),
      searchQuery: '',
    }));
  },

  navigateToPathIndex: (index) => {
    set((state) => {
      if (index < 0) {
        return { folderPath: [], currentFolderId: null, selectedItems: new Set() };
      }
      const newPath = state.folderPath.slice(0, index + 1);
      return {
        folderPath: newPath,
        currentFolderId: newPath[newPath.length - 1]?.id || null,
        selectedItems: new Set(),
      };
    });
  },

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
