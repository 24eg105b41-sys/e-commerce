# ShopSphere Campus — Project Plan & Execution Roadmap
**AI-Powered E-Commerce Platform for Students**  
*Captsone Project: AU-R24 Full Stack Development Using Java*  
*Tagline: Smart Shopping for Smarter Students*

---

## 1. Syllabus & Academic Alignment (AU-R24)

This project strictly adheres to the **AU-R24 Full Stack Development Using Java** curriculum for B.Tech Computer Science & Engineering. The matrix below maps each syllabus unit to our application implementation:

| Syllabus Unit / Concept | Project Implementation Component |
| :--- | :--- |
| **Unit 1: Modern Frontend Development** | React 18, Vite, JSX, Component hierarchies, State & Props, Tailwind CSS |
| **Unit 2: React State & Routing** | React Router v6, React Context API (`AuthContext`, `CartContext`), Axios interceptors |
| **Unit 3: Java & Spring Boot Fundamentals**| Java 21, Spring Boot 3.3.x, Dependency Injection (Constructor-based), Maven build |
| **Unit 4: RESTful Web Services & Architecture**| `@RestController`, DTO pattern, Clean Layered Architecture (Controller -> Service -> Repository) |
| **Unit 5: Persistence with Spring Data JPA & MySQL**| Entity mappings, `@OneToMany`, `@ManyToOne`, `@JoinColumn`, Derived & JPQL Queries, HikariCP |
| **Unit 6: Application Security & Authorization**| Spring Security 6.x filter chain, BCrypt password hashing, Stateless JWT, RBAC (`CUSTOMER`, `ADMIN`) |
| **Unit 7: Validation & Exception Handling** | Jakarta Bean Validation (`@Valid`, `@NotBlank`, `@Min`), `@RestControllerAdvice`, standard error responses |
| **Unit 8: Advanced Concepts & Performance**| Spring Cache with Caffeine, Actuator metrics, Transactional boundaries (`@Transactional`) |
| **Unit 9: AI Integration & Natural Language** | Backend AI shopping assistant service with catalog grounding, intent extraction & vector/keyword fallback |
| **Unit 10: Testing & DevOps** | JUnit 5, Mockito, Spring Boot Test, Multi-stage Docker, Docker Compose, Swagger OpenAPI 3.0 |

---

## 2. System Architecture

```
                  ┌───────────────────────────────────────────────┐
                  │          React 18 + Vite Frontend             │
                  │  (Tailwind CSS, React Router, Lucide Icons)   │
                  └───────────────────────┬───────────────────────┘
                                          │ HTTP / REST (Axios + JWT)
                                          ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          Spring Boot 3.3.x Backend                              │
│                                                                                 │
│   ┌─────────────────────┐       ┌───────────────────────────────────────────┐   │
│   │   Spring Security   │       │               Controllers                 │   │
│   │  (JWT Filter, RBAC) │ ────► │ (Auth, Product, Cart, Order, Admin, AI)   │   │
│   └─────────────────────┘       └─────────────────────┬─────────────────────┘   │
│                                                       │ DTOs                    │
│                                 ┌─────────────────────▼─────────────────────┐   │
│                                 │                 Services                  │   │
│                                 │ (Business Rules, @Transactional, Security)│   │
│                                 └──────┬──────────────────────┬─────────────┘   │
│                                        │                      │                 │
│                 ┌──────────────────────▼──────┐        ┌──────▼──────────────┐  │
│                 │      Caffeine Cache         │        │   AI Assistant &    │  │
│                 │   (Categories, Products)    │        │  Catalog Grounding  │  │
│                 └─────────────────────────────┘        └─────────────────────┘  │
│                                        │                                        │
│                                 ┌──────▼────────────────────────────────────┐   │
│                                 │          Spring Data JPA Repositories     │   │
│                                 └─────────────────────┬─────────────────────┘   │
└───────────────────────────────────────────────────────┼─────────────────────────┘
                                                        │ JDBC / SQL
                                                        ▼
                                          ┌───────────────────────────┐
                                          │     MySQL 8.x Database    │
                                          │  (Users, Products, Orders)│
                                          └───────────────────────────┘
```

---

## 3. Implementation Phases & Quality Checklist

### Phase 0: Workspace Inspection & Roadmap [COMPLETED]
- [x] Inspect host environment (Java 26 runtime with Java 21 support, Maven 3.9, Node 20, NPM 10, Git).
- [x] Create project workspace at `shopsphere-campus`.
- [x] Document syllabus alignment and architecture in `PROJECT_PLAN.md`.

### Phase 1: Project Foundation & Build Setups
- [ ] Initialize Spring Boot 3.x Maven project with clean directory structure.
- [ ] Initialize React + Vite frontend with Tailwind CSS and Lucide icons.
- [ ] Configure `application.yml` with dual-mode profiles (MySQL default + H2 test).
- [ ] Configure CORS, Actuator `/actuator/health`, and OpenAPI 3.0.
- [ ] Verify frontend build and backend startup.

### Phase 2: Database Schema & Authentication
- [ ] Implement entities: `User`, `Role` (`ROLE_CUSTOMER`, `ROLE_ADMIN`).
- [ ] Implement `UserRepository`, DTOs (`RegisterRequest`, `LoginRequest`, `AuthResponse`, `UserDto`).
- [ ] Implement `JwtTokenProvider`, `JwtAuthenticationFilter`, `SecurityConfig` with BCrypt.
- [ ] Implement `AuthService` and `AuthController` (`/api/auth/register`, `/api/auth/login`, `/api/auth/me`).
- [ ] Setup frontend `AuthContext`, `axiosClient` interceptors, and `ProtectedRoute` / `AdminRoute`.
- [ ] Add administrator bootstrap with secure development defaults.

### Phase 3: Product Catalog & Category Management
- [ ] Implement entities: `Category`, `Product` with BigDecimal pricing, SKU, stock quantity, index annotations.
- [ ] Implement repositories with derived search queries, pagination, and sorting.
- [ ] Implement `ProductService`, `CategoryService`, `ProductController`, and admin CRUD endpoints.
- [ ] Seed database with at least 20 realistic student-oriented campus products across 7 categories.
- [ ] Build Frontend catalog pages: Home, Product Grid, Filters (category, price, brand), Sorting, Pagination, Details.

### Phase 4: Persistent Shopping Cart & Wishlist
- [ ] Implement `CartItem` and `Wishlist` entities scoped strictly to the authenticated user ID.
- [ ] Implement server-side price recalculation (never trust frontend totals).
- [ ] Implement add, update quantity, remove, and clear cart endpoints.
- [ ] Implement wishlist endpoints (add, remove, move to cart).
- [ ] Build responsive frontend Cart and Wishlist drawer/pages.

### Phase 5: Address Management, Checkout & Orders
- [ ] Implement `Address`, `Order`, `OrderItem` entities with immutable historical price/product snapshots.
- [ ] Implement `@Transactional` checkout service with pessimistic/optimistic inventory verification.
- [ ] Implement simulated payment processing (clearly labeled educational demo; no card collection).
- [ ] Implement order state machine: `PLACED` -> `CONFIRMED` -> `SHIPPED` -> `DELIVERED` or `CANCELLED`.
- [ ] Customer cancellation constraints and ownership verification.
- [ ] Build Checkout, Order Confirmation, and My Orders views in frontend.

### Phase 6: Administrator Operations & Dashboard
- [ ] Implement admin statistics repository queries (total revenue from eligible orders, order counts, low stock items).
- [ ] Implement `AdminDashboardController` returning DTOs for charts and summary counters.
- [ ] Build Admin Dashboard UI with Recharts: Revenue over time, Order status donut, Top products, Low-stock alert table.
- [ ] Build Admin Product Management (create, edit, soft-deactivate) and Order Management (status updates).

### Phase 7: Product Reviews & Comparison
- [ ] Implement `Review` entity with 1–5 star ratings, verified purchase validation, and duplicate prevention.
- [ ] Implement Product Comparison endpoint & frontend modal/page for side-by-side spec comparison.
- [ ] Display reviews and rating breakdowns on Product Detail page.

### Phase 8: Grounded AI Shopping Assistant
- [ ] Implement `AiShoppingService` on the Spring Boot backend with configurable LLM provider.
- [ ] Build dynamic prompt construction with verified catalog context injection (zero hallucinations).
- [ ] Enforce strict post-generation verification: only IDs/SKUs actually in the database are returned.
- [ ] Implement intelligent local keyword/attribute fallback when no LLM API key is configured.
- [ ] Build floating AI assistant drawer & interactive chat page with quick prompt suggestions.

### Phase 9: Policy & FAQ Knowledge Base (RAG Extension)
- [ ] Implement campus store policy documents (shipping, student discounts, returns, warranties, textbook buybacks).
- [ ] Implement backend document chunking and lexical/vector relevance scoring.
- [ ] Include source document citations in the assistant's policy responses.

### Phase 10: Performance, Caching & Health Monitoring
- [ ] Configure Caffeine Cache for active categories and frequently read catalog items.
- [ ] Cache eviction on product or category mutation (`@CacheEvict`).
- [ ] Structured SLF4J logging (excluding passwords and tokens).
- [ ] Expose Spring Actuator endpoints for system health and cache metrics.

### Phase 11: Comprehensive Automated Testing
- [ ] Unit tests for authentication, password hashing, and user registration.
- [ ] Unit tests for cart pricing, stock deduction, and transactional order creation.
- [ ] Integration tests using MockMvc for auth filters and role restrictions.
- [ ] Frontend production build validation (`npm run build`).

### Phase 12: Dockerization & Deployment Configuration
- [ ] Multi-stage Dockerfile for Spring Boot (Eclipse Temurin 21 JRE).
- [ ] Multi-stage Dockerfile for Frontend (Node build + Nginx alpine).
- [ ] `docker-compose.yml` orchestrating MySQL 8, Backend, and Frontend with volume persistence.
- [ ] `.env.example` with documented environment variables.

### Phase 13: UI/UX Refinement & Human Student Code Aesthetic
- [ ] Responsive design verification on desktop, tablet, and mobile.
- [ ] Student-friendly, clean human-crafted code style with thoughtful explanatory comments.
- [ ] Rich empty states, loading skeletons, accessible labels, toast notifications.

### Phase 14: Capstone Documentation & Viva Prep
- [ ] Write comprehensive `README.md` with installation steps, ER diagram, and architecture diagrams.
- [ ] Write `API_DOCUMENTATION.md` detailing all REST endpoints.
- [ ] Write `TESTING_GUIDE.md` detailing test cases and execution commands.
- [ ] Write `DEPLOYMENT_GUIDE.md` for local and cloud hosting (e.g., Render, Railway, AWS).
- [ ] Add Student Capstone Viva Preparation Q&A section for external examiner defense.
