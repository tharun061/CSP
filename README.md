# GramaSeva (గ్రామసేవ)
### Official Rural Local Services & 30-Day Service Guarantee Portal
**Government of Andhra Pradesh • ఆంధ్రప్రదేశ్ ప్రభుత్వం**

GramaSeva is a production-grade digital citizen services platform engineered to connect rural households, farmers, and village establishments across all 26 districts of Andhra Pradesh with police-verified local trade technicians (electricians, plumbers, agri machinery mechanics, vehicle breakdown assistance, and home electronics repair).

---

## 🏛️ Key Features

1. **Official Government Branding**:
   - Built under the visual standards of the Government of Andhra Pradesh (ఆంధ్రప్రదేశ్ ప్రభుత్వం).
   - Fully bilingual interface (**English + తెలుగు**) with real-time toggle.

2. **Complete 26 Andhra Pradesh Revenue Districts Coverage**:
   - Complete geodetic data for all 26 AP districts and their respective mandals.
   - Built-in **GPS Auto-Detection** using browser Geolocation and the Haversine distance formula to match citizens with their closest district and village technicians.

3. **Standard ₹50 Basic Home Visit Fee**:
   - Legally mandated standard **₹50 Basic Home Visit Fee** across all 8 service trades.
   - Transparent on-site diagnosis and upload of additional work charges upon job completion.

4. **30-Day Service Guarantee Engine (Worker A vs. Worker B)**:
   - Every completed service automatically issues an official Digital Receipt and activates a **30-day guarantee**.
   - If a repaired issue recurs within 30 days, the database automatically filters out the original worker and dispatches an independent certified technician (**Worker B**, where $\text{Worker B} \ne \text{Worker A}$) to re-service the problem **100% free of charge**.

5. **Clean Authentication & Role-Based Dashboards**:
   - **Citizen Registration & Login**: Book doorstep services, view real-time dual OTPs (`start_otp`, `complete_otp`), download digital receipts, and file guarantee claims.
   - **Technician Registration & Login**: Multi-service trade selection, real-time incoming jobs queue, status updates ("On The Way" $\rightarrow$ "Arrived"), and work charges upload.
   - **Dedicated State Admin Console** (`/admin/login`): Statewide KPI monitoring, 26 districts live registry, PostGIS spatial health check, and Worker B arbitration.

---

## 🛠️ Technology Stack

| Architecture Layer | Technology Selected | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19 + Vite 6** | Modern Single Page Application (SPA) with hot module replacement and lightning-fast builds. |
| **Styling & Design** | **Tailwind CSS v4** | AP Government Emerald Green theme with clean responsive mobile-first typography. |
| **Icons & UI Micro-Interactions** | **Lucide React + Canvas Confetti** | Accessible iconography and celebratory confirmation on service bookings. |
| **Client-Side Routing** | **React Router v7** | Deep-link preservation with `vercel.json` and `_redirects` SPA rewrite rules. |
| **Backend & Cloud Database** | **Supabase (PostgreSQL 15)** | Relational database schema with 7 core tables, RLS security, and ACID transactions. |
| **Geospatial Engine** | **PostGIS Extension (PostgreSQL)** | GiST 2D spatial indexing for mandal-radius searches (`ST_DWithin`, `ST_Distance`). |
| **Bilingual Internationalization** | **English + తెలుగు** | Dual-language dictionary mapping for all rural and agricultural terminology. |

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) (version 9 or higher)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/gramaseva-ap.git
cd gramaseva-ap/website
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open your browser at **`http://localhost:5173`**.

### 4. Build for Production
```bash
npm run build
```
The optimized production bundle will be generated in the `website/dist` directory.

---

## 🌐 Deploy to Vercel (1-Click Deployment)

This project is pre-configured for instant zero-configuration deployment on **Vercel**:
1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Set the **Root Directory** to `website`.
5. Click **"Deploy"**.
The included `website/vercel.json` handles SPA routing and URL rewrites automatically.

---

## 🗄️ Database Architecture & Schema

The SQL schema is located in `supabase/schema.sql`. It defines:
- **`users`**: Master citizen, technician, and administrator accounts.
- **`provider_profiles`**: Trade skills, experience, ratings, and PostGIS geometry points.
- **`services`**: Official service catalog with fixed ₹50 visit fee.
- **`bookings`**: Booking lifecycle, dual OTP verification, work charges upload, and guarantee timer.
- **`guarantee_claims`**: Worker A vs Worker B arbitration table enforcing `CHECK (worker_a_id != worker_b_id)`.
- **`get_nearby_providers`**: PostGIS radius discovery stored procedure.

To connect your own Supabase project:
1. Create a free project on [Supabase](https://supabase.com).
2. Open the **SQL Editor** in Supabase and paste the contents of `supabase/schema.sql`.
3. Create a `.env` file in the `website` folder:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
*(Note: If no Supabase URL is provided, the platform automatically runs in resilient local database mode so all features work seamlessly offline or in any demo environment).*

---

## 🔒 Official Administrative Credentials
- **Portal URL**: `/admin/login`
- **Email**: `admin@gramaseva.ap.gov.in`
- **Password**: `admin@ap2026`

---

*GramaSeva™ — Government of Andhra Pradesh Rural Citizen Services Platform*
