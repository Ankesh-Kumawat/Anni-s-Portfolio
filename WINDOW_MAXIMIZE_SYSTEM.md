# Window Maximize System Documentation

## Overview
Portfolio OS mein ek dynamic window maximize system hai jo apps ko maximize/minimize karne ki functionality provide karta hai. Ye system responsive layouts ke liye bahut useful hai.

## Core Hook: `useWindowState`

### Location
`client/src/hooks/useWindowState.ts`

### Purpose
Ye hook current window ki maximize state ko track karta hai aur apps ko responsive layouts banane mein help karta hai.

### Usage
```typescript
import { useWindowState } from "@/hooks/useWindowState";

function MyApp() {
    const { isMaximized } = useWindowState();
    
    // Use isMaximized to adjust layout
    return (
        <div className={isMaximized ? 'large-layout' : 'normal-layout'}>
            {/* Content */}
        </div>
    );
}
```

## Window Component Implementation

### Location
`client/src/components/os/Window.tsx`

### Key Features

1. **State Management**
   - `isMaximized`: Boolean state tracking maximize status
   - Automatically maximizes on mobile devices
   - Stores previous size/position for restore

2. **Toggle Function**
   ```typescript
   const toggleMaximize = () => {
       if (isMobile) return; // No toggle on mobile
       
       if (isMaximized) {
           // Restore previous size and position
           setSize(prevSize);
           setPosition(prevPosition);
       } else {
           // Save current state before maximizing
           setPrevSize(size);
           setPrevPosition(position);
       }
       setIsMaximized(!isMaximized);
   };
   ```

3. **Maximize Button**
   - Shows Minimize2 icon when maximized
   - Shows Maximize2 icon when normal
   - Hidden on mobile devices

## Responsive Layout Patterns

### Pattern 1: Masonry Grid Columns (Projects, Gallery)

**Use Case:** Adjust number of columns based on maximize state

```typescript
const { isMaximized } = useWindowState();

<div className={`columns-2 ${isMaximized ? 'sm:columns-3 lg:columns-4' : 'sm:columns-3'} gap-4`}>
    {/* Cards */}
</div>
```

**Behavior:**
- **Normal Window:** 2 columns (mobile) → 3 columns (desktop)
- **Maximized Window:** 2 columns (mobile) → 3 columns (sm) → 4 columns (lg)
- More horizontal space = more columns

### Pattern 2: Side-by-Side Layout (Contact App)

**Use Case:** Show sidebar and content side-by-side when maximized

```typescript
const { isMaximized } = useWindowState();

{isMaximized ? (
    // Desktop: Side-by-side layout
    <div className="flex h-full">
        <ContactSidebar isLargeScreen={true} />
        <ContactForm />
    </div>
) : (
    // Mobile/Normal: Stacked layout
    <div className="flex flex-col h-full">
        <ContactSidebar />
        <ContactForm />
    </div>
)}
```

**Behavior:**
- **Normal Window:** Vertical stack (sidebar on top)
- **Maximized Window:** Horizontal split (sidebar on left)

### Pattern 3: Conditional Content Display

**Use Case:** Show/hide elements based on available space

```typescript
const { isMaximized } = useWindowState();

<div>
    {/* Always visible */}
    <MainContent />
    
    {/* Only show when maximized */}
    {isMaximized && <ExtraDetails />}
</div>
```

## Apps Using Window Maximize System

### 1. **Projects App**
- **File:** `client/src/components/apps/projects/index.tsx`
- **Usage:** Masonry grid columns
- **Normal:** 3 columns max
- **Maximized:** 4 columns max

### 2. **Gallery App**
- **File:** `client/src/components/apps/gallery/index.tsx`
- **Usage:** Masonry grid columns (2 places)
- **Normal:** 3 columns max
- **Maximized:** 4 columns max

### 3. **Contact App**
- **File:** `client/src/components/apps/contact/index.tsx`
- **Usage:** Layout switching
- **Normal:** Vertical stack
- **Maximized:** Horizontal split with sidebar

## Mobile Behavior

### Auto-Maximize
```typescript
useEffect(() => {
    if (isMobile) {
        setIsMaximized(true);
    }
}, [isMobile]);
```

- Mobile devices automatically maximize windows
- Maximize button hidden on mobile
- No manual toggle available
- Full-screen experience

## CSS Classes for Maximized State

### Window Styles
```typescript
className={cn(
    "absolute",
    (isMaximized || isMobile) && "!inset-0 !transform-none !w-full !h-full",
    // ... other classes
)}
```

### Key Classes:
- `!inset-0`: Full viewport coverage
- `!w-full !h-full`: 100% width and height
- `!rounded-none`: Remove border radius
- `!border-none`: Remove borders
- `!shadow-none`: Remove shadows

## Best Practices

### 1. **Use for Responsive Layouts**
```typescript
// ✅ Good: Adjust columns based on space
const columns = isMaximized ? 'lg:columns-4' : 'sm:columns-3';

// ❌ Bad: Fixed columns regardless of space
const columns = 'columns-3';
```

### 2. **Combine with Breakpoints**
```typescript
// ✅ Good: Progressive enhancement
className={`columns-2 ${isMaximized ? 'sm:columns-3 lg:columns-4' : 'sm:columns-3'}`}

// ❌ Bad: Only maximize check
className={isMaximized ? 'columns-4' : 'columns-2'}
```

### 3. **Consider Mobile First**
```typescript
// ✅ Good: Mobile-first approach
<div className={`flex ${isMaximized ? 'flex-row' : 'flex-col'}`}>

// ❌ Bad: Desktop-first
<div className={`flex-row ${!isMaximized && 'flex-col'}`}>
```

## Adding to New Apps

### Step 1: Import Hook
```typescript
import { useWindowState } from "@/hooks/useWindowState";
```

### Step 2: Get State
```typescript
const { isMaximized } = useWindowState();
```

### Step 3: Apply Conditional Styling
```typescript
<div className={isMaximized ? 'large-layout' : 'compact-layout'}>
    {/* Content */}
</div>
```

## Common Use Cases

### 1. **Grid Layouts**
More columns when maximized for better space utilization

### 2. **Sidebar Layouts**
Side-by-side when maximized, stacked when normal

### 3. **Detail Panels**
Show extra information when space is available

### 4. **Image Galleries**
More images per row in maximized state

### 5. **Data Tables**
More columns visible when maximized

## Technical Details

### Z-Index Management
```typescript
style={{
    zIndex: isMaximized ? 9999 : zIndex,
}}
```
- Maximized windows get highest z-index
- Ensures they appear above other windows

### Transition Animations
```typescript
className="transition-all duration-300 ease-in-out"
```
- Smooth 300ms transitions
- Applies to size, position, and border changes

### Position Locking
```typescript
position={isMaximized || isMobile ? { x: 0, y: 0 } : position}
disabled={isMaximized || isMobile}
```
- Maximized windows locked at (0, 0)
- Dragging disabled when maximized

## Summary

Window Maximize System ek powerful feature hai jo:
- ✅ Responsive layouts enable karta hai
- ✅ Better space utilization provide karta hai
- ✅ Mobile-friendly behavior ensure karta hai
- ✅ Smooth transitions provide karta hai
- ✅ Easy to implement hai (single hook)

Apps ko maximize state ke according apna layout adjust karna chahiye for best user experience!
