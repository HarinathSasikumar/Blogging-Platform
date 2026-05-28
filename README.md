# HN BlogSphere

HN BlogSphere is a modern, premium, and fully responsive MERN stack blogging platform. It allows users to write, publish, read, and manage articles across various categories with a sleek, futuristic UI that includes a dark-mode first design and AI-powered aesthetic placeholders.

## 🚀 Features

- **Futuristic & Premium UI**: Features glassmorphism, glowing micro-animations, and fluid typography.
- **Responsive Design**: Flawlessly adapts to laptops, desktops, tablets, and mobile devices without breaking UI components.
- **Robust Authentication**: Secure user login and registration powered by JSON Web Tokens (JWT).
- **Rich Text Editing**: Write and format your articles seamlessly with a builtin rich text editor.
- **Categorization & AI Placeholders**: Assign categories (Technology, Science, Lifestyle, etc.) to your posts. Posts without a custom featured image automatically receive a stunning, category-specific AI-generated cover image.
- **Interactive Dashboard**: A unified workspace for authors to manage their drafts, published stories, and saved bookmarks.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, React Router DOM, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Styling**: Vanilla CSS with custom properties (CSS variables), CSS Grid, and Flexbox

## 📁 Project Structure

```text
Blogging Platform/
├── backend/            # Express.js Server API
│   ├── src/            # Controllers, Models, Routes, and Middleware
│   ├── .env            # Environment variables for the backend
│   └── server.js       # Main backend entry point
│
├── frontend/           # React frontend application
│   ├── src/            # Pages, Components, Contexts, and API logic
│   ├── public/         # Category-specific AI images and assets
│   └── index.css       # Global styling and design system
│
└── package.json        # Root package.json for running both servers concurrently
```

## ⚙️ Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.
Ensure you have [MongoDB](https://www.mongodb.com/) installed and running locally, or have a MongoDB URI.

### 1. Installation

Install all necessary dependencies for both the frontend and backend.

```bash
# Navigate into the project folder
cd "Blogging Platform"

# Install all dependencies (frontend, backend, and root)
npm run install:all
```

### 2. Environment Setup

Create a `.env` file inside the `/backend` directory (if it doesn't already exist) and add the following variables:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/blogdb
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
NODE_ENV=development
```

### 3. Running the Project

You can run both the frontend and backend concurrently from the root directory using a single command:

```bash
npm run dev
```

- The **Frontend** will start at: `http://localhost:3000`
- The **Backend** API will start at: `http://localhost:5000`

## 🎨 Design Philosophy

HN BlogSphere uses a dark-mode first design philosophy characterized by deep purple and blue neon accents. The layout strictly avoids external CSS frameworks, relying entirely on a robust custom CSS design system located in `index.css`. This ensures maximum control over responsive fluid layouts, smooth transitions, and hover effects across all devices.

## 📝 License

This project is licensed under the MIT License.
