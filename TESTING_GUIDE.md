# 🧪 ShopSphere Campus - Automated Testing Guide

This document details the automated testing architecture, test suites, edge-case coverage, and execution procedures for **ShopSphere Campus**, designed in compliance with the **AU-R24 Full Stack Development Using Java** syllabus testing standards.

---

## 🎯 1. Testing Philosophy & Strategy

To balance rigorous software engineering with student maintainability, ShopSphere Campus employs a multi-tiered testing strategy:

1. **Unit Testing with Mockito:** Tests business logic in isolation by mocking external dependencies (JPA repositories, password encoders, and token utilities). This ensures sub-second test execution without database connection overhead.
2. **ACID Transaction Verification:** Verifies critical business invariants such as atomic inventory decrements, empty-cart rejection, and automatic restocking when orders are cancelled.
3. **Security Invariant Verification:** Ensures duplicate email registrations throw proper `ConflictException` and invalid passwords reject authentication without leaking internal error stacks.
4. **AI Grounding Assurance:** Validates that the AI shopping advisor recommends only live database catalog items and successfully delegates campus policy questions to the verified RAG knowledge base.

---

## 🚀 2. How to Run the Test Suite

### Command-Line Execution
Run the full test suite using the standard Apache Maven Surefire plugin:

```bash
cd backend
mvn clean test
```

### Running Specific Test Classes
To execute an individual test suite:
```bash
# Test only the Order Service (Checkout & Restocking)
mvn test -Dtest=OrderServiceTest

# Test only the Authentication Service (Registration & Login)
mvn test -Dtest=AuthServiceTest

# Test only the AI Grounding Service
mvn test -Dtest=AiShoppingServiceTest
```

---

## 📊 3. Actual Test Execution Evidence

All tests have been executed on the host environment with **100% pass rate** (12 tests, 0 failures, 0 errors):

```text
[INFO] Scanning for projects...
[INFO] 
[INFO] -------------------< com.shopsphere:shopsphere-campus >-------------------
[INFO] Building shopsphere-campus 1.0.0-SNAPSHOT
[INFO]   from pom.xml
[INFO] --------------------------------[ jar ]---------------------------------
[INFO] 
[INFO] --- maven-surefire-plugin:3.2.5:test (default-test) @ shopsphere-campus ---
[INFO] Using auto detected provider: org.apache.maven.surefire.junitplatform.JUnitPlatformProvider
[INFO] 
[INFO] -------------------------------------------------------
[INFO]  T E S T S
[INFO] -------------------------------------------------------
[INFO] Running com.shopsphere.service.AiShoppingServiceTest
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 1.052 s -- in com.shopsphere.service.AiShoppingServiceTest
[INFO] Running com.shopsphere.service.AuthServiceTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.176 s -- in com.shopsphere.service.AuthServiceTest
[INFO] Running com.shopsphere.service.CartServiceTest
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.053 s -- in com.shopsphere.service.CartServiceTest
[INFO] Running com.shopsphere.service.OrderServiceTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.063 s -- in com.shopsphere.service.OrderServiceTest
[INFO] Running com.shopsphere.service.ProductServiceTest
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.051 s -- in com.shopsphere.service.ProductServiceTest
[INFO] 
[INFO] Results:
[INFO] 
[INFO] Tests run: 12, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  3.570 s
[INFO] Finished at: 2026-10-11T19:42:01+05:30
[INFO] ------------------------------------------------------------------------
```

---

## 🔍 4. Detailed Test Suite Specifications

### 4.1 Authentication Service Tests (`AuthServiceTest.java`)
Located at: [`backend/src/test/java/com/shopsphere/service/AuthServiceTest.java`](file:///backend/src/test/java/com/shopsphere/service/AuthServiceTest.java)

| Test Method | Objective & Verification Scenario |
| :--- | :--- |
| `registerUser_Success()` | Verifies that a valid registration request creates a user with `ROLE_CUSTOMER`, saves a BCrypt-encoded password, and immediately issues a signed JWT token. |
| `registerUser_DuplicateEmail_ThrowsConflictException()` | Verifies that attempting to register an existing email address fails gracefully with a 409 `ConflictException` and does not overwrite user records. |
| `loginUser_InvalidPassword_ThrowsBadCredentials()` | Verifies that supplying an incorrect password throws `BadCredentialsException`, preventing unauthorized access. |

---

### 4.2 Cart Service Tests (`CartServiceTest.java`)
Located at: [`backend/src/test/java/com/shopsphere/service/CartServiceTest.java`](file:///backend/src/test/java/com/shopsphere/service/CartServiceTest.java)

| Test Method | Objective & Verification Scenario |
| :--- | :--- |
| `addItemToCart_Success()` | Verifies that adding a product increments cart items and computes accurate subtotals and server-calculated taxes. |
| `addItemToCart_ExceedsStock_ThrowsInsufficientStockException()` | Verifies that requesting quantity greater than `product.getStockQuantity()` throws `InsufficientStockException`, blocking phantom inventory reservation. |

---

### 4.3 Order & Checkout Service Tests (`OrderServiceTest.java`)
Located at: [`backend/src/test/java/com/shopsphere/service/OrderServiceTest.java`](file:///backend/src/test/java/com/shopsphere/service/OrderServiceTest.java)

| Test Method | Objective & Verification Scenario |
| :--- | :--- |
| `checkout_Success_DecrementsInventoryAndClearsCart()` | Verifies the complete atomic checkout lifecycle: computes order totals, decreases product stock count in the database, snapshots delivery address, creates order items, and empties the user's cart. |
| `checkout_EmptyCart_ThrowsBadRequestException()` | Verifies that attempting checkout with zero items in cart is rejected with `BadRequestException`. |
| `cancelOrder_RestocksInventory()` | Verifies that when a student cancels an order in `PLACED` or `PAID` state, product stock quantities are immediately incremented back into active inventory. |

---

### 4.4 Catalog & Product Service Tests (`ProductServiceTest.java`)
Located at: [`backend/src/test/java/com/shopsphere/service/ProductServiceTest.java`](file:///backend/src/test/java/com/shopsphere/service/ProductServiceTest.java)

| Test Method | Objective & Verification Scenario |
| :--- | :--- |
| `getProducts_WithPaginationAndCategoryFilter()` | Verifies multi-parameter catalog querying with page limits, category IDs, and sorting flags. |
| `getProductById_NonExistent_ThrowsResourceNotFoundException()` | Verifies that querying an invalid product ID throws a descriptive 404 `ResourceNotFoundException`. |

---

### 4.5 AI Shopping Assistant Tests (`AiShoppingServiceTest.java`)
Located at: [`backend/src/test/java/com/shopsphere/service/AiShoppingServiceTest.java`](file:///backend/src/test/java/com/shopsphere/service/AiShoppingServiceTest.java)

| Test Method | Objective & Verification Scenario |
| :--- | :--- |
| `handleChat_ProductRecommendation_ReturnsGroundedCatalogProducts()` | Verifies that user queries asking for products (e.g. *"calculator under 1500"*) return actual catalog items from the database without fabricating arbitrary items. |
| `handleChat_PolicyInquiry_ReturnsAccurateCampusPolicy()` | Verifies that questions regarding store hours, refund policies, and hostel delivery are resolved via the `CampusKnowledgeBaseService`. |

---

## 🛠️ 5. ByteBuddy & Modern JDK Compatibility Note

When executing with cutting-edge JDK builds (e.g. Oracle JDK 25/26), ByteBuddy (used internally by Mockito) requires experimental mode activation. This is pre-configured in `backend/pom.xml`:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-surefire-plugin</artifactId>
    <configuration>
        <argLine>-Dnet.bytebuddy.experimental=true</argLine>
    </configuration>
</plugin>
```
This guarantees flawless execution across all Java LTS (21) and newer development environments.
