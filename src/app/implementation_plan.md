# Monograph Redesign: "The Cinematic Sequence"

The goal of this redesign is to replace the fragmented gallery implementations (ZoomParallax + Gallery3D) with a single, highly cohesive, and aggressively cinematic GSAP-driven sequence. The gallery will no longer feel like a "component" but rather a seamless, evolving chapter of a film.

## Design Philosophy

The current portfolio (Hero, AboutPortrait) relies heavily on massive typography, stark contrast, and dramatic scaling. The new Monograph section will continue this visual language but elevate the interaction. We will abandon continuous, repetitive scroll mechanics (like the spring-based horizontal scroll) in favor of **distinct, choreographed scenes** that occur sequentially as the user scrolls down a single pinned container.

## Proposed Changes

We will delete `ZoomParallax.tsx` and `Gallery3D.tsx` and replace them with a single, monolithic component: `Monograph.tsx`. This component will pin the screen for `800vh` and drive a master GSAP timeline.

### Scene 1: The Iris Reveal (0 - 150vh)
*   **Visual:** The screen is pitch black. A small, bright circular aperture appears in the center, revealing a glimpse of a vibrant photograph (e.g., `5.jpg`).
*   **Action:** As you scroll, the aperture expands rapidly (`clip-path: circle()`), washing the screen in imagery.
*   **Typography:** The word "MONOGRAPH" (in the established massive, outlined font style) scales down and locks into the background, interacting with the image via mix-blend-mode.

### Scene 2: The Editorial Slice (150vh - 300vh)
*   **Visual:** The full-screen image from Scene 1 is suddenly sliced into vertical strips.
*   **Action:** The strips slide away in opposite directions (staggered), revealing a sophisticated, asymmetrical layout of 3 new images behind them.
*   **Motion:** These 3 images parallax vertically at entirely different speeds, creating a strong sense of depth and curated editorial design.

### Scene 3: The Depth Tunnel (300vh - 500vh)
*   **Visual:** The editorial layout clears. The viewer is plunged into a Z-axis tunnel.
*   **Action:** A sequence of 6 images scales rapidly from `0.1` (far away) to `3.0` (past the camera). They overlap and fade dynamically, simulating the sensation of falling forward through a physical archive of photographs.

### Scene 4: The Horizontal Smash (500vh - 700vh)
*   **Visual:** The forward momentum abruptly halts. A massive, oversized film strip (the remaining images) enters from the right edge.
*   **Action:** It scrolls horizontally at high speed, completely overriding the vertical scroll expectation. It comes to a heavy, elastic stop on the final, most striking image.

### Scene 5: The Manifesto Hold (700vh - 800vh)
*   **Visual:** The final image is locked on screen.
*   **Action:** The frantic pacing slows to a crawl. The image undergoes a very slow, extreme zoom. The text *"I create; therefore I am"* fades in with elegant, serif typography (matching the existing aesthetic). The image slowly desaturates to black and white, leaving the text as the focal point before transitioning to the next section.

## Technical Implementation

*   **Technology:** React, Tailwind CSS, GSAP (`ScrollTrigger`, `Timeline`).
*   **Performance:** All animations will target `transform` (scale, translate) and `opacity`, or hardware-accelerated CSS `clip-path`. No layout thrashing. No WebGL context crashes.
*   **Architecture:** A single master `gsap.timeline()` bound to a `ScrollTrigger` that scrubs over an `800vh` container.

> [!IMPORTANT]
> **User Review Required**
> This approach completely replaces the current horizontal-only and 3D-scatter concepts with a multi-stage, highly choreographed sequence. Do you approve of this "multi-scene" cinematic approach, and should I proceed with implementing `Monograph.tsx`?
