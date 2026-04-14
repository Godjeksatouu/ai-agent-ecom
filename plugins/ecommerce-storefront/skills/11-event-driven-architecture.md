# Event-Driven Architecture (EDA)

To completely decouple UI from business logic, the system utilizes a strict internal Event-Driven Architecture layer. State changes and domain actions are driven entirely by events rather than procedural mutations.

## Core Event System
All significant domain actions must emit centralized and traceable events. Standard events include, but are not limited to:
- `product:created`
- `cart:item_added`
- `cart:item_removed`
- `checkout:initiated`
- `order:completed`

## Rules and Constraints
- **UI Reactivity**: The UI components must react ONLY to events. They must never directly mutate global state or internal domain mechanisms.
- **Event Emission**: All local state changes or domain actions (even simulated backend calls) MUST emit appropriate events.
- **Backend Simulation**: Even when running in offline/JSON mode, simulate backend orchestration and data flow using this event loop. 
- **Centralized Event Bus**: Ensure events are dispatched and consumed via a centralized, traceable publisher-subscriber mechanism (e.g., using Zustand middleware, custom EventEmitter, or similar standard patterns). 

By strictly adhering to these EDA boundaries, the business logic remains fully decoupled and portable.
