# WellnessLink: Secure Wellness Session Platform

## Overview
WellnessLink is a full-stack web application designed to allow users to securely register, log in, view public wellness sessions, and manage their own custom wellness sessions. Users can draft and publish their sessions, with an auto-save feature for convenience.

## Features

* **User Authentication (JWT & bcrypt):** Secure user registration, login, and protected routes.
* **Session Management:**
    * Create, save as draft, and publish custom wellness sessions.
    * Each session includes: Title, Tags, JSON File URL (for content), and Status (draft/published).
    * Auto-save functionality for sessions as you type.
    * View all public (published) wellness sessions.
    * View and manage a logged-in user's own sessions (both drafts and published).
* **Search & Filtering:**
    * Search sessions by title or content.
    * Filter sessions by status (for user's own sessions) and date range.
* **Responsive UI:** Built with Tailwind CSS for a modern, sleek, and mobile-friendly experience.

## Tech Stack

### Backend
* **Node.js:** JavaScript runtime.
* **Express.js:** Web application framework for Node.js.
* **MongoDB:** NoSQL database (MongoDB Atlas preferred for cloud hosting).
* **Mongoose:** Object Data Modeling (ODM) library for MongoDB and Node.js.
* **jsonwebtoken (JWT):** For secure, stateless authentication.
* **bcryptjs:** For password hashing.
* **express-async-handler:** Simple wrapper for Express async middleware.
* **dotenv:** To manage environment variables.
* **cors:** For Cross-Origin Resource Sharing.

### Frontend
* **React.js:** JavaScript library for building user interfaces.
* **Vite:** Fast development build tool for modern web projects.
* **Tailwind CSS:** Utility-first CSS framework for rapid UI development and responsiveness.
* **React Router DOM:** For client-side routing.
* **Axios:** Promise-based HTTP client for API requests.
* **useDebounce (Custom Hook):** For implementing auto-save functionality.

## Setup Instructions

Follow these steps to get the project up and running on your local machine.


### 1. Clone the Repository

```bash
git clone https://github.com/yashwanth04112005/wellness-link
cd wellness-link

```
### 2. Run the Application
```bash
npm run build
npm start
```


## Live Demo: https://wellness-link.onrender.com/
