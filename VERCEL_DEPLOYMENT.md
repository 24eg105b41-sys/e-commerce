# ⚡ Deploying ShopSphere Campus Frontend to Vercel

This guide walks you through deploying the React + Vite frontend to **[Vercel](https://vercel.com)** in 4 simple steps.

---

## 📋 Prerequisites
- A **[Vercel](https://vercel.com)** account (sign in with your GitHub account).
- Your GitHub repository: `https://github.com/24eg105b41-sys/e-commers.git`
- Your Railway backend public URL: `https://e-commers-production-f0c6.up.railway.app`

---

## 🚀 Step 1: Import Project in Vercel
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New..."** ➔ **"Project"**.
3. Under **Import Git Repository**, find **`24eg105b41-sys/e-commers`** and click **"Import"**.

---

## ⚙️ Step 2: Configure Project Settings (CRITICAL)

On the **Configure Project** screen, configure the following settings:

### 1. Root Directory
- Click **"Edit"** next to **Root Directory**.
- Select or type: **`frontend`**
- Click **"Continue"**.

### 2. Build and Output Settings
*(Vercel will automatically detect Vite once Root Directory is set to `frontend`)*
- **Framework Preset:** `Vite`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

---

## 🔐 Step 3: Add Environment Variables
Expand the **Environment Variables** section and add:

| Key | Value |
| :--- | :--- |
| `VITE_API_BASE_URL` | `https://e-commers-production-f0c6.up.railway.app` |

> ⚠️ **Note:** Do NOT include a trailing slash `/` at the end of the URL.

---

## 🚢 Step 4: Click Deploy!
1. Click the **"Deploy"** button.
2. Vercel will build the frontend and provide your production URL (e.g. `https://shopsphere-campus.vercel.app`).
3. Client-side SPA routing (`/catalog`, `/cart`, `/admin`, etc.) is fully supported via `frontend/vercel.json` without 404 refresh errors.
