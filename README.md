<div align="center">  
<img src="https://raw.githubusercontent.com/shayanblaze/roomifychat/main/client/public/hero-image.png" alt="RoomifyChat Logo" width="200" />  
<h1>RoomifyChat 💬</h1>  
<p><strong>A modern, real-time chat application built with the MERN stack and Socket.IO.</strong></p>  
<p>Seamless Conversations, Perfectly Connected.</p>  
</div>

**RoomifyChat** is a feature-rich, real-time chat application designed to provide a seamless, secure, and engaging communication experience. Built with a robust MERN stack (MongoDB, Express.js, React, Node.js) and integrated with Socket.IO, this project offers a powerful platform for both private and group conversations.

## **✨ Key Features**

- ⚡️ **Real-Time Messaging:** Instant message delivery using WebSockets for a fluid user experience.
- 🔐 **User Authentication:** Secure user registration, login, and profile management with JWT-based authentication.
- 👥 **Private & General Chat:** Supports one-on-one private conversations and a global "general" chat room for all users.
- 🖼️ **Image Uploads:** Users can upload and share images within conversations, powered by Cloudinary.
- 🟢 **Presence Indicators:**
  - See which users are currently **online**.
  - View the **last seen** time for offline users.
  - See when another user is **typing** a message in real-time.
- 🚀 **Advanced Messaging Features:**
  - **Edit & Delete** your own messages.
  - **Reply** to specific messages to maintain context.
  - **Read Receipts** to see when your messages have been delivered and read.
- 📱 **Modern & Responsive UI:** A sleek, user-friendly interface built with React and Tailwind CSS, fully responsive across all devices.
- 🛡️ **Security:** Implemented with secure practices, including password hashing (bcrypt), protected API routes, and secure cookie handling.

## **🛠️ Tech Stack**

The project is built as a monorepo with a separate client and server.

### **🖥️ Frontend (Client-Side)**

| Technology           | Description                                                         |
| :------------------- | :------------------------------------------------------------------ |
| **React**            | A powerful JavaScript library for building dynamic user interfaces. |
| **Vite**             | A fast and modern build tool for web development.                   |
| **React Router**     | For declarative routing within the single-page application.         |
| **Tailwind CSS**     | A utility-first CSS framework for rapid UI development.             |
| **Socket.IO Client** | Enables real-time, bidirectional communication with the server.     |
| **Axios**            | A promise-based HTTP client for making API requests.                |
| **Framer Motion**    | For creating fluid and complex animations.                          |
| **React Hot Toast**  | For adding beautiful, non-intrusive notifications.                  |

### **⚙️ Backend (Server-Side)**

| Technology     | Description                                                        |
| :------------- | :----------------------------------------------------------------- |
| **Node.js**    | A JavaScript runtime for building the server-side application.     |
| **Express.js** | A minimal and flexible web application framework for Node.js.      |
| **MongoDB**    | A NoSQL database for storing user, message, and conversation data. |
| **Mongoose**   | An Object Data Modeling (ODM) library for MongoDB and Node.js.     |
| **Socket.IO**  | Enables real-time, event-based communication.                      |
| **JWT**        | For secure user authentication and authorization.                  |
| **Bcrypt.js**  | A library for hashing user passwords.                              |
| **Cloudinary** | A cloud service for managing image uploads and storage.            |
| **Multer**     | A middleware for handling multipart/form-data for file uploads.    |

## **🚀 Getting Started**

Follow these instructions to set up and run the project on your local machine.

### **Prerequisites**

- **Node.js**: Version 18.x or higher.
- **MongoDB**: An active MongoDB instance (local or cloud via MongoDB Atlas).
- **Cloudinary Account**: Required for image upload functionality.

### **1\. Clone the Repository**

First, clone the project from GitHub:

git clone https://github.com/shayanblaze/roomifychat.git  
cd roomifychat

### **2\. Install Dependencies**

This project is a monorepo. To install dependencies for both the client and server, run the following command from the root directory:

npm install \--prefix server && npm install \--prefix client

### **3\. Configure Environment Variables**

Create a .env file in both the /server and /client directories by copying the respective .env.example files.

#### **🔹 Server Configuration (/server/.env)**

\# Client URL for CORS  
CLIENT_URL=http://localhost:5173  
DEV_URL=http://127.0.0.1:5173

\# MongoDB Connection URI  
MONGO_URI=your_mongodb_connection_string

\# Secret key for JWT generation  
JWT_SECRET=your_super_secret_jwt_key

\# Port for the server  
PORT=3000

\# Cloudinary Account Credentials  
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name  
CLOUDINARY_API_KEY=your_cloudinary_api_key  
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

#### **🔹 Client Configuration (/client/.env)**

\# Base URL for the backend API  
VITE_API_BASE_URL=http://localhost:3000

### **4\. Run the Application**

To run both the client and server concurrently in development mode, use the following command from the **root directory**:

npm run dev

This will start:

- The backend server on http://localhost:3000
- The React client on http://localhost:5173

You can now open your browser and navigate to http://localhost:5173 to use the application.

## **📜 Available Scripts**

The following scripts are available in the root package.json:

- **npm run dev**: Starts both the client and server in development mode.
- **npm run start**: Starts the server in production mode (requires a prior build).
- **npm run build**: Builds the client application for production.
