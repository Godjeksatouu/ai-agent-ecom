# Strict Design System & Component Standards

All generated UI must adhere rigorously to the following design system and component standards to ensure a clean, consistent, and scalable application.

## Design Rules
- **TailwindCSS Only**: Use TailwindCSS exclusively for styling. Do not use plain CSS or other styling libraries unless explicitly requested.
- **Color Palette**: Utilize neutral, premium color schemes (e.g., white, beige, soft gray). Avoid harsh or generic colors.
- **Soft UI Aesthetics**: Apply generous border radius for a soft, modern feel (e.g., `rounded-xl`, `rounded-2xl`).
- **Responsive Layouts**:
  - Desktop: Use a 4-column grid for product and feature listings.
  - Mobile: Gracefully degrade to a 1-column layout.
- **Spacing**: Maintain consistent vertical and horizontal rhythm and visual hierarchy.

## Component Rules
- **No Empty Templates**: Never generate UI without functionality or data.
- **Data Integration**: Use realistic or actual data sourced from local JSON files. Do not use generic Lore Ipsum.
- **Valid Assets**: Images must have a valid `src` and follow standard patterns (such as Unsplash URLs or valid local assets). No empty image placeholders.
- **Functional States**: Provide robust interactive elements (hover states, focus states, active variants).
- **Architecture**: Ensure components are modular, reusable, and production-ready.
