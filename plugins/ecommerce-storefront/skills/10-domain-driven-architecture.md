# Domain-Driven Architecture (DDD)

To establish a clean, enterprise-grade architecture foundation (similar to MedusaJS core design), all business logic must be structured using strict Domain-Driven Design (DDD) principles.

## Strict Business Domains
The system is divided into fully isolated business domains:
1. **Catalog**: Manages products, categories, and inventory.
2. **Cart**: Manages cart state, pricing logic, and persistence.
3. **Checkout**: Handles orders, fulfillment, and payment flow simulation.
4. **Users**: Manages authentication, user profiles, and sessions.
5. **Promotions**: Handles discounts and pricing rules.

## Core DDD Rules
- **Full Isolation**: Each domain must be completely self-contained. 
- **No Direct Internal Access**: No domain can directly access another domain's internal state or private methods. Domains must communicate via explicit public interfaces or events.
- **Independent of UI**: All domain logic must be strictly separated from interface concerns. The domain layer should be reusable across different frontends (API, CLI, Storefront).
- **No UI Business Logic**: The UI (React components, Pages, etc.) must NEVER contain business logic. The UI strictly consumes domain services to fetch data or trigger actions.

When generating code, ensure that the boundaries between these domains are strictly maintained.
