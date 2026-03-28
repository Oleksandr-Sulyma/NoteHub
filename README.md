# 📓 NoteHub

**NoteHub** is a powerful desktop note-taking application built with a modern tech stack: **Next.js 15, React 19, and TanStack Query**.  
The project demonstrates advanced client-server architecture, secure data fetching, and modern development best practices.

---

## 🚀 Live Demo  
👉 [https://note-hub-iota.vercel.app](https://note-hub-iota.vercel.app)  

## 🔗 Backend API  
👉 [https://nodejs-hw-awfs.onrender.com](https://nodejs-hw-awfs.onrender.com)  
👉 [https://github.com/Oleksandr-Sulyma/nodejs-hw](https://github.com/Oleksandr-Sulyma/nodejs-hw)  

---

## ✨ Features

- 🔐 **Authentication System** Secure registration, login, and logout using HTTP-only cookies.

- 👤 **Profile Management** Update username and avatar (with real-time preview and size/format validation).

- 📝 **Notes CRUD** Full Create, Read, Update, and Delete functionality with instant UI synchronization.

- 🔎 **Smart Filtering** Filter notes by categories (tags) and perform high-performance search.

- 💾 **Draft System** Auto-save notes using **Zustand** to prevent data loss during editing.

- ✅ **Strict Validation** Robust form handling and schema validation with **Zod + React Hook Form**.

---

## 🛠 Tech Stack

| Technology | Description |
|----------|------------|
| **Next.js 15** | App Router, Server Actions, Middleware, and Server-Side Proxying |
| **React 19** | Latest hooks, concurrent rendering, and performance optimizations |
| **TypeScript** | Full type safety across the entire application |
| **TanStack Query** | Server state management, caching, and smart invalidation |
| **Zustand** | Lightweight client-side state management for drafts and UI state |
| **Zod + RHF** | Type-safe form validation and management |
| **CSS Modules** | Scoped and maintainable styling |

---

## 🏗 Architecture Highlights

- 🖥 **Desktop First** Optimized specifically for large screens to provide a premium desktop-only experience.

- 🔒 **Secure Image Handling** Configured `remotePatterns` in `next.config.ts` for Cloudinary and GoIT assets to ensure secure and optimized image loading.

- 🔄 **Server-Side API Proxy** Implemented secure communication with the external Node.js backend via a server-side proxy layer to handle data flow and security.

- 🛡️ **Type Safety** Extensive use of `z.infer` to ensure 100% synchronization between validation schemas and TypeScript types.

- 🎯 **UX Enhancements** Custom toast notifications (React Hot Toast) for non-blocking user feedback and delete confirmations.

---

## 💻 Local Setup

```bash
git clone [https://github.com/Oleksandr-Sulyma/NoteHub.git](https://github.com/Oleksandr-Sulyma/NoteHub.git)
cd NoteHub
npm install
```

Create `.env.local` and add:

```env
NEXT_PUBLIC_API_URL=[https://nodejs-hw-awfs.onrender.com](https://nodejs-hw-awfs.onrender.com)
BACKEND_API_URL=[https://nodejs-hw-awfs.onrender.com](https://nodejs-hw-awfs.onrender.com)
```

> **Note:** > `NEXT_PUBLIC_API_URL` is used for client-side interactions.  
> `BACKEND_API_URL` is used for server-side operations (Next.js).

Run the project:

```bash
npm run dev
```

---

## 🧩 Challenges & Solutions

### 🔐 Authentication & Security
**Challenge:** Securely handling authentication in a fullstack Next.js application.  
**Solution:** Implemented HTTP-only cookies and protected routes via **Next.js Middleware** for server-side security.

### 🔄 State Synchronization
**Challenge:** Keeping the UI in sync with server data after complex CRUD operations.  
**Solution:** Leveraged **TanStack Query** for automatic refetching and cache invalidation.

### 💾 Preventing Data Loss
**Challenge:** Users losing unsaved note content due to accidental page refreshes.  
**Solution:** Built a draft auto-save system powered by **Zustand** to persist data locally.

### 🌐 CORS & API Communication
**Challenge:** Resolving CORS issues and ensuring secure communication with the external API.  
**Solution:** Configured a **Server-Side Proxy** approach and **Remote Patterns** in `next.config.ts`.

---

## 👤 Author

**Oleksandr Sulyma** GitHub: [https://github.com/Oleksandr-Sulyma](https://github.com/Oleksandr-Sulyma)

---

# 🇺🇦 Українська версія

# 📓 NoteHub

**NoteHub** — це потужний десктопний додаток для керування нотатками, створений на сучасному стеку: **Next.js 15, React 19 та TanStack Query**.  
Проєкт демонструє побудову клієнт-серверної архітектури та сучасні підходи до веб-розробки.

## ✨ Основні можливості

* 🔐 **Система авторизації:** Реєстрація, вхід та вихід через HTTP-only cookies.
* 👤 **Керування профілем:** Зміна імені та аватара (з прев’ю та валідацією).
* 📝 **CRUD нотаток:** Повний цикл роботи з нотатками з миттєвим оновленням UI.
* 🔎 **Розумна фільтрація:** Категорії (теги) та швидкий пошук.
* 💾 **Система чернеток:** Автозбереження через **Zustand**.
* ✅ **Валідація форм:** Сувора типізація та перевірка через **Zod + React Hook Form**.

## 🏗 Архітектурні особливості

* 🖥 **Desktop First:** Оптимізація під великі екрани (Desktop Only).
* 🔒 **Безпечні зображення:** Налаштовано `remotePatterns` для Cloudinary та GoIT.
* 🔄 **Серверне проксіювання:** Безпечна взаємодія з бекендом через серверний шар.
* 🔒 **Type Safety:** Синхронізація схем і типів через `z.infer`.

---
