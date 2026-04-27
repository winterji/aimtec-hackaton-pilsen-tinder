# Objev Plzeň (Discover Pilsen) 🍺🏰

**Objev Plzeň** is a gamified platform designed to help locals and tourists discover the hidden gems and popular spots of Pilsen. Developed during the **Aimtec Hackathon 2026** by Team **MonkePower**.

The project combines a "Tinder-style" swiping experience for locations with an interactive game and a competitive leaderboard, all managed through a centralized admin dashboard.

---

## 🚀 Key Features

- **Pinder (Location Tinder):** Swipe through various Pilsen locations. Like what you see to build your personal discovery list or dislike to move on.
- **Objev Plzeň Game:** An interactive gaming experience (ObjevPlzeň: The Game) that challenges your knowledge and exploration skills.
- **Leaderboard:** Compete with others and see who knows Pilsen the best.
- **Admin Dashboard:** A comprehensive interface for managing locations, categories, and monitoring platform activity.
- **Central Portal:** A unified landing page (Menu) that connects all components of the ecosystem.

---

## 🏗️ Architecture & Technology

The project follows a **microservices architecture**, containerized with **Docker** and ready for orchestration with **Kubernetes (Helm)**.

### Technology Stack
- **Frontend & Web Apps:** [Next.js](https://nextjs.org/) (React), [Tailwind CSS](https://tailwindcss.com/)
- **Backend API:** Next.js API Routes, [Prisma ORM](https://www.prisma.io/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **Icons & UI:** [Lucide React](https://lucide.dev/), [Leaflet](https://leafletjs.com/) (Maps), [ApexCharts](https://apexcharts.com/)
- **DevOps:** Docker, Docker Compose, Helm Charts

---

## 📁 Project Structure

```text
.
├── apps/
│   ├── admin/           # Admin Dashboard (Next.js) - Management & Analytics
│   ├── backend/         # Core API Service (Next.js + Prisma) - Business Logic & DB access
│   ├── frontend/        # "Pinder" Web App (Next.js) - The main swiping experience
│   └── menu/            # Central Portal (Next.js) - Landing page and navigation
├── helm/                # Kubernetes Helm Charts for each service
│   ├── admin/
│   ├── backend/
│   ├── frontend/
│   └── menu/
├── docker-compose.yml   # Local development setup (Build from source)
└── compose-new.yml      # Deployment setup (Using pre-built images)
```

---

## 🛠️ Getting Started

### Prerequisites
- Docker & Docker Compose
- (Optional) Node.js & npm (for local development outside containers)

### Running with Docker Compose
To start the entire ecosystem locally:

```bash
docker-compose up --build
```

The services will be available at:
- **Menu (Portal):** [http://localhost:3003](http://localhost:3003)
- **Pinder (Frontend):** [http://localhost:3002](http://localhost:3002)
- **Admin:** [http://localhost:3001](http://localhost:3001)
- **Backend API:** [http://localhost:3000](http://localhost:3000)

---

## 👥 Team MonkePower
Developed at Aimtec Hackathon 2026, Pilsen. Later extended and budled by Jiri Winter for master's thesis.

---
*Note: This project uses Google Places API for location data. Ensure you have a valid API key configured in the backend environment variables.*
