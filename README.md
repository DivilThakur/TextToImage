# 🎨 Zex.ai — Text to Image Generator using ClipDrop API

Zex.ai is a full-stack web application that transforms **user text prompts into AI-generated images** using the powerful [ClipDrop API](https://clipdrop.co/apis). Built with **React** for the frontend and **Node.js** for the backend, the app offers a simple and intuitive way to generate images from natural language input.

## ✨ Features

- 🔤 Convert user input into high-quality images
- 🚀 Fast generation using ClipDrop’s AI API
- ⚛️ React frontend + Node.js backend
- 🌐 Deployed live on Vercel

## 🚀 Live Demo

👉 **[Try Zex.ai Now](https://ai-project-blue.vercel.app/)**  
<!-- Replace the above link with your actual Vercel URL -->

## 🛠️ Tech Stack

- **Frontend**: React, Vite
- **Backend**: Node.js, Express
- **API**: [ClipDrop Text-to-Image](https://clipdrop.co/apis)
- **Hosting**: Vercel (frontend), Render/Local (backend)

## 📦 Installation & Running Locally

1. **Clone the repository**

```bash
git clone https://github.com/DivilThakur/zex.ai.git
cd zex.ai

## Backend Setup

cd backend
npm install
npm start

## Frontend Setup

cd frontend
npm install
npm run dev
```

## 🔧 2. ENV Setup  

Before running the project, create a `.env` file in both **backend** and **frontend** directories.  

### 📂 Backend (`/backend/.env`)  

```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_DB_URL=your_mongodb_connection_url

# ClipDrop API
CLIPDROP_API_KEY=your_clipdrop_api_key

# JWT
JWT_SECRET=your_jwt_secret

# Razorpay
RAZORPAY_API_KEY=your_razorpay_api_key
RAZORPAY_SECRET=your_razorpay_secret
CURRENCY=INR

# Email (for OTP / Forgot Password system)
USER_EMAIL=your_email@example.com
USER_PASSWORD=your_email_password_or_app_password
```
### 📂 Frontend (`/frontend/.env`)
```env
VITE_BACKEND_URL=http://localhost:5000   # or your deployed backend URL
VITE_RAZORPAY_API_KEY=your_razorpay_api_key
```

## 🙌 Acknowledgements
Thanks to the ClipDrop team for providing such an amazing API.

Built with ❤️ by Divil Thakur
