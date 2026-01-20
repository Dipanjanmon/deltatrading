
<div align="center">

# ⚡ DeltaTrading

  **The Next-Generation Gamified Trading Platform**

  [![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?logo=react&logoColor=black)](https://react.dev)
  [![Spring Boot](https://img.shields.io/badge/Backend-Spring_Boot_3-6DB33F?logo=spring&logoColor=white)](https://spring.io/projects/spring-boot)
  [![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL_16-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
  [![License](https://img.shields.io/badge/License-MIT-F7DF1E?logo=opensourceinitiative&logoColor=black)](LICENSE)

  <p align="center">
    <a href="#-key-features">Key Features</a> •
    <a href="#-architecture">Architecture</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-gallery">Gallery</a>
  </p>
</div>

---

## 📖 About

**DeltaTrading** redefines the paper trading experience by merging professional-grade financial tools with engaging RPG mechanics. Designed for both beginners and enthusiasts, it provides a strictly risk-free environment to master the stock market while leveling up your virtual portfolio.

> **"Learn. Trade. Level Up."**

---

## 📸 Dashboard Preview

<div align="center">
  <img src="frontend/src/assets/preview/Screenshot%202026-01-20%20172221.png" alt="DeltaTrading Dashboard" width="100%" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.5);">
</div>

---

## 🔥 Key Features

### 🖥️ Professional Dashboard

- **Live Market Data**: Real-time integration with Finnhub API for accurate pricing.
- **Hybrid Simulation Engine**: A custom-built engine that generates micro-ticks (every 1s) between API calls for a fluid, professional terminal experience.
- **Interactive Charts**: High-performance area charts powered by Recharts with time-frame toggles (1D, 1W, 1M).

### 🎮 Gamification System

- **XP & Progression**: Earn experience points for profitable trades and smart decisions.
- **Leveling System**: Unlock advanced features and higher tiers as you level up.
- **Achievements**: Collect badges for milestones like "First Million", "Risk Taker", and "Diversified".
- **Leaderboards**: Compete globally weekly rankings.

### � Portfolio Management

- **Virtual Wallet**: Start with **$10,000** in paper money.
- **Realistic Transactions**: Deposit and withdraw funds with auditory feedback.
- **Advanced Order Types**: Execute Market Buys, Sells, and Stop-Loss orders (Coming Soon).
- **P/L Analytics**: Track Realized and Unrealized Profit/Loss in real-time.

---

## 🏗️ Technical Architecture

DeltaTrading is built on a scalable **Client-Server** architecture, ensuring high performance and data integrity.

```mermaid
graph TD
    subgraph Client [Frontend Layer]
        UI[React + Vite UI]
        State[Zustand Store]
        Chart[Recharts Visualization]
        Sound[Audio Engine]
    end

    subgraph Server [Backend Layer]
        API[REST Controllers]
        Engine[Hybrid Simulation Engine]
        Security[Spring Security + JWT]
        Service[Business Logic]
    end

    subgraph Data [Persistence Layer]
        DB[(PostgreSQL)]
    end

    subgraph External [External Services]
        Finnhub[Finnhub Market API]
    end

    UI <--> API
    API --> Engine
    Engine <--> Finnhub
    API --> Service
    Service --> DB
```

---

## 🛠️ Tech Stack

| Component | Technology | Description |
|-----------|------------|-------------|
| **Frontend** | React 18, Vite | High-performance UI library |
| **Styling** | TailwindCSS | Utility-first CSS framework for Glassmorphism |
| **Animations** | Framer Motion | Smooth UI transitions and effects |
| **Backend** | Spring Boot 3 | Robust Java framework for enterprise apps |
| **Database** | PostgreSQL | Relational database for transactional integrity |
| **Security** | Spring Security | Auth modeling and protection |
| **Data** | Finnhub API | Real-time stock market data |

---

## 🚀 Getting Started

Follow this comprehensive guide to set up DeltaTrading locally.

### Prerequisites

- [Java JDK 17+](https://www.oracle.com/java/technologies/downloads/)
- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/download/)

### 1. Database Configuration

Open your PostgreSQL terminal or GUI (pgAdmin) and run:

```sql
CREATE DATABASE deltatrading_db;
```

### 2. Backend Initialization

1. Navigate to the project root.
2. (Optional) Update `src/main/resources/application.properties` with your DB credentials.
3. Run the application:

```bash
# Windows
./mvnw spring-boot:run
```

> The server will start on **<http://localhost:8081>**

### 3. Frontend Initialization

1. Open a new terminal window.
2. Navigate to the frontend directory:

```bash
cd frontend
```

1. Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

> The application will launching at **<http://localhost:5173>**

---

## 🖼️ Application Gallery

Explore the various interfaces of DeltaTrading.

| Market Overview | Trading Interface |
|:---:|:---:|
| <img src="frontend/src/assets/preview/Screenshot%202026-01-20%20172252.png" width="400" alt="Market"> | <img src="frontend/src/assets/preview/Screenshot%202026-01-20%20172312.png" width="400" alt="Trade"> |
| **User Profile** | **Leaderboard** |
| <img src="frontend/src/assets/preview/Screenshot%202026-01-20%20172327.png" width="400" alt="Profile"> | <img src="frontend/src/assets/preview/Screenshot%202026-01-20%20172426.png" width="400" alt="Leaderboard"> |
| **Virtual Wallet** | **Trade History** |
| <img src="frontend/src/assets/preview/Screenshot%202026-01-20%20172452.png" width="400" alt="Wallet"> | <img src="frontend/src/assets/preview/Screenshot%202026-01-20%20172516.png" width="400" alt="History"> |

---

## � License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<div align="center">
  <sub>Built with ❤️ by Dipanjan</sub>
</div>
