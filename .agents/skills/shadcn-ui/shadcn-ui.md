---
name: shadcn-ui
description: Rules, best practices, and instructions for adding and integrating standard shadcn/ui components into the client app (React + Vite + Tailwind CSS). Use when adding form inputs, dialogs, cards, navigation, feedback elements, or basic UI primitives.
---

# shadcn/ui Integration Skill

## 1. Project Context
- **Frontend Path:** `client/` (React 19 + Vite + Tailwind CSS + Radix Nova style)
- **Language / Extension:** JavaScript (`.jsx` components, `tsx: false` in `components.json`)
- **Component Directory:** `client/src/components/ui/`
- **Utility Function:** `client/src/lib/utils.js` (`cn(...)` merging `clsx` & `tailwind-merge`)
- **Icon Library:** `lucide-react`
- **Configuration File:** `client/components.json`

---

## 2. Rules for Adding Components
Whenever a feature requires standard UI primitives (modals, dropdowns, form controls, layout cards, loaders, etc.), **DO NOT** hand-roll custom implementations from scratch. Always use shadcn/ui:

1. **Install Component via CLI:**
   Always run the command inside the `client/` directory:
   ```bash
   npx shadcn@latest add <component-name>
   ```
   *(e.g. `npx shadcn@latest add dialog dropdown-menu card tabs input badge`)*

2. **Common Components for Course Platform (EngVantage AI):**
   - **Dialog / Sheet / Drawer:** `dialog`, `sheet` (test submission popups, vocabulary flashcards, mobile sidebars).
   - **Form Controls:** `input`, `textarea`, `select`, `checkbox`, `radio-group`, `switch`, `slider`, `label`.
   - **Feedback & Progress:**
     - `progress` (course completion % và IELTS/TOEIC progress trackers).
     - `skeleton` (loading placeholders cho lessons, tests, user profiles).
     - `badge` (CEFR levels A1-C2, difficulty tags, status).
     - `sonner` / `toast` (action notifications, quiz feedback).
     - `alert` (warning banners, system notices).
   - **Navigation & Organisation:**
     - `tabs` (switch giữa Vocabulary, Grammar, Listening, Reading).
     - `accordion` (course curriculum breakdown, FAQs).
     - `dropdown-menu` (user profile menu, question filter options).
   - **Layout & Presentation:**
     - `card` (course cards, test summary cards, stats widgets).
     - `avatar` (learner profile image và teacher avatars).
     - `tooltip` (helpful vocabulary definitions và grammar hints on hover).
     - `scroll-area` (lesson transcripts và long reading passages).
     - `separator` (content dividers).

---

## 3. Implementation Standards & Best Practices
- **Import Paths:** Always import from the alias:
  ```jsx
  import { Button } from "@/components/ui/button";
  import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
  import { cn } from "@/lib/utils";
  ```
- **Customization with `cn(...)`:**
  Pass custom Tailwind classes through `className` using `cn(...)` rather than modifying the base component files unless global changes are required.
- **Accessibility (A11y):**
  Ensure Radix UI accessible labels (`aria-label`, `DialogTitle`, `DialogDescription`) are properly supplied to avoid console warnings.
- **Icons:** Use `lucide-react` icons matching the project convention.
