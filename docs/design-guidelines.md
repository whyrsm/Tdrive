# Design Guidelines

Inspired by Notion's aesthetic: minimal, functional, black and white with purposeful interactions.

---

## Philosophy

- **Content first** — UI should disappear, letting content breathe
- **Quiet confidence** — No flashy colors or heavy shadows; subtle and refined
- **Progressive disclosure** — Show controls on hover, reveal complexity gradually
- **Instant feedback** — Every action should feel responsive and acknowledged

---

## Color Palette

### Core Colors
```css
:root {
  /* Backgrounds */
  --bg-primary: #ffffff;
  --bg-secondary: #f7f6f3;      /* Notion's warm gray */
  --bg-tertiary: #f1f1ef;
  --bg-hover: rgba(55, 53, 47, 0.08);
  --bg-active: rgba(55, 53, 47, 0.16);
  
  /* Text */
  --text-primary: #37352f;       /* Notion's signature dark */
  --text-secondary: #787774;
  --text-tertiary: #9b9a97;
  --text-placeholder: #c4c4c4;
  
  /* Borders */
  --border-default: rgba(55, 53, 47, 0.09);
  --border-strong: rgba(55, 53, 47, 0.16);
  --divider: rgba(55, 53, 47, 0.09);
  
  /* Accents (use sparingly) */
  --accent-blue: #2383e2;
  --accent-red: #e03e3e;
  --accent-green: #0f7b6c;
}
```

### Usage Rules
- Primary actions: `--text-primary` on `--bg-primary`
- Secondary/muted: `--text-secondary`
- Hover states: `--bg-hover` overlay
- Avoid colored backgrounds except for status indicators

---

## Typography

### Font Stack
```css
font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, 
             "Segoe UI", Helvetica, "Apple Color Emoji", Arial, 
             sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";
```

### Scale
| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| Page title | 40px | 700 | 1.2 |
| Heading 1 | 30px | 600 | 1.3 |
| Heading 2 | 24px | 600 | 1.3 |
| Heading 3 | 20px | 600 | 1.4 |
| Body | 16px | 400 | 1.5 |
| Small/Caption | 14px | 400 | 1.4 |
| UI/Labels | 12px | 500 | 1.3 |

### Guidelines
- Use `font-weight: 500` for interactive elements (buttons, links)
- Avoid bold (`700`) except for titles
- Letter-spacing: `-0.01em` for headings, `0` for body

---

## Spacing

### Base Unit: 4px

| Token | Value | Use Case |
|-------|-------|----------|
| `xs` | 4px | Icon padding, tight gaps |
| `sm` | 8px | Inline spacing, small gaps |
| `md` | 12px | Component padding |
| `lg` | 16px | Section gaps |
| `xl` | 24px | Card padding, major sections |
| `2xl` | 32px | Page margins |
| `3xl` | 48px | Large section breaks |

### Content Width
- Max content width: `900px`
- Sidebar width: `240px` (collapsible to `0`)
- Comfortable reading: `65ch` for text blocks

---

## Components

### Buttons

**Primary (rare — use for main CTA only)**
```css
.btn-primary {
  background: var(--text-primary);
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  transition: opacity 0.1s;
}
.btn-primary:hover {
  opacity: 0.85;
}
```

**Secondary (default)**
```css
.btn-secondary {
  background: transparent;
  color: var(--text-secondary);
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
}
.btn-secondary:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}
```

**Ghost (icon buttons)**
```css
.btn-ghost {
  background: transparent;
  padding: 4px;
  border-radius: 4px;
  color: var(--text-tertiary);
}
.btn-ghost:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}
```

### Inputs

```css
.input {
  background: var(--bg-primary);
  border: 1px solid var(--border-default);
  border-radius: 4px;
  padding: 8px 10px;
  font-size: 14px;
  color: var(--text-primary);
  transition: border-color 0.15s, box-shadow 0.15s;
}
.input:hover {
  border-color: var(--border-strong);
}
.input:focus {
  outline: none;
  border-color: var(--accent-blue);
  box-shadow: 0 0 0 2px rgba(35, 131, 226, 0.25);
}
.input::placeholder {
  color: var(--text-placeholder);
}
```

### Cards / Containers

```css
.card {
  background: var(--bg-primary);
  border: 1px solid var(--border-default);
  border-radius: 8px;
  padding: 16px;
}
/* No shadows by default — Notion is flat */
```

### Menus / Dropdowns

```css
.menu {
  background: var(--bg-primary);
  border-radius: 8px;
  box-shadow: 
    0 0 0 1px rgba(15, 15, 15, 0.05),
    0 3px 6px rgba(15, 15, 15, 0.1),
    0 9px 24px rgba(15, 15, 15, 0.2);
  padding: 4px;
  min-width: 180px;
}

.menu-item {
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.menu-item:hover {
  background: var(--bg-hover);
}
.menu-item-icon {
  width: 16px;
  height: 16px;
  color: var(--text-secondary);
}
```

---

## Interactions

### Hover Behavior
- **Reveal on hover**: Show action buttons, options, handles only when hovering parent
- **Subtle highlight**: Use `--bg-hover` (8% opacity), never solid colors
- **Cursor changes**: `pointer` for clickable, `grab` for draggable

### Transitions
```css
/* Default transition for most interactions */
transition: all 0.15s ease;

/* Faster for micro-interactions */
transition: opacity 0.1s ease;

/* Slower for layout changes */
transition: transform 0.2s ease, opacity 0.2s ease;
```

### Focus States
- Always visible for accessibility
- Use `box-shadow` ring, not `outline`
- Blue accent: `0 0 0 2px rgba(35, 131, 226, 0.4)`

### Loading States
- Skeleton loaders with subtle pulse animation
- Never block the entire UI
- Show progress for operations > 1s

```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.skeleton {
  background: var(--bg-tertiary);
  border-radius: 4px;
  animation: pulse 1.5s ease-in-out infinite;
}
```

---

## Icons

### Style
- Use outline/stroke icons (not filled)
- Stroke width: 1.5px - 2px
- Size: 16px (default), 20px (prominent), 14px (inline)

### Recommended Library
`lucide-react` — already in use, matches Notion's style well

### Usage
```tsx
import { Plus, MoreHorizontal, ChevronRight } from 'lucide-react';

// Default
<Plus size={16} strokeWidth={2} />

// Muted
<MoreHorizontal size={16} className="text-[--text-tertiary]" />
```

---

## Patterns

### Empty States
- Centered, minimal illustration (optional)
- Short headline + action button
- Muted colors, don't draw too much attention

### Modals
- Centered, max-width `480px`
- Subtle backdrop: `rgba(15, 15, 15, 0.6)`
- No heavy borders, use shadow for elevation
- Close on backdrop click + Escape key

### Tooltips
- Small, dark background (`#37352f`)
- White text, 12px font
- 4px border-radius
- Appear after 300ms delay
- Position: prefer top, fallback to bottom

### Context Menus
- Appear at cursor position
- Same styling as dropdowns
- Group related items with dividers
- Keyboard navigation support

---

## Animation Principles

1. **Fast** — Most animations under 200ms
2. **Purposeful** — Only animate to provide feedback or guide attention
3. **Subtle** — Small movements (2-4px), low opacity changes
4. **Interruptible** — User actions should cancel animations

### Common Animations
```css
/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide up (for modals, menus) */
@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(4px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scale in (for popovers) */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

---

## Do's and Don'ts

### Do
- ✓ Use whitespace generously
- ✓ Keep UI elements small and unobtrusive
- ✓ Reveal complexity progressively
- ✓ Maintain consistent spacing
- ✓ Use icons to save space, with tooltips for clarity

### Don't
- ✗ Use bright colors for decoration
- ✗ Add shadows to everything
- ✗ Make buttons too large or prominent
- ✗ Use animations longer than 300ms
- ✗ Show all options at once — progressive disclosure

---

## Tailwind Utilities

Quick reference for common patterns:

```tsx
// Hover reveal
<div className="group">
  <button className="opacity-0 group-hover:opacity-100 transition-opacity">
    <MoreHorizontal size={16} />
  </button>
</div>

// Subtle hover background
<div className="hover:bg-black/5 rounded transition-colors">

// Menu item
<button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-black/5 text-sm">

// Input
<input className="border border-black/10 rounded px-3 py-2 text-sm 
                  focus:outline-none focus:ring-2 focus:ring-blue-500/25 
                  focus:border-blue-500 transition-shadow" />

// Card
<div className="bg-white border border-black/10 rounded-lg p-4">
```

---

## Reference

- [Notion's Design](https://notion.so) — Primary inspiration
- [Radix UI](https://radix-ui.com) — Accessible primitives
- [Lucide Icons](https://lucide.dev) — Icon library
