import { useState, useEffect, useCallback } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { FileGrid } from '@/components/files/FileGrid';
import { FileList } from '@/components/files/FileList';
import { ContextMenu } from '@/components/files/ContextMenu';
import { UploadModal } from '@/components/modals/UploadModal';
import { NewFolderModal } from '@/components/modals/NewFolderModal';
import { RenameModal } from '@/components/modals/RenameModal';
import { useDriveStore, FileItem, FolderItem } from '@/stores/drive.store';
import { foldersApi, filesApi } from '@/lib/api';

interface ContextMenuState {
  x: number;
  y: number;
  item: FileItem | FolderItem;
  type: 'file' | 'folder';
}

export function DrivePage() {
  const {
    currentFolderId,
    viewMode,
    setFiles,
    setFolders,
    setFolderTree,
    setLoading,
    addToPath,
  } = useDriveStore();

  const [showUpload, setShowUpload] = useState(false);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [showRename, setShowRename] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [renameItem, setRenameItem] = useState<{ id: string; name: string; type: 'file' | 'folder' } | null>(null);

  const loadContent = useCallback(async () => {
    setLoading(true);
    try {
      const [foldersRes, filesRes] = await Promise.all([
        foldersApi.list(currentFolderId),
        filesApi.list(currentFolderId),
      ]);
      setFolders(foldersRes.data);
      setFiles(filesRes.data);
    } catch (error) {
      console.error('Failed to load content:', error);
    } finally {
      setLoading(false);
    }
  }, [currentFolderId, setFiles, setFolders, setLoading]);

  const loadFolderTree = useCallback(async () => {
    try {
      const { data } = await foldersApi.tree();
      setFolderTree(data);
    } catch (error) {
      console.error('Failed to load folder tree:', error);
    }
  }, [setFolderTree]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  useEffect(() => {
    loadFolderTree();
  }, [loadFolderTree]);

  const handleFolderOpen = (folder: FolderItem) => {
    addToPath(folder);
  };

  const handleFileOpen = async (file: FileItem) => {
    try {
      const response = await filesApi.download(file.id);
      const url = window.URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download file:', error);
    }
  };

  const handleContextMenu = (
    e: React.MouseEvent,
    item: FileItem | FolderItem,
    type: 'file' | 'folder'
  ) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, item, type });
  };

  const handleUpload = async (files: File[]) => {
    for (const file of files) {
      try {
        await filesApi.upload(file, currentFolderId || undefined);
      } catch (error) {
        console.error('Failed to upload file:', error);
      }
    }
    loadContent();
  };

  const handleCreateFolder = async (name: string) => {
    try {
      await foldersApi.create(name, currentFolderId || undefined);
      loadContent();
      loadFolderTree();
    } catch (error) {
      console.error('Failed to create folder:', error);
    }
  };

  const handleRename = async (name: string) => {
    if (!renameItem) return;
    try {
      if (renameItem.type === 'folder') {
        await foldersApi.update(renameItem.id, name);
        loadFolderTree();
      } else {
        await filesApi.rename(renameItem.id, name);
      }
      loadContent();
    } catch (error) {
      console.error('Failed to rename:', error);
    }
  };

  const handleDelete = async () => {
    if (!contextMenu) return;
    try {
      if (contextMenu.type === 'folder') {
        await foldersApi.delete(contextMenu.item.id);
        loadFolderTree();
      } else {
        await filesApi.delete(contextMenu.item.id);
      }
      loadContent();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      loadContent();
      return;
    }
    try {
      const { data } = await filesApi.search(query);
      setFiles(data);
      setFolders([]);
    } catch (error) {
      console.error('Failed to search:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Header onUpload={() => setShowUpload(true)} onSearch={handleSearch} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar onNewFolder={() => setShowNewFolder(true)} />

        <main className="flex-1 flex flex-col overflow-hidden">
          <Breadcrumb />

          <div className="flex-1 overflow-auto">
            {viewMode === 'grid' ? (
              <FileGrid
                onFolderOpen={handleFolderOpen}
                onFileOpen={handleFileOpen}
                onContextMenu={handleContextMenu}
              />
            ) : (
              <FileList
                onFolderOpen={handleFolderOpen}
                onFileOpen={handleFileOpen}
                onContextMenu={handleContextMenu}
              />
            )}
          </div>
        </main>
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          type={contextMenu.type}
          onClose={() => setContextMenu(null)}
          onDownload={
            contextMenu.type === 'file'
              ? () => handleFileOpen(contextMenu.item as FileItem)
              : undefined
          }
          onRename={() => {
            setRenameItem({
              id: contextMenu.item.id,
              name: contextMenu.item.name,
              type: contextMenu.type,
            });
            setShowRename(true);
          }}
          onMove={() => {
            // TODO: Implement move modal
          }}
          onDelete={handleDelete}
        />
      )}

      <UploadModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onUpload={handleUpload}
      />

      <NewFolderModal
        isOpen={showNewFolder}
        onClose={() => setShowNewFolder(false)}
        onCreate={handleCreateFolder}
      />

      <RenameModal
        isOpen={showRename}
        currentName={renameItem?.name || ''}
        onClose={() => {
          setShowRename(false);
          setRenameItem(null);
        }}
        onRename={handleRename}
      />
    </div>
  );
}
