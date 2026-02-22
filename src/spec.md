# Specification

## Summary
**Goal:** Remove all cart functionality from the application.

**Planned changes:**
- Remove CartContext provider and all cart state management logic
- Delete Cart component that displays cart items and checkout button
- Delete CartButton component from header
- Remove all "Add to Cart" buttons from ProductCard components
- Remove cart dependencies from Checkout and PaymentSuccess pages
- Delete Payment component that creates Stripe sessions from cart items

**User-visible outcome:** Users will no longer see cart buttons, cart UI, or "Add to Cart" options. Products can only be viewed and accessed via external platform links.
