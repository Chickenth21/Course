---
name: magic-ui-skill
description: Rules and instructions for integrating Magic UI components and animations into the client app
---

# Magic UI Integration Skill

## 1. Project Context
- **Frontend Path:** `client/` (React + Vite + Tailwind CSS + Framer Motion)
- **Component Registry:** Magic UI registry via shadcn CLI.

## 2. Rules for Adding Components
Whenever asked to create advanced visual effects or micro-interactions, DO NOT write complex animation CSS from scratch if Magic UI supports it. Follow this process:

1. **Install Component via CLI:**
   Execute command inside `client/`:
   `npx shadcn@latest add "https://magicui.design/r/<component-name>"`

2. **Common Components for this Course Platform:**
   - **Learning Path / Graph:** `animated-beam` (connect TOEIC & IELTS milestones).
   - **Score / Assessment Display:** `number-ticker` (reveal Band/Points smoothly).
   - **Action Buttons / Active Quiz Options:** `shimmer-button` or `border-beam`.
   - **Review / Feedback Cards:** `marquee` (show student testimonials or vocabulary cards).

3. **Styling Constraints:**
   - Always ensure imported components reside in `client/src/components/magicui/` or `client/src/components/ui/`.
   - Ensure `tailwind.config.js` has required animation keyframes as specified by the component docs.
   - Respect `motion-reduce` for accessibility.