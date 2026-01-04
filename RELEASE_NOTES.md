# Release Notes

## [v0.2.1] - 2026-01-04

### ✨ Making Telebox Simpler & More Transparent
*This update focuses on making our security values clear and the experience more human.*

#### 🛡️ Peace of Mind, Front and Center
- **Security & Privacy Hub**: We’ve added dedicated spaces to explain exactly how we protect your data. No more guessing—just clear, honest information about your privacy.
- **Safety at a Glance**: A new security indicator in your drive sidebar gives you the confidence that your files are always encrypted and purely yours.

---

## [v0.2.0] - 2026-01-03

### 🎉 New Features
- **Move To Functionality**: Add comprehensive 'Move to' feature for files and folders
  - New MoveToModal component with folder tree navigation
  - Support for single and batch move operations
  - Recursive folder tree filtering with optimized performance
  - Context menu integration for quick access

### 🐛 Bug Fixes
- **Modal Styling**: Fix button visibility issues in modals
  - Resolved "Move here" button not appearing due to CSS reset conflicts
  - Updated global button styles to allow Tailwind classes to work properly
- **Folder Tree**: Fix folders disappearing when selected in MoveToModal
  - Implemented proper recursive filtering
  - Added useMemo optimization to prevent unnecessary re-renders
  - Removed redundant exclusion checks

### 🎨 UI/UX Improvements
- **Design System**: Apply Notion-inspired design guidelines
  - Subtle gray highlights for selected items (`bg-black/10`)
  - Consistent hover states (`hover:bg-black/5`)
  - Dark primary button with proper contrast
  - Warm gray backgrounds (`#f7f6f3`)
- **Selection Bar**: Move to floating position with improved UX
- **Mobile FAB**: Refactor positioning and styling
- **Trash Modal**: Improve accessibility and styling

### ✨ Enhancements
- **Drag & Drop**: Add global drag-and-drop file upload
- **Import**: Enable Telegram import in mobile and desktop UI
- **Sorting**: Add file and folder sorting by name, size, and modified date
- **Mobile**: Add double-tap detection for file preview on touch devices
- **Batch Operations**: Add batch delete functionality for files and folders

### 📚 Documentation
- Remove pricing model documentation (now open source)
- Add open source section placeholder to landing page

### 🔧 Technical Improvements
- Optimize folder tree filtering with `useMemo`
- Enhanced query invalidation for better data consistency
- Improved React hooks usage (fixed hooks order violations)

---

## [v0.1.0] - 2025-12-29

### 🎉 Initial Release

This is the first official release of **Telebox** - a self-hosted cloud storage solution powered by Telegram.

### 🚀 Core Features

#### Authentication & Security
- Telegram-based authentication using MTProto
- Session persistence across server restarts
- Phone number validation with country selector
- End-to-end encryption for file metadata
- Secure file storage using Telegram's infrastructure

#### File Management
- Upload files to Telegram cloud storage
- Download files with progress tracking
- File preview for multiple formats (images, videos, PDFs, text)
- MIME type detection and handling
- Soft delete with trash functionality
- Permanent delete from trash
- File renaming and organization

#### Folder Management
- Create and organize folders
- Nested folder structure
- Folder navigation with breadcrumbs
- Folder-based routing
- Context menu for folder operations
- Soft delete folders with contents

#### Favorites
- Mark files and folders as favorites
- Quick access to favorite items
- Toggle favorite status

#### Selection & Batch Operations
- Multi-select files and folders
- Keyboard shortcuts for selection
- Drag selection support
- Batch move operations
- Batch delete operations
- Visual selection feedback

#### Import from Telegram
- Browse Telegram dialogs (chats, channels, groups)
- Import files from Telegram conversations
- Support for different chat types
- Progress tracking for imports
- Single file import endpoint

#### Drag & Drop
- Drag and drop file/folder movement
- Visual feedback during drag operations
- Drop zone highlighting

#### Mobile Support
- Responsive design for mobile devices
- Mobile-optimized UI components
- Touch-friendly interactions
- Mobile FAB (Floating Action Button)
- Viewport adjustments for mobile browsers

---

## Version History

- **v0.2.1** (2026-01-04) - Security hub, UI revamp, and design system alignment
- **v0.2.0** (2026-01-03) - Move To functionality and modal improvements
- **v0.1.0** (2025-12-29) - Initial release with core features

---

## Upgrade Notes

### From v0.2.0 to v0.2.1

Fully compatible. No breaking database or API changes.

**Updates:**
- New background and text variables applied for the updated design system.
- Simplified technical copy for better user conversion.

---

## Upgrade Notes

### From v0.1.0 to v0.2.0

No breaking changes. This release is fully backward compatible.

**New Features Available:**
- Use the context menu or selection bar to access the new "Move to" functionality
- Enjoy improved modal styling and button visibility
- Experience better performance with optimized folder tree rendering

**CSS Changes:**
- Global button reset has been updated - if you have custom button styles, verify they still work correctly

---

## Contributors

- [@whyrsm](https://github.com/whyrsm) - Project maintainer

---

## License

This project is open source and available under the MIT License.
