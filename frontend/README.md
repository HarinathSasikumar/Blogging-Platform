# InkWave Frontend

Premium MERN Blogging Platform Frontend built with React + Vite.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server (with API proxy to localhost:5000)
npm run dev
```

Visit: http://localhost:3000

## 📁 Project Structure

```
src/
├── api/              # Axios API layer
│   ├── axios.js      # Axios instance + interceptors
│   ├── auth.js       # Auth API calls
│   ├── comments.js   # Comments API
│   ├── posts.js      # Posts API
│   └── users.js      # Users + upload API
├── components/       # 15 reusable components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── ThemeToggle.jsx
│   ├── UserAvatar.jsx
│   ├── SkeletonCard.jsx
│   ├── PostCard.jsx
│   ├── PostGrid.jsx
│   ├── HeroSection.jsx
│   ├── TrendingSection.jsx
│   ├── SearchBar.jsx
│   ├── TagInput.jsx
│   ├── ReadingProgressBar.jsx
│   ├── RichTextEditor.jsx
│   ├── CommentSection.jsx
│   └── ProtectedRoute.jsx
├── context/          # React Context
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── pages/            # 10 page components
│   ├── HomePage.jsx
│   ├── ExplorePage.jsx
│   ├── SinglePostPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── WritePage.jsx
│   ├── DashboardPage.jsx
│   ├── ProfilePage.jsx
│   ├── SearchPage.jsx
│   └── NotFoundPage.jsx
├── App.jsx           # Root router + layout
├── main.jsx          # Entry point
└── index.css         # Design system
```

## 🔌 Backend Requirements (localhost:5000)

Endpoints consumed:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET  /api/auth/me`
- `GET  /api/posts` — supports `?page=&limit=&category=`
- `GET  /api/posts/trending`
- `GET  /api/posts/search?q=`
- `GET  /api/posts/:slug`
- `POST /api/posts`
- `PUT  /api/posts/:id`
- `DELETE /api/posts/:id`
- `POST /api/posts/:id/like`
- `POST /api/posts/:id/bookmark`
- `GET  /api/posts/bookmarks/me`
- `GET  /api/posts/my-posts`
- `GET  /api/comments/:postId`
- `POST /api/comments/:postId`
- `DELETE /api/comments/:id`
- `GET  /api/users/:id`
- `GET  /api/users/:id/posts`
- `POST /api/upload`

## ✨ Features

- 🎨 Premium dark/light theme with CSS variables
- 📱 Fully responsive (mobile, tablet, desktop)
- 🔒 JWT auth with protected routes
- ♾ Infinite scroll on Explore page
- 📝 Rich text editor (React Quill)
- 🖼 Image upload for posts + avatars
- 💬 Real-time comments
- ❤ Like & bookmark posts
- 🔍 Debounced search
- 📊 Personal dashboard with stats
- 🌊 Animated hero with stat counters
- 💀 Skeleton loading states
- 🍞 Toast notifications
- 📖 Reading progress bar
- 🏷 Tag chips with gradient styling
