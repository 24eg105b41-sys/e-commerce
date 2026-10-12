# 🚂 Deploying ShopSphere Campus Backend to Railway

This guide walks you through deploying the Spring Boot 3 backend to **[Railway.app](https://railway.app)** in 5 simple steps.

---

## 📋 Prerequisites
- A **[Railway](https://railway.app)** account (sign in using GitHub).
- The repository pushed to your GitHub (`https://github.com/24eg105b41-sys/e-commers.git`).

---

## 🚀 Step 1: Create a New Project on Railway
1. Go to [railway.app/dashboard](https://railway.app/dashboard).
2. Click **"+ New Project"**.
3. Choose **"Deploy from GitHub repo"**.
4. Select your repository: **`24eg105b41-sys/e-commers`**.

---

## 🗄️ Step 2: Add a MySQL Database
1. Inside your Railway project canvas, click **"+ Create"** (or **"+ New"**).
2. Select **"Database"** ➔ **"Add MySQL"**.
3. Railway will provision a MySQL instance in seconds.

---

## ⚙️ Step 3: Configure Backend Service Variables
1. Click on the **Backend Service** card in your Railway project canvas.
2. Go to the **Variables** tab.
3. Click **"New Variable"** (or **"RAW Editor"**) and add the following variables:

| Variable Name | Value | Description |
| :--- | :--- | :--- |
| `SPRING_PROFILES_ACTIVE` | `prod` | Activates production MySQL profile |
| `MYSQLHOST` | `${{MySQL.MYSQLHOST}}` | Reference to Railway MySQL host |
| `MYSQLPORT` | `${{MySQL.MYSQLPORT}}` | Reference to Railway MySQL port |
| `MYSQLDATABASE` | `${{MySQL.MYSQLDATABASE}}` | Reference to Railway MySQL database name |
| `MYSQLUSER` | `${{MySQL.MYSQLUSER}}` | Reference to Railway MySQL user |
| `MYSQLPASSWORD` | `${{MySQL.MYSQLPASSWORD}}` | Reference to Railway MySQL password |
| `JWT_SECRET` | `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970` | 256-bit secret for signing JWT tokens |
| `CORS_ALLOWED_ORIGINS` | `*` *(or your frontend URL)* | Allowed CORS origins |

> 💡 **Tip:** Using `${{MySQL.VARIABLE_NAME}}` allows Railway to automatically sync credentials whenever the database is updated.

---

## 🌐 Step 4: Generate a Public URL
1. Go to your Backend Service ➔ **Settings** tab.
2. Under **"Networking"**, click **"Generate Domain"**.
3. Railway will provide a public HTTPS URL like:  
   `https://shopsphere-production.up.railway.app`

---

## ✅ Step 5: Verify Your Deployment
Once the deployment finishes building (green checkmark):
1. **Health Check:** Open `https://<YOUR-RAILWAY-DOMAIN>/actuator/health`  
   *Expected response:* `{"status":"UP"}`
2. **Product Catalog:** Open `https://<YOUR-RAILWAY-DOMAIN>/api/v1/products`  
   *Expected response:* JSON array containing sample seeded products.
3. **Swagger UI API Docs:** Open `https://<YOUR-RAILWAY-DOMAIN>/swagger-ui/index.html`

---

## 🔄 Connecting Frontend to Railway Backend
When deploying your React frontend (on Vercel, Netlify, or Railway):
Set the frontend environment variable:
```env
VITE_API_BASE_URL=https://<YOUR-RAILWAY-DOMAIN>/api/v1
```
