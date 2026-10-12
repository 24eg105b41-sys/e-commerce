# 📚 ShopSphere Campus - REST API Documentation

This document details the complete RESTful API contract for **ShopSphere Campus**, implemented using **Spring Boot 3.3.4** and documented interactively via **SpringDoc OpenAPI (Swagger 3)**.

- **Base URL:** `http://localhost:8080/api/v1`
- **Swagger UI Interactive Explorer:** `http://localhost:8080/swagger-ui.html`
- **OpenAPI 3 JSON Spec:** `http://localhost:8080/v3/api-docs`
- **Content Type:** `application/json`
- **Authentication Scheme:** HTTP Authorization Header with Bearer Token (`Authorization: Bearer <jwt_token>`)

---

## 📑 Summary of Endpoints

| Category | Method | Path | Auth / Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Authentication** | `POST` | `/auth/register` | Public | Register a new student account |
| | `POST` | `/auth/login` | Public | Authenticate user & return JWT token |
| | `GET` | `/auth/me` | Authenticated | Retrieve profile of authenticated user |
| **Categories** | `GET` | `/categories` | Public | Fetch all active product categories |
| | `GET` | `/categories/{id}` | Public | Fetch category details by ID |
| **Products** | `GET` | `/products` | Public | Paginated catalog search with filters |
| | `GET` | `/products/{id}` | Public | Fetch full product details by ID |
| | `GET` | `/products/featured` | Public | Fetch top featured campus items |
| | `GET` | `/products/search` | Public | Quick search suggestions |
| | `GET` | `/products/compare` | Public | Side-by-side product comparison |
| **Cart** | `GET` | `/cart` | Customer | Fetch current user's shopping cart |
| | `POST` | `/cart/items` | Customer | Add product to cart with quantity |
| | `PUT` | `/cart/items/{productId}` | Customer | Update item quantity in cart |
| | `DELETE` | `/cart/items/{productId}` | Customer | Remove specific item from cart |
| | `DELETE` | `/cart/clear` | Customer | Remove all items from cart |
| **Wishlist** | `GET` | `/wishlist` | Customer | Fetch current user's saved wishlist |
| | `POST` | `/wishlist/toggle/{productId}` | Customer | Toggle item in/out of wishlist |
| | `DELETE` | `/wishlist/{productId}` | Customer | Explicitly remove item from wishlist |
| **Addresses** | `GET` | `/addresses` | Customer | List saved campus delivery addresses |
| | `POST` | `/addresses` | Customer | Create a new delivery address |
| | `PUT` | `/addresses/{id}` | Customer | Update an existing address |
| | `DELETE` | `/addresses/{id}` | Customer | Delete a delivery address |
| | `PUT` | `/addresses/{id}/default` | Customer | Set address as default delivery |
| **Orders** | `POST` | `/orders/checkout` | Customer | Atomic checkout & order placement |
| | `GET` | `/orders` | Customer | List authenticated student's orders |
| | `GET` | `/orders/{id}` | Customer | Fetch detailed order summary |
| | `PUT` | `/orders/{id}/cancel` | Customer | Cancel order and restock inventory |
| **Reviews** | `GET` | `/reviews/product/{productId}` | Public | Fetch approved reviews for a product |
| | `POST` | `/reviews` | Customer | Submit product rating & review |
| **Admin Operations**| `GET` | `/admin/analytics/dashboard` | `ROLE_ADMIN` | Aggregated revenue and order KPIs |
| | `GET` | `/admin/products` | `ROLE_ADMIN` | List all products including unlisted |
| | `POST` | `/admin/products` | `ROLE_ADMIN` | Create new catalog product |
| | `PUT` | `/admin/products/{id}` | `ROLE_ADMIN` | Update product details and inventory |
| | `DELETE` | `/admin/products/{id}` | `ROLE_ADMIN` | Soft-delete / deactivate product |
| | `GET` | `/admin/orders` | `ROLE_ADMIN` | List all student orders across campus |
| | `PATCH` | `/admin/orders/{id}/status` | `ROLE_ADMIN` | Update order fulfillment status |
| **AI Assistant** | `POST` | `/ai/chat` | Public / Customer | Conversational AI query with grounding |
| | `GET` | `/ai/chat/history/{sessionId}` | Public / Customer | Fetch previous session chat history |
| | `POST` | `/ai/grounded-query` | Public | Structured catalog filtering query |

---

## 🔒 1. Authentication Endpoints

### 1.1 Register New Student
- **Endpoint:** `POST /api/v1/auth/register`
- **Access:** Public
- **Request Body:**
```json
{
  "fullName": "Priya Sharma",
  "email": "priya.sharma@campus.edu",
  "password": "Student@Password2026",
  "phone": "+91 98765 43210"
}
```
- **Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwcml5YS5zaGFybWFAY2FtcHVzLmVkdSIsImlhdCI6MTczOTI4OTIwMCwiZXhwIjoxNzM5Mzc1NjAwfQ...",
  "user": {
    "id": 3,
    "email": "priya.sharma@campus.edu",
    "fullName": "Priya Sharma",
    "phone": "+91 98765 43210",
    "role": "ROLE_CUSTOMER"
  }
}
```

### 1.2 User Login
- **Endpoint:** `POST /api/v1/auth/login`
- **Access:** Public
- **Request Body:**
```json
{
  "email": "student@campus.edu",
  "password": "Student@Campus2026"
}
```
- **Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdHVkZW50QGNhbXB1cy5lZHU...",
  "user": {
    "id": 2,
    "email": "student@campus.edu",
    "fullName": "Demo Student",
    "phone": "+91 9876543210",
    "role": "ROLE_CUSTOMER"
  }
}
```

### 1.3 Get Current User Profile
- **Endpoint:** `GET /api/v1/auth/me`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
```json
{
  "id": 2,
  "email": "student@campus.edu",
  "fullName": "Demo Student",
  "phone": "+91 9876543210",
  "role": "ROLE_CUSTOMER"
}
```

---

## 📦 2. Catalog & Product Endpoints

### 2.1 Filtered & Paginated Products
- **Endpoint:** `GET /api/v1/products`
- **Query Parameters:**
  - `page` (default: 0)
  - `size` (default: 12)
  - `categoryId` (optional, Long)
  - `search` (optional, String)
  - `minPrice` (optional, Double)
  - `maxPrice` (optional, Double)
  - `inStockOnly` (optional, Boolean)
  - `sortBy` (default: "createdAt")
  - `sortDir` (default: "desc")
- **Response (200 OK):**
```json
{
  "content": [
    {
      "id": 1,
      "title": "Casio FX-991CW ClassWiz Scientific Calculator",
      "sku": "ELEC-CALC-001",
      "description": "High-resolution 4-gradation display with spreadsheet and solver functions for engineering mathematics.",
      "price": 1495.00,
      "originalPrice": 1695.00,
      "stockQuantity": 35,
      "condition": "BRAND_NEW",
      "categoryName": "Electronics",
      "categoryId": 2,
      "imageUrl": "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600",
      "rating": 4.8,
      "reviewCount": 42,
      "active": true
    }
  ],
  "pageNumber": 0,
  "pageSize": 12,
  "totalElements": 22,
  "totalPages": 2,
  "last": false
}
```

### 2.2 Get Product By ID
- **Endpoint:** `GET /api/v1/products/{id}`
- **Response (200 OK):** Detailed product entity including condition, full specifications, ratings, and category information.

### 2.3 Product Side-by-Side Comparison
- **Endpoint:** `GET /api/v1/products/compare?ids=1,2`
- **Response (200 OK):** Array of product objects formatted for side-by-side feature and pricing analysis.

---

## 🛒 3. Cart & Wishlist Endpoints

### 3.1 Get User Cart
- **Endpoint:** `GET /api/v1/cart`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
```json
{
  "items": [
    {
      "id": 10,
      "productId": 1,
      "productTitle": "Casio FX-991CW ClassWiz Scientific Calculator",
      "productSku": "ELEC-CALC-001",
      "productImage": "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600",
      "unitPrice": 1495.00,
      "quantity": 1,
      "subtotal": 1495.00,
      "availableStock": 35
    }
  ],
  "subtotal": 1495.00,
  "shippingFee": 0.00,
  "taxAmount": 74.75,
  "totalAmount": 1569.75,
  "itemCount": 1
}
```

### 3.2 Add Item to Cart
- **Endpoint:** `POST /api/v1/cart/items`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
```json
{
  "productId": 1,
  "quantity": 1
}
```
- **Response (200 OK):** Updated cart response object.

---

## 💳 4. Checkout & Order Endpoints

### 4.1 Process Checkout
- **Endpoint:** `POST /api/v1/orders/checkout`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
```json
{
  "addressId": 1,
  "paymentMethod": "UPI",
  "notes": "Please deliver to Hostel Block C, Room 304"
}
```
- **Response (201 Created):**
```json
{
  "id": 1,
  "orderNumber": "ORD-2026-A9C3F1B2",
  "orderStatus": "PLACED",
  "paymentMethod": "UPI",
  "paymentStatus": "PAID",
  "totalAmount": 1569.75,
  "itemCount": 1,
  "shippingAddress": {
    "fullName": "Demo Student",
    "hostelOrBlock": "Hostel Block C, Room 304",
    "campusLocation": "North Campus Residential Zone",
    "city": "Chennai",
    "postalCode": "600025",
    "phone": "+91 9876543210"
  },
  "items": [
    {
      "productId": 1,
      "productTitle": "Casio FX-991CW ClassWiz Scientific Calculator",
      "quantity": 1,
      "unitPrice": 1495.00,
      "subtotal": 1495.00
    }
  ],
  "createdAt": "2026-10-11T19:35:00"
}
```

### 4.2 Cancel Order
- **Endpoint:** `PUT /api/v1/orders/{id}/cancel`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):** Updated order status changed to `CANCELLED`; inventory restocked.

---

## 📊 5. Admin Analytics & Management Endpoints

### 5.1 Analytics KPI Dashboard
- **Endpoint:** `GET /api/v1/admin/analytics/dashboard`
- **Headers:** `Authorization: Bearer <token>` (`ROLE_ADMIN` only)
- **Response (200 OK):**
```json
{
  "totalRevenue": 24850.00,
  "totalOrders": 18,
  "totalCustomers": 24,
  "totalProducts": 22,
  "lowStockCount": 3,
  "recentOrders": [...],
  "revenueByMonth": [
    { "month": "May 2026", "revenue": 4500.00 },
    { "month": "Jun 2026", "revenue": 8200.00 },
    { "month": "Jul 2026", "revenue": 12150.00 }
  ],
  "ordersByStatus": [
    { "status": "DELIVERED", "count": 12 },
    { "status": "SHIPPED", "count": 4 },
    { "status": "PLACED", "count": 2 }
  ]
}
```

### 5.2 Update Order Fulfillment Status
- **Endpoint:** `PATCH /api/v1/admin/orders/{id}/status`
- **Headers:** `Authorization: Bearer <token>` (`ROLE_ADMIN` only)
- **Request Body:**
```json
{
  "status": "DELIVERED"
}
```
- **Response (200 OK):** Updated order summary.

---

## 🤖 6. AI Shopping Assistant Endpoints

### 6.1 Conversational Chat with Catalog Grounding
- **Endpoint:** `POST /api/v1/ai/chat`
- **Access:** Public or Authenticated
- **Request Body:**
```json
{
  "sessionId": "sess-8392-uuid",
  "message": "Can you recommend a lab coat and an engineering calculator under 2000 rupees?"
}
```
- **Response (200 OK):**
```json
{
  "sessionId": "sess-8392-uuid",
  "reply": "Here are verified items from the ShopSphere Campus store that match your academic requirements and budget:\n1. **Casio FX-991CW Scientific Calculator** - ₹1,495.00\n2. **Standard Cotton Chemistry Lab Coat (Unisex)** - ₹450.00\nTotal combo: ₹1,945.00 (within your ₹2,000 budget!).",
  "recommendedProducts": [
    {
      "id": 1,
      "title": "Casio FX-991CW ClassWiz Scientific Calculator",
      "price": 1495.00,
      "imageUrl": "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600"
    },
    {
      "id": 4,
      "title": "Standard Cotton Chemistry Lab Coat",
      "price": 450.00,
      "imageUrl": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600"
    }
  ]
}
```
