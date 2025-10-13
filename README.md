# 🌿 EcoSort - AI Waste Classification System

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16.x+-green.svg)](https://nodejs.org/)
[![Gemini API](https://img.shields.io/badge/Gemini-2.0%20Flash-orange.svg)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An intelligent waste management web application that leverages **Google Gemini's vision AI** to instantly classify waste items, determine recyclability, and provide proper disposal guidance.

> 🎓 Built as a full-stack hackathon project demonstrating AI integration, computer vision, and sustainable technology.

![EcoSort Demo](https://via.placeholder.com/800x400/4ade80/ffffff?text=EcoSort+Demo+Screenshot)

---

## 🎯 Problem Statement

Improper waste disposal leads to recycling contamination and environmental damage. Many people are unsure which bin to use for different waste items, resulting in recyclable materials ending up in landfills.

## 💡 Solution

EcoSort uses AI-powered image recognition to:
- **Instantly identify** waste materials from photos
- **Classify items** into 8 categories (Plastic, Paper, Metal, Glass, Organic, E-waste, Textile, Mixed)
- **Determine recyclability** and provide bin color recommendations
- **Educate users** with practical disposal tips

---

## ✨ Key Features

### 🤖 AI-Powered Classification
- Real-time waste identification using Google Gemini 2.0 Flash
- 85-90% accuracy on common household items
- Multi-model fallback system for high availability

### 📸 Flexible Image Input
- Upload photos from device
- Capture images using built-in camera
- Supports JPEG and PNG formats (up to 4MB)

### 🎨 Smart Bin Recommendations
- Color-coded disposal guidance:
  - 🟢 **Green**: Organic/Compostable waste
  - 🔵 **Blue**: Paper and cardboard
  - 🟡 **Yellow**: Plastic and metal
  - 🔴 **Red**: General/non-recyclable waste

### 💡 Educational Tips
- Practical recycling tips for each item
- Similar item examples for context
- Recyclability status (Yes/No)

### 🎨 Modern User Interface
- Responsive design for all devices
- Smooth animations and transitions
- Clean, intuitive layout
- Dark mode support

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **TailwindCSS** for modern styling
- **React Router** for navigation
- **MediaDevices API** for camera integration

### Backend
- **Node.js** with Express framework
- **Google Generative AI SDK** for Gemini integration
- **RESTful API** architecture
- **CORS** enabled for cross-origin requests

### AI/ML
- **Google Gemini 2.0 Flash** (1,500 free requests/day)
- Base64 image encoding
- Structured JSON responses
- Multi-model fallback system

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:
- **Node.js** v16 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Google Gemini API key** ([Get free key](https://aistudio.google.com/apikey))

### Installation

1. **Clone the repository**
