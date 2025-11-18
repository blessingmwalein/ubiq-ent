# Mobile Responsive - Developer Quick Reference

## 🚀 Quick Start

### Using Responsive Hooks

```typescript
import { useResponsive, useTouchDevice } from '@/lib/hooks'

function MyComponent() {
  const { isMobile, isTablet, isDesktop } = useResponsive()
  const isTouch = useTouchDevice()
  
  return (
    <div>
      {isMobile ? <MobileView /> : <DesktopView />}
    </div>
  )
}
```

### Tailwind Responsive Classes

```tsx
// Height responsive
<div className="h-12 sm:h-14 md:h-16" />

// Text responsive  
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl" />

// Padding responsive
<div className="p-4 sm:p-6 md:p-8 lg:p-12" />

// Grid responsive
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" />

// Flex responsive
<div className="flex-col sm:flex-row" />

// Hidden/Show responsive
<div className="hidden sm:block" /> // Hide on mobile
<div className="block sm:hidden" /> // Show only on mobile
```

## 📐 Breakpoint Reference

| Device | Breakpoint | Tailwind | Width |
|--------|------------|----------|-------|
| Mobile | `< 640px` | `default` | Phone portrait |
| Small | `>= 640px` | `sm:` | Phone landscape |
| Tablet | `>= 768px` | `md:` | Tablets |
| Desktop | `>= 1024px` | `lg:` | Laptops |
| Large | `>= 1280px` | `xl:` | Desktops |
| XL | `>= 1536px` | `2xl:` | Large screens |

## 🎯 Common Patterns

### Responsive Buttons

```tsx
// Mobile: Default size, Desktop: Large
<Button 
  size={isMobile ? 'default' : 'lg'}
  className="flex-1 sm:flex-none" // Full width on mobile
>
  {isMobile ? 'Play' : 'Play Now'}
</Button>
```

### Responsive Typography

```tsx
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold">
  Title
</h1>

<p className="text-sm sm:text-base md:text-lg">
  Description
</p>
```

### Responsive Spacing

```tsx
<div className="space-y-4 md:space-y-8"> // Vertical spacing
<div className="gap-2 md:gap-4"> // Flex/Grid gap
<div className="px-4 md:px-8 lg:px-12"> // Horizontal padding
```

### Responsive Images

```tsx
<Image
  src="/image.jpg"
  alt="Alt text"
  className="h-7 sm:h-8 md:h-12 w-auto"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### Conditional Rendering

```tsx
{/* Hide on mobile */}
{!isMobile && <DesktopOnlyComponent />}

{/* Show only on mobile */}
{isMobile && <MobileOnlyComponent />}

{/* Different components per breakpoint */}
{isMobile ? <MobileNav /> : <DesktopNav />}
```

### Responsive Grids

```tsx
{/* Mobile: 2 cols, Tablet: 3 cols, Desktop: 4 cols */}
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

### Responsive Forms

```tsx
<Input
  className="h-12 sm:h-14 text-base" // Larger on mobile
  autoComplete="email"
/>

<Button 
  type="submit"
  className="w-full sm:w-auto" // Full width on mobile
>
  Submit
</Button>
```

## 🎨 Component Patterns

### Hero Section

```tsx
<section className="
  h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[85vh]
  -mt-14 md:-mt-16 lg:-mt-20
">
  <Container className="
    pb-16 md:pb-0
    items-end md:items-center
  ">
    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl">
      Title
    </h1>
  </Container>
</section>
```

### Content Cards

```tsx
<div className="
  flex-[0_0_70%] // Mobile: 70% width
  xs:flex-[0_0_60%] // Small mobile
  sm:flex-[0_0_48%] // Tablet: 48% (2 per row)
  md:flex-[0_0_32%] // Desktop: 32% (3 per row)
  lg:flex-[0_0_24%] // Large: 24% (4 per row)
  xl:flex-[0_0_19%] // XL: 19% (5 per row)
">
  <ContentCard />
</div>
```

### Modal/Sheet

```tsx
{isMobile ? (
  <Sheet>
    <SheetContent side="bottom" className="h-[80vh]">
      <FilterContent />
    </SheetContent>
  </Sheet>
) : (
  <Dialog>
    <DialogContent>
      <FilterContent />
    </DialogContent>
  </Dialog>
)}
```

## 🔧 Custom Hooks Usage

### useResponsive

```typescript
const {
  isMobile,      // < 768px
  isTablet,      // 768px - 1023px
  isDesktop,     // >= 1024px
  isLargeDesktop, // >= 1280px
  isTouchDevice,
  isPortrait,
  isLandscape,
  isSmallScreen, // Same as isMobile
  isMediumScreen, // Same as isTablet
  isLargeScreen, // isDesktop || isLargeDesktop
} = useResponsive()
```

### useScrollDirection

```typescript
const scrollDirection = useScrollDirection() // 'up' | 'down' | null

// Auto-hide header
<header className={cn(
  'fixed top-0',
  scrollDirection === 'down' && '-translate-y-full'
)}>
```

### useViewport

```typescript
const { width, height } = useViewport()

if (width < 768) {
  // Mobile logic
}
```

## 📱 Touch Targets

Always ensure minimum 44x44px for touch targets:

```tsx
// Buttons
<button className="min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0">

// Icon buttons
<button className={isMobile ? 'p-3' : 'p-2'}>
  <Icon className={isMobile ? 'w-6 h-6' : 'w-5 h-5'} />
</button>
```

## 🎭 Safe Area Support

For notched devices (iPhone X+):

```tsx
// Bottom navigation with safe area
<nav className="fixed bottom-0 pb-safe">

// Utilities available:
// .pb-safe - padding-bottom: env(safe-area-inset-bottom)
// .pt-safe - padding-top: env(safe-area-inset-top)
// .pl-safe - padding-left: env(safe-area-inset-left)
// .pr-safe - padding-right: env(safe-area-inset-right)
```

## 🚫 Mobile Optimization

### Disable hover effects on touch

```css
/* In globals.css - already added */
@media (hover: none) {
  .hover\:scale-110:hover {
    transform: none;
  }
}
```

### Use active states instead

```tsx
<button className="
  hover:bg-blue-600
  active:bg-blue-700 // Better for mobile
  active:scale-95 // Tactile feedback
">
```

## ⚡ Performance Tips

1. **Conditional Component Loading**
```tsx
{isMobile ? <MobileLightComponent /> : <DesktopHeavyComponent />}
```

2. **Lazy Loading**
```tsx
const DesktopComponent = lazy(() => import('./DesktopComponent'))
{!isMobile && <Suspense><DesktopComponent /></Suspense>}
```

3. **Responsive Images**
```tsx
<Image
  sizes="(max-width: 768px) 50vw, 33vw"
  priority={index < 3} // Only first 3 images
/>
```

## 🐛 Common Issues & Solutions

### Issue: Content jumping on mobile
```tsx
// Solution: Use min-height with viewport fix
<div className="min-h-screen" style={{ minHeight: '-webkit-fill-available' }}>
```

### Issue: Hover effects on mobile tap
```tsx
// Solution: Use touch detection
const isTouch = useTouchDevice()
<div className={!isTouch ? 'hover:scale-110' : ''}>
```

### Issue: Small touch targets
```tsx
// Solution: Minimum 44px on mobile
<button className={isMobile ? 'min-h-[44px] min-w-[44px]' : ''}>
```

### Issue: Fixed header covering content
```tsx
// Solution: Add scroll detection
const scrollDirection = useScrollDirection()
<header className={scrollDirection === 'down' ? '-translate-y-full' : ''}>
```

## 📦 Component Checklist

When creating new components, ensure:

- [ ] Responsive breakpoints (sm, md, lg, xl)
- [ ] Touch targets (44x44px minimum on mobile)
- [ ] Conditional rendering for mobile/desktop
- [ ] Proper spacing (gap, padding, margin)
- [ ] Typography scales appropriately
- [ ] Images have responsive sizes
- [ ] Forms have larger inputs on mobile
- [ ] Buttons are full-width on mobile when appropriate
- [ ] No hover effects on touch devices
- [ ] Safe area support for notched devices

## 🎉 Quick Tips

1. **Mobile First**: Start with mobile styles, then add larger breakpoints
2. **Test on Real Devices**: Emulators don't always catch touch issues
3. **Use Semantic Breakpoints**: `isMobile` is clearer than `width < 768`
4. **Avoid Hardcoded Sizes**: Use Tailwind's responsive utilities
5. **Touch Feedback**: Always provide active states for buttons
6. **Accessibility**: Larger targets help everyone, not just mobile users

## 📚 Additional Resources

- Tailwind Responsive Design: https://tailwindcss.com/docs/responsive-design
- Touch Target Sizes: https://www.w3.org/WAI/WCAG21/Understanding/target-size.html
- Mobile UX Patterns: https://mobbin.com/
- Testing: Chrome DevTools Device Mode
