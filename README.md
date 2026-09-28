# Parth Printtech LLP — Web Platform Architecture

This repository is structured into 3 distinct, decoupled modules:

```
c:\Website---parth-printtech-main\
├── backend/                  # REST API Server (Node.js/Express) -> Port 5000
├── admin/                    # Admin Management Dashboard (Next.js) -> Port 3001
└── frontend-parth_printtech/ # Public Customer Website (Next.js) -> Port 3000
```

---

## 🚀 Quick Start Guide

### 1. Start the Backend API (Port 5000)
```bash
cd backend
npm install
npm start
```
- **API URL**: `http://localhost:5000`
- **Health Check**: `http://localhost:5000/api/health`

### 2. Start the Admin Console (Port 3001)
```bash
cd admin
npm install
npm run dev
```
- **Admin Dashboard**: `http://localhost:3001`
- **Default Credentials**:
  - **Username**: `admin`
  - **Password**: `admin123`

### 3. Start the Frontend Website (Port 3000)
```bash
cd frontend-parth_printtech
npm install
npm run dev
```
- **Live Website**: `http://localhost:3000`

---

## 📁 Phase 1: Home Page Management

The Admin Console allows you to manage every homepage section:
1. **Hero Video Slider**: Add/remove slides, reorder, change video sources, edit titles/subtitles/CTAs.
2. **Who We Are**: Edit brand story, headlines, badge text, 3D flip satisfaction stats, and floating cards.
3. **Markets We Serve**: Edit 8+ industrial sector cards, accent colors, and product tags.
4. **Featured Products**: Edit 2x2 specification grids, high-resolution product photos, categories, and titles.
5. **Clients & Brand Partners**: Manage client names, brand badges, and logos in 3 vertical columns.
6. **Testimonials**: Manage alternating customer review marquees and 5-star ratings.
7. **Our Values**: Manage the 4 core company pillars and icons.
8. **Global Settings**: Manage official phone, email, address, and social links.
