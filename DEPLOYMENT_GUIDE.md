# 🚀 ShopSphere Campus - Deployment & Production Operations Guide

This guide provides complete instructions for containerizing, configuring, and deploying **ShopSphere Campus** into development, testing, and production cloud environments.

---

## 🏗️ 1. Deployment Architecture

```mermaid
graph LR
    User[Student / Admin Browser] -->|Port 80/443| NGINX[Nginx Reverse Proxy & Static Host]
    NGINX -->|Serves Static Bundle| SPA[React 18 SPA]
    NGINX -->|Proxies /api/v1| SPRING[Spring Boot 3.3.4 (Tomcat 10)]
    SPRING -->|JDBC / Port 3306| MYSQL[(MySQL 8.0 Database)]
    SPRING -->|In-Memory| CACHE[Caffeine Cache]
```

---

## 🐳 2. Containerized Deployment with Docker Compose

ShopSphere Campus includes a turnkey `docker-compose.yml` that provisions the full stack with health checks and network isolation.

### 2.1 File Components
- **`backend/Dockerfile`:** Multi-stage build (Maven 3.9 + Eclipse Temurin 21) creating a lightweight, non-root runtime container.
- **`frontend/Dockerfile`:** Multi-stage build (Node 20 Alpine + Nginx Alpine) compiling Vite assets into static files and serving them with optimized gzip compression.
- **`frontend/nginx.conf`:** Custom Nginx configuration providing SPA client-side routing fallback (`try_files $uri $uri/ /index.html;`) and reverse proxy rules.
- **`docker-compose.yml`:** Coordinates service dependencies (`depends_on`), persistent MySQL named volumes, and internal networking.

### 2.2 Quick Launch
```bash
# Clone the repository
cd shopsphere-campus

# Create production environment file
cp .env.example .env

# Build and start all containers in detached mode
docker compose up --build -d
```

### 2.3 Inspecting Container Health & Logs
```bash
# View running containers
docker compose ps

# Stream logs from the backend service
docker compose logs -f backend

# Stream logs from the frontend service
docker compose logs -f frontend

# Stream logs from the database
docker compose logs -f db
```

### 2.4 Teardown
```bash
# Stop containers without losing database data
docker compose down

# Stop containers and remove persistent volumes (Clean reset)
docker compose down -v
```

---

## 🌐 3. Cloud Deployment Options

### Option A: Deployment to Cloud VPS (AWS EC2 / DigitalOcean / Linode)

1. **Provision an Ubuntu 22.04 or 24.04 LTS instance** with minimum 2 GB RAM and 20 GB SSD.
2. **Install Docker Engine & Docker Compose:**
   ```bash
   sudo apt update && sudo apt install -y docker.io docker-compose-v2
   sudo systemctl enable --now docker
   sudo usermod -aG docker $USER
   ```
3. **Clone Repository & Configure Environment:**
   ```bash
   git clone https://github.com/your-username/shopsphere-campus.git
   cd shopsphere-campus
   cp .env.example .env
   nano .env  # Update JWT_SECRET and production MySQL passwords
   ```
4. **Deploy Containers:**
   ```bash
   docker compose up --build -d
   ```
5. **Attach Custom Domain & HTTPS:**
   Use Certbot or Cloudflare to terminate SSL at port 443 pointing to Nginx.

---

### Option B: Managed Cloud Platforms (Render / Railway + Vercel)

#### 1. Database (Aiven or Railway MySQL)
- Create a managed MySQL 8.0 instance.
- Obtain the public JDBC connection string, username, and password.

#### 2. Backend API (Render.com or Railway.app)
- Connect repository and set root directory to `backend`.
- **Build Command:** `mvn clean package -DskipTests`
- **Run Command:** `java -Dspring.profiles.active=dev -jar target/shopsphere-campus-1.0.0-SNAPSHOT.jar`
- **Environment Variables:**
  - `SPRING_DATASOURCE_URL`: `jdbc:mysql://<host>:<port>/<db>?useSSL=true&allowPublicKeyRetrieval=true`
  - `MYSQL_USER`: `<username>`
  - `MYSQL_PASSWORD`: `<password>`
  - `JWT_SECRET`: `<secure-random-256bit-string>`
  - `CORS_ALLOWED_ORIGINS`: `https://your-frontend.vercel.app`

#### 3. Frontend SPA (Vercel or Netlify)
- Connect repository and set root directory to `frontend`.
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variables:**
  - `VITE_API_BASE_URL`: `https://your-backend.onrender.com/api/v1`

---

## ⚙️ 4. Production Checklist & Hardening

| Aspect | Development Setting | Production Recommendation |
| :--- | :--- | :--- |
| **JWT Secret** | Hardcoded sample key | Generate cryptographically secure key: `openssl rand -hex 32` |
| **CORS Origins** | `localhost:5173, localhost:3000` | Exact production domain(s) e.g., `https://campus.shopsphere.edu` |
| **Database DDL** | `spring.jpa.hibernate.ddl-auto: update` | Set to `validate` after initial schema migration |
| **Hikari Connection Pool** | Default pool (10 connections) | Configure `maximum-pool-size: 20` and `minimum-idle: 5` |
| **SSL/TLS** | Plain HTTP on 8080 | Terminate HTTPS at Load Balancer or Nginx Reverse Proxy |
| **Password Policy** | Minimum 6 characters | Enforce 8+ characters with uppercase, digit, and symbol |

---

## 💾 5. Database Backup and Restoration

### Automated Backup (mysqldump)
```bash
# Export schema and data from container
docker compose exec db mysqldump -u shopsphere_user -pCampusPassword2026! shopsphere_campus > shopsphere_backup_$(date +%F).sql
```

### Restoration
```bash
# Restore schema and data into container
docker compose exec -T db mysql -u shopsphere_user -pCampusPassword2026! shopsphere_campus < shopsphere_backup_2026-10-11.sql
```

---

## 🔧 6. Troubleshooting Common Issues

### Issue 1: `Public Key Retrieval is not allowed` Error
- **Cause:** MySQL 8.0 uses `caching_sha2_password` authentication by default.
- **Solution:** Ensure the JDBC URL contains `allowPublicKeyRetrieval=true` and `useSSL=false` (for local docker connections).

### Issue 2: Frontend 404 on Page Refresh
- **Cause:** React Router handles routing in the browser; direct navigation to `/catalog` or `/admin` causes standard web servers to search for a physical `/catalog` file.
- **Solution:** Ensure `nginx.conf` includes:
  ```nginx
  location / {
      try_files $uri $uri/ /index.html;
  }
  ```

### Issue 3: Port 3306 or 8080 Already In Use
- **Cause:** Local MySQL service or previous development server running in the background.
- **Solution:** Check active ports with `netstat -ano | findstr 8080` (Windows) or update port mappings in `docker-compose.yml` (e.g., `"8081:8080"`).
