# Admin Panel Layout - Visual Guide

## Desktop Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                         TOP HEADER (Sticky)                      │
│  RideEasy Admin | Dashboard     [Refresh] [Site] [Logout]        │
├──────────────────┬─────────────────────────────────────────────┤
│                  │                                              │
│  DARK NAVY       │         MAIN CONTENT AREA                   │
│  SIDEBAR         │         (Scrollable)                        │
│  (Fixed)         │                                              │
│                  │  ┌─ Welcome Message Card ────────────────┐  │
│  📊 Overview     │  │                                       │  │
│  👥 Users        │  │  Welcome, Super Admin               │  │
│  🚗 Drivers      │  │  You are signed in with...           │  │
│  📍 Rides        │  └───────────────────────────────────────┘  │
│  💰 Payments     │                                              │
│  🏷️  Pricing      │  ┌─ Key Metrics Grid (Responsive) ───────┐  │
│                  │  │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │  │
│                  │  │ │Stat 1│ │Stat 2│ │Stat 3│ │Stat 4│ │  │
│                  │  │ └──────┘ └──────┘ └──────┘ └──────┘ │  │
│                  │  └───────────────────────────────────────┘  │
│                  │                                              │
│                  │  ┌─ Data Table Card ────────────────────┐  │
│                  │  │ Search... [Refresh] [Delete]          │  │
│                  │  ├─────────────────────────────────────┤  │
│                  │  │ Name │ Email │ City │ Status│Action │  │
│                  │  ├─────────────────────────────────────┤  │
│                  │  │ John │  ...  │  ...  │  ✅   │ ...  │  │
│                  │  └───────────────────────────────────────┘  │
│                  │                                              │
└──────────────────┴─────────────────────────────────────────────┘

Size Specifications:
- Sidebar Width: 256px (w-64)
- Header Height: 56px (py-4)
- Content Padding: 24px-32px
- Max Content Width: 80rem (max-w-7xl)
```

## Tablet/Mobile Layout

```
Mobile (< 640px):

┌──────────────────────────────┐
│ ☰ 🏢 RideEasy Admin | Dash    │  ← Header (Sticky)
│    [Refresh] [Logout]        │
├──────────────────────────────┤
│                              │
│  Welcome Message Card        │
│                              │
│  ┌────────────────────────┐  │
│  │ Metric 1: 150          │  │
│  └────────────────────────┘  │
│  ┌────────────────────────┐  │
│  │ Metric 2: 42           │  │
│  └────────────────────────┘  │
│  ┌────────────────────────┐  │
│  │ Metric 3: 280          │  │
│  └────────────────────────┘  │
│                              │
│  Search Card                 │
│  [Search input             ] │
│                              │
│  Data Table (Horizontal     │
│  scroll if needed)           │
│  ┌──────────────────────────┐│
│  │ Name │ Email  │ Status  ││
│  ├──────────────────────────┤│
│  │ John │ ...    │  ✅     ││
│  └──────────────────────────┘│
│                              │
└──────────────────────────────┘

Mobile with Sidebar Open:

┌─────────────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  ← Dark Overlay
│ ░ ┌──────────────────────────┐ ░│
│ ░ │ ☒ Dark Navy Sidebar      │ ░│
│ ░ │                          │ ░│
│ ░ │ 📊 Overview              │ ░│
│ ░ │ 👥 Users                 │ ░│
│ ░ │ 🚗 Drivers               │ ░│
│ ░ │ 📍 Rides                 │ ░│
│ ░ │ 💰 Payments              │ ░│
│ ░ │ 🏷️  Pricing               │ ░│
│ ░ │                          │ ░│
│ ░ └──────────────────────────┘ ░│
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
└─────────────────────────────────┘
```

## Color Palette

```
Dark Navy (Sidebar):        #001a4d
Sidebar Hover:              #0d3a7a
Sidebar Active:             #0066cc (Blue-600)
Sidebar Text:               #FFFFFF / #E0E7FF

Background:                 #f3f4f6 (Neutral-50)
Card Background:            #FFFFFF
Card Border:                #e5e7eb (Neutral-200)

Text Primary:               #111827 (Neutral-900)
Text Secondary:             #6b7280 (Neutral-600)

Success:                    #10b981 (Green)
Warning:                    #f59e0b (Yellow)
Error:                      #ef4444 (Red)
Info:                       #3b82f6 (Blue)
```

## Component Hierarchy

```
<AdminLayout>
  ├── <AdminSidebar>
  │   ├── Logo Section
  │   ├── Navigation Menu
  │   │   ├── Overview
  │   │   ├── Users
  │   │   ├── Drivers
  │   │   ├── Rides
  │   │   ├── Payments
  │   │   └── Pricing
  │   ├── Footer Section
  │   └── Mobile Toggle Button (hidden on desktop)
  │
  └── <MainContent>
      ├── <AdminHeader>
      │   ├── Branding
      │   └── Actions (Refresh, Site, Logout)
      │
      └── <ContentArea>
          ├── <Card> Welcome Message
          │
          ├── <StatCard Grid>
          │   ├── Users Count
          │   ├── Drivers Count
          │   ├── Online Drivers
          │   ├── Total Rides
          │   ├── Revenue
          │   └── Platform Income
          │
          ├── <Card> Search Bar
          │   └── Status Filter (if applicable)
          │
          └── <Card> Data Table
              └── Interactive Table with Actions
```

## Responsive Grid Breakpoints

```
Desktop (≥ 1024px):
- 6 columns for stats grid
- Full-width tables
- Sidebar always visible
- Normal font sizes

Tablet (640px - 1024px):
- 3 columns for stats grid
- Scrollable tables if needed
- Sidebar with toggle
- Slightly smaller fonts

Mobile (< 640px):
- 1 column (full-width cards)
- Horizontal scroll tables
- Drawer sidebar
- Smaller fonts and spacing
```

## Card Types & Usage

### 1. Welcome Card
```
┌─────────────────────────────────┐
│ Welcome, Super Admin            │
│ You are signed in with an       │
│ admin JWT. This console covers  │
│ users, drivers, rides, payments,│
│ and pricing.                    │
└─────────────────────────────────┘
```

### 2. Stat Card
```
┌──────────────────┐
│ 👥 Total Users   │
│                  │
│ 2,847            │
│ Customers        │
│                  │
│ ↑ +15% this week │
└──────────────────┘
```

### 3. Alert Card (Info)
```
┌─────────────────────────────────┐
│ ℹ️  Driver Management            │
│                                 │
│ Approve new drivers or revoke    │
│ approval. Use Block for abuse.   │
└─────────────────────────────────┘
```

### 4. Table Card
```
┌─────────────────────────────────────┐
│ 🔍 [Search input........] [Actions] │
├─────────────────────────────────────┤
│ Name │ Email  │ City  │ Status│Act. │
├─────────────────────────────────────┤
│ John │ a@...  │ NYC   │  ✅  │ Edit │
│ Jane │ b@...  │ LA    │  ✅  │ Edit │
│ Bob  │ c@...  │ CHI   │  🚫  │ Edit │
└─────────────────────────────────────┘
```

## Typography Hierarchy

```
Page Title (H1)
Font: 28-32px, Bold, Tracking -0.5px
├─ Section Title (H2)
│  Font: 20-24px, Bold, Tracking -0.5px
├─ Card Title (H3)
│  Font: 16-18px, Semibold, Tracking -0.5px
├─ Body Text
│  Font: 14-16px, Regular, Line height 1.5
├─ Label Text
│  Font: 12-14px, Medium, Text color secondary
└─ Small Text
   Font: 12px, Regular, Text color secondary
```

## Interactive States

### Button States
```
Default:     [Button] (white bg, neutral border)
Hover:       [Button] (light gray bg)
Active:      [Button] (blue bg, white text)
Disabled:    [Button] (gray bg, reduced opacity)
Focus:       [Button] (blue outline, 2px)
```

### Table Row States
```
Default:     [Row data] (white bg)
Hover:       [Row data] (light gray bg)
Selected:    [Row data] (checked box, highlighted)
Focus:       [Row data] (blue outline on element)
```

### Input States
```
Default:     [Input field] (white bg, gray border)
Focus:       [Input field] (blue border, blue ring)
Filled:      [Input field] (dark text, blue border)
Error:       [Input field] (red border, red ring)
Disabled:    [Input field] (gray bg, reduced opacity)
```

## Spacing Scale

```
XS:  4px  (0.25rem)
SM:  8px  (0.5rem)
MD:  12px (0.75rem)
LG:  16px (1rem)
XL:  24px (1.5rem)
2XL: 32px (2rem)
3XL: 48px (3rem)

Common Usage:
- Card padding: 24px
- Section gaps: 24-32px
- Grid gaps: 16px
- Button padding: 8-12px
```

## Mobile Touch Targets

```
Minimum size: 44px × 44px

Button sizes:
- Small:  36px height
- Medium: 44px height  ← Recommended minimum
- Large:  48px height

Spacing between targets: ≥ 8px

Table cell height: ≥ 44px (with padding)
Checkbox size: 18px (with padding for 44px target)
```

## Animation & Transitions

```
Sidebar toggle:    300ms ease-in-out
Button hover:      200ms ease
Link hover:        150ms ease
Loading spinner:   Linear infinite rotation
Tab switch:        Fade in 200ms
Overlay:          200ms ease opacity
```

## Shadow System

```
No Shadow:    Default (minimal visual weight)
Shadow-SM:    Card shadows, subtle depth
Shadow-MD:    Hover states, increased emphasis
Shadow-LG:    Modals, overlays, high emphasis
```

## Accessibility Features

✅ Keyboard navigation (Tab, Enter, Escape)
✅ Focus visible (2px outline)
✅ Color contrast (WCAG AA)
✅ Semantic HTML (h1, h2, buttons)
✅ ARIA labels on icons
✅ Touch targets ≥ 44px
✅ Screen reader support
✅ Proper heading hierarchy
