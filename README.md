# 🎨 UI/UX Mockup Generator

An AI-powered web application that generates beautiful, interactive UI/UX mockups from a single prompt — no design skills required. Built with Next.js, React, and powered by OpenRouter's AI models.

**Live Demo → [ui-ux-generator-five.vercel.app](https://ui-ux-generator-five.vercel.app/)**

---

## ✨ Features

### 🤖 AI-Powered Screen Generation
- Generate **1–4 screens** per project in a single request
- Add **additional screens** to an existing project at any time
- **Modify individual screens** by describing changes to the AI in plain text
- Delete screens you don't need

### 🗂 Predefined Project Templates
Jumpstart your design with 7 curated input configurations:

| Template | Description |
|----------|-------------|
| ✈️ Travel Planner App | Booking flows, itinerary views, destination discovery |
| 🧠 AI Learning Platform | Course pages, progress tracking, quiz interfaces |
| 💰 Finance Tracker | Dashboards, transaction history, budget overviews |
| 🛒 E-Commerce Store | Product listings, cart, checkout flows |
| ✅ Smart To-Do Planner | Task management, priority views, scheduling |
| 🍔 Food Delivery App | Restaurant browsing, order tracking, cart UI |
| 👦 Kids Learning App | Playful interfaces, gamification, lesson flows |

### 🎨 Theme Customization
- Choose from **10 predefined color themes** to instantly restyle your entire project
- Rename your project at any time
- Theme and name changes are **saved to the database in real time** on hitting Save

### 🖼 Infinite Canvas
- Powered by [`react-zoom-pan-pinch`](https://github.com/BetterTyped/react-zoom-pan-pinch) for a smooth, near-unlimited canvas experience
- Zoom, pan, and pinch your way around all generated screens in one view

### 💻 HTML Source Viewer
- Inspect the raw HTML behind any generated screen
- Useful for developers who want to extract and adapt the generated code

### 🔗 Project Sharing
- Share a direct URL to any project with collaborators or clients

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js](https://nextjs.org/) |
| UI | [React](https://react.dev/) + [Tailwind CSS](https://tailwindcss.com/) |
| Auth | [Clerk](https://clerk.com/) |
| Database | [Neon](https://neon.tech/) (serverless Postgres) with ORM |
| AI | [OpenRouter](https://openrouter.ai/) |
| Canvas | [react-zoom-pan-pinch](https://github.com/BetterTyped/react-zoom-pan-pinch) |
| Deployment | [Vercel](https://vercel.com/) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A [Clerk](https://clerk.com/) account
- A [Neon](https://neon.tech/) database
- An [OpenRouter](https://openrouter.ai/) API key

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/ui-ux-generator.git
cd ui-ux-generator

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the root of your project:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Neon Database
DATABASE_URL=your_neon_connection_string

# OpenRouter AI
OPENROUTER_API_KEY=your_openrouter_api_key
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
├── app/                  # Next.js App Router pages and layouts
├── components/           # Reusable React components
│   ├── canvas/           # Zoom/pan canvas and screen rendering
│   ├── editor/           # Screen editor and modification UI
│   └── themes/           # Theme selector and color config
├── lib/                  # Database client, AI helpers, utilities
├── public/               # Static assets
└── .env.local            # Environment variables (not committed)
```

---

## 🔄 How It Works

1. **Create a project** — pick a template or write a custom prompt
2. **AI generates screens** — OpenRouter runs the generation and returns HTML mockups (1–4 screens)
3. **Customize** — change the theme, rename the project, and hit Save to persist to Neon DB
4. **Iterate** — add more screens, ask the AI to modify any existing screen, or delete ones you don't need
5. **Share** — copy the project URL and send it to anyone

---

## 📸 Screenshots



---

## 📄 License

MIT License — feel free to use, modify, and build on this project.

