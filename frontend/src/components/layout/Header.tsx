import { useState } from 'react';
import { Search, Grid, List, LogOut, User, Menu, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDriveStore } from '@/stores/drive.store';
import { useAuthStore } from '@/stores/auth.store';
import { Logo } from '@/components/Logo';

interface HeaderProps {
  onSearch: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const { viewMode, setViewMode, searchQuery, setSearchQuery, toggleSidebar, sortField, sortDirection, setSortField, toggleSortDirection } = useDriveStore();
  const { user, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="h-12 border-b border-[var(--border-color)] flex items-center px-2 sm:px-4 gap-2 sm:gap-4 bg-white">
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-1.5 hover:bg-[var(--bg-hover)] rounded transition-colors text-[var(--text-secondary)]"
        aria-label="Toggle sidebar"
      >
        <Menu size={20} strokeWidth={2} />
      </button>

      <Logo size="sm" linkTo="/drive" className="hidden sm:flex" showVersion />

      {/* Desktop search */}
      <form onSubmit={handleSearch} className="hidden sm:block flex-1 max-w-md mx-auto">
        <div className="relative">
          <Search
            size={16}
            strokeWidth={2}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
          />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              'w-full pl-9 pr-4 py-1.5 rounded',
              'bg-[var(--bg-secondary)] border border-transparent',
              'focus:bg-white focus:border-[var(--border-strong)] focus:outline-none',
              'text-sm placeholder:text-[var(--text-placeholder)]',
              'transition-all duration-150'
            )}
          />
        </div>
      </form>

      {/* Mobile search toggle */}
      <button
        onClick={() => setShowMobileSearch(!showMobileSearch)}
        className="sm:hidden p-1.5 hover:bg-[var(--bg-hover)] rounded transition-colors text-[var(--text-secondary)] ml-auto"
        aria-label="Search"
      >
        <Search size={18} strokeWidth={2} />
      </button>

      <div className="flex items-center gap-1">
        {/* Sort dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="p-1.5 hover:bg-[var(--bg-hover)] rounded transition-colors text-[var(--text-secondary)] flex items-center gap-1"
            title="Sort"
          >
            {sortDirection === 'asc' ? (
              <ArrowUp size={16} strokeWidth={2} />
            ) : (
              <ArrowDown size={16} strokeWidth={2} />
            )}
          </button>
          {showSortMenu && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowSortMenu(false)} 
              />
              <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg py-1 z-50 animate-slideUp shadow-[0_0_0_1px_rgba(15,15,15,0.05),0_3px_6px_rgba(15,15,15,0.1),0_9px_24px_rgba(15,15,15,0.2)]">
                <div className="px-3 py-1.5 text-xs text-[var(--text-tertiary)] font-medium">Sort by</div>
                <button
                  onClick={() => {
                    setSortField('name');
                    setShowSortMenu(false);
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-[var(--bg-hover)] text-left transition-colors',
                    sortField === 'name' ? 'text-[var(--accent-color)] font-medium' : 'text-[var(--text-primary)]'
                  )}
                >
                  Name
                  {sortField === 'name' && (
                    sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  )}
                </button>
                <button
                  onClick={() => {
                    setSortField('size');
                    setShowSortMenu(false);
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-[var(--bg-hover)] text-left transition-colors',
                    sortField === 'size' ? 'text-[var(--accent-color)] font-medium' : 'text-[var(--text-primary)]'
                  )}
                >
                  Size
                  {sortField === 'size' && (
                    sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  )}
                </button>
                <button
                  onClick={() => {
                    setSortField('modified');
                    setShowSortMenu(false);
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-[var(--bg-hover)] text-left transition-colors',
                    sortField === 'modified' ? 'text-[var(--accent-color)] font-medium' : 'text-[var(--text-primary)]'
                  )}
                >
                  Modified
                  {sortField === 'modified' && (
                    sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  )}
                </button>
                <div className="border-t border-[var(--border-color)] my-1" />
                <button
                  onClick={() => {
                    toggleSortDirection();
                    setShowSortMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--bg-hover)] text-left text-[var(--text-primary)] transition-colors"
                >
                  <ArrowUpDown size={14} />
                  {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
                </button>
              </div>
            </>
          )}
        </div>

        <div className="hidden xs:flex rounded overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'p-1.5 rounded transition-colors',
              viewMode === 'grid'
                ? 'bg-[var(--bg-active)] text-[var(--text-primary)]'
                : 'text-[var(--text-tertiary)] hover:bg-[var(--bg-hover)]'
            )}
          >
            <Grid size={16} strokeWidth={2} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'p-1.5 rounded transition-colors',
              viewMode === 'list'
                ? 'bg-[var(--bg-active)] text-[var(--text-primary)]'
                : 'text-[var(--text-tertiary)] hover:bg-[var(--bg-hover)]'
            )}
          >
            <List size={16} strokeWidth={2} />
          </button>
        </div>

        <div className="relative ml-1 sm:ml-2">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-7 h-7 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center hover:bg-[var(--bg-active)] transition-colors"
          >
            <User size={14} strokeWidth={2} className="text-[var(--text-secondary)]" />
          </button>
          {showUserMenu && (
            <>
              {/* Backdrop for mobile */}
              <div 
                className="fixed inset-0 z-40 sm:hidden" 
                onClick={() => setShowUserMenu(false)} 
              />
              <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-lg py-1 z-50 animate-slideUp shadow-[0_0_0_1px_rgba(15,15,15,0.05),0_3px_6px_rgba(15,15,15,0.1),0_9px_24px_rgba(15,15,15,0.2)]">
                <div className="px-3 py-2 border-b border-[var(--border-color)]">
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">{user?.phone}</p>
                </div>
                {/* Mobile view mode toggle */}
                <div className="xs:hidden px-3 py-2 border-b border-[var(--border-color)]">
                  <p className="text-xs text-[var(--text-tertiary)] mb-2">View</p>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={cn(
                        'flex-1 p-2 rounded text-sm flex items-center justify-center gap-1',
                        viewMode === 'grid'
                          ? 'bg-[var(--bg-active)] text-[var(--text-primary)]'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                      )}
                    >
                      <Grid size={14} /> Grid
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={cn(
                        'flex-1 p-2 rounded text-sm flex items-center justify-center gap-1',
                        viewMode === 'list'
                          ? 'bg-[var(--bg-active)] text-[var(--text-primary)]'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                      )}
                    >
                      <List size={14} /> List
                    </button>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--bg-hover)] text-left text-[var(--text-primary)] transition-colors"
                >
                  <LogOut size={14} strokeWidth={2} className="text-[var(--text-secondary)]" />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile search bar - slides down */}
      {showMobileSearch && (
        <div className="absolute top-12 left-0 right-0 p-2 bg-white border-b border-[var(--border-color)] sm:hidden z-30">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search
                size={16}
                strokeWidth={2}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
              />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className={cn(
                  'w-full pl-9 pr-4 py-2 rounded',
                  'bg-[var(--bg-secondary)] border border-transparent',
                  'focus:bg-white focus:border-[var(--border-strong)] focus:outline-none',
                  'text-sm placeholder:text-[var(--text-placeholder)]',
                  'transition-all duration-150'
                )}
              />
            </div>
          </form>
        </div>
      )}
    </header>
  );
}
