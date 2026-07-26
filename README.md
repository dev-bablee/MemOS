# MemOS

A persistent memory platform for AI agents.

MemOS helps AI applications remember conversations, user preferences, project context, and shared knowledge across multiple sessions. It provides a long-term memory layer that allows AI agents to become more context-aware, reliable, and collaborative.

Built for the CockroachDB AgentOS Hackathon.

---

# Problem

Most AI assistants forget everything once a conversation ends.

This forces users to repeat information, reduces personalization, and makes it difficult to build truly intelligent AI systems.

Developers also need a scalable way to store, organize, and retrieve memory across multiple AI agents and applications.

---

# Solution

MemOS provides a persistent memory layer for AI agents.

Instead of losing context after every session, agents can securely store memories, retrieve relevant information using semantic search, and share knowledge across projects and conversations.

This enables developers to build AI systems that become smarter over time instead of starting from scratch every session.

---

# Features

- Persistent long-term memory
- Context-aware AI conversations
- Semantic memory search
- Multi-agent collaboration
- Real-time synchronization
- Project-based memory organization
- Modern and responsive dashboard
- Scalable architecture

---

# Architecture

```text
                ┌───────────────────┐
                │   Next.js Frontend │
                └─────────┬─────────┘
                          │
                    REST / WebSocket
                          │
                ┌─────────▼─────────┐
                │     Backend API    │
                └─────────┬─────────┘
                          │
                  Memory Management
                          │
                ┌─────────▼─────────┐
                │   CockroachDB      │
                └─────────┬─────────┘
                          │
                ┌─────────▼─────────┐
                │      AI Agents     │
                └───────────────────┘
```

---

# Tech Stack

## Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Zustand
- TanStack Query
- Framer Motion
- React Hook Form
- Zod
- Socket.IO Client

## Backend (Planned)

- Node.js
- Express.js
- CockroachDB
- Socket.IO
- REST API
- JWT Authentication

---

# Repository Structure

```text
MemOS/
│
├── README.md
├── HLD.md
├── LLD.md
├── .gitignore
│
├── apps/
│   ├── web/
│   └── api/
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── screenshots/
│
└── packages/
```

---

# Getting Started

## Clone the repository

```bash
git clone https://github.com/dev-bablee/MemOS.git
```

## Go to the project

```bash
cd MemOS/apps/web
```

## Install dependencies

```bash
npm install
```

## Start the development server

```bash
npm run dev
```

Open your browser:

```
http://localhost:3000
```

---

# Roadmap

- [x] Project structure
- [x] Frontend setup
- [ ] Authentication
- [ ] Dashboard
- [ ] Memory management
- [ ] Semantic search
- [ ] Agent management
- [ ] CockroachDB integration
- [ ] Deployment

---

# Screenshots

Screenshots will be added as development progresses.

---

# Team

Built for the CockroachDB AgentOS Hackathon.

**Frontend**
- Babli Kushwah

**Backend**
- Team Member

---

# Contributing

Contributions, suggestions, and feedback are welcome.

Please open an issue or submit a pull request.

---

# License

This project is currently under development.

The license will be finalized before the public release.