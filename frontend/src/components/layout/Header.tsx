import { useState } from 'react';
import { Search, Grid, List, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDriveStore } from '@/stores/drive.store';
import { useAuthStore } from '@/stores/auth.store';
import { Logo } from '@/components/Logo';

interface HeaderProps {
  onSearch: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const { viewMode, setViewMode, searchQuery, setSearchQuery } = useDriveStore();
  const { user, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="h-12 border-b border-[var(--border-color)] flex items-center px-4 gap-4 bg-white">
      <Logo size="sm" linkTo="/drive" />

      <form onSubmit={handleSearch} className="flex-1 max-w-md mx-auto">
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

      <div className="flex items-center gap-1">
        <div className="flex rounded overflow-hidden">
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

        <div className="relative ml-2">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-7 h-7 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center hover:bg-[var(--bg-active)] transition-colors"
          >
            <User size={14} strokeWidth={2} className="text-[var(--text-secondary)]" />
          </button>
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-lg py-1 z-50 animate-slideUp shadow-[0_0_0_1px_rgba(15,15,15,0.05),0_3px_6px_rgba(15,15,15,0.1),0_9px_24px_rgba(15,15,15,0.2)]">
              <div className="px-3 py-2 border-b border-[var(--border-color)]">
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">{user?.phone}</p>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--bg-hover)] text-left text-[var(--text-primary)] transition-colors"
              >
                <LogOut size={14} strokeWidth={2} className="text-[var(--text-secondary)]" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
