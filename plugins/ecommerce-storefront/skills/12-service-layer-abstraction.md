# Service Layer Abstraction

To simulate a real backend API architecture inside this frontend system, the project introduces a strict **Service Layer** pattern to manage data interaction and logic orchestration.

## Defined Services
All backend simulation must be encapsulated strictly into domain-specific services:
- **`ProductService`**: Handles fetching catalog, filtering, and single product retrieval.
- **`CartService`**: Manages cart logic, persistence, computing totals, and validating item status.
- **`CheckoutService`**: Processes address validation, shipping logic, payment simulation, and order confirmation.
- **`UserService`**: Simulates authentication, authorization, token tracking, and profile modification.

## Abstraction Rules
- **No Direct Data Exposure**: The UI components (React/Zustand) must **NEVER** import or interact directly with local JSON files or raw storage objects.
- **Service as Gateway**: All data requests and writes must be handled through their corresponding Service class or function. Services are the authoritative gateway.
- **Backend Simulation Workflow**: A Service must simulate realistic API logic:
  - Validating inputs before executing.
  - Using mocked latency/Promises.
  - Ensuring clean, deterministic domain state transitions limit edge case bugs.
- **Raw Storage Layer**: JSON files function exclusively as the raw database layer. They contain exactly **zero business logic**. The logic resides within the service bridging the file and the frontend.

## Objective
Following this ensures that if MedusaJS, Shopify, or a custom Node/Go backend is later introduced, the exact same Service abstraction boundaries exist and UI code does not need refactoring.
