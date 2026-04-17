# Brand System

## Positioning

Primary positioning line:

`Design-led website transformation for premium service businesses.`

That line should stay short, premium, and useful for both public marketing and the client portal.

## Asset Ownership

Brand assets live under `apps/web/public/brand`.

Core assets:

- `ash-tra-logo-horizontal.svg`
- `ash-tra-mark.svg`
- `ash-tra-favicon.svg`
- `ash-tra-social-lockup.svg`

Use the horizontal logo in headers, footers, and larger lockups. Use the compact mark in tighter dashboard spaces, favicons, and avatar-like contexts.

## Typography Direction

- Display and major heading voice: editorial, high-contrast, premium.
- UI/body voice: precise, modern, and product-grade.
- Oversized display treatments belong to utility classes, not invalid heading tags.

## Token Categories

The global layer defines:

- color roles
- type scale
- spacing scale
- radius scale
- border and overlay roles
- shadow roles
- motion durations and easings

When adding new UI, extend those roles instead of hardcoding ad hoc values into a single page.

## Badge And Icon Rules

- Use one icon wrapper pattern with consistent padding, border, and stroke width.
- Keep badge copy short and scannable.
- Use status badges for state, not for decoration.
- Use trust/feature badges near proof, offers, or workflow cues where they help the scan path.

## Public Vs Dashboard

The dashboard is not a separate visual language. It should feel like the inside of the same product:

- same brand colors
- same typography
- same badge logic
- same motion language
- same contrast rules
