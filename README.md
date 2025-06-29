# Band Project 🎸

Welcome to the **Band Project** – a real-time collaborative rehearsal platform for musicians! This full-stack web application allows users to join music sessions remotely, view lyrics and chords live, and rehearse songs together, all in sync. Built with **React**, **Node.js**, **Express**, **MongoDB**, and **Socket.IO**.

---

## Table of Contents

- [Project Description](#project-description)
- [Technologies Used](#technologies-used)
- [App Structure](#app-structure)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)

  - [Step 1: Clone the Repository](#step-1-clone-the-repository)
  - [Step 2: Setup the Server](#step-2-setup-the-server)
  - [Step 3: Setup the Client](#step-3-setup-the-client)
  - [Step 4: Run the App](#step-4-run-the-app)

- [Deployment](#deployment)
- [Features](#features)

---

## Project Description

Musicians in a band usually gather for rehearsals in one place. This project takes it online. The app lets users log in from their phones and connect to a shared session. An **admin** can control which song is shown, and players will see chords and lyrics synced on screen, with scrolling and visual clarity optimized for rehearsal environments.

---

## Technologies Used

- **Frontend**: React, React Router DOM, Axios, Socket.IO Client
- **Backend**: Node.js, Express, Mongoose, Socket.IO, JWT, bcrypt
- **Deployment**: Render
- **Data Base**: MongoDB

---

## App Structure

- `client/`: React frontend
- `server/`: Node.js + Express backend

---

## Prerequisites

Make sure the following are installed:

1. [Node.js](https://nodejs.org/) (v14 or later)
2. [Git](https://git-scm.com/)
3. [MongoDB Atlas account](https://www.mongodb.com/cloud/atlas)

---

## Installation and Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/YarinBenZimra/band-project.git
cd band-project
```

### Step 2: Setup the Server

```bash
cd server
npm install
```

#### Create a `.env` file in the `server` folder with:

```env
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret-key>
JWT_EXPIRE=<ttl-token>
ADMIN_SIGNUP_KEY=<your-admin-verification>
```

### Step 3: Setup the Client

```bash
cd ../client
npm install
```

#### Create a `.env` file in the `client` folder with:

```env
REACT_APP_API_URL=https://band-project.onrender.com
```

### Step 4: Run the App Locally

#### In the `server` folder:

```bash
npm run dev
```

#### In another terminal, in the `client` folder:

```bash
npm start
```

---

## Deployment

Both the **client** and **server** were deployed on **Render**:

- <a href="https://band-client.onrender.com" target="_blank">https://band-client.onrender.com</a>

---

## Features

- **Signup & Login**: Users can register and log in with a role (admin or player).
- **Admin Control**: Admins can create sessions, search for songs, and control what everyone sees.
- **Live Syncing**: Everyone connected sees the same song in real-time via Socket.IO.
- **Instrument-aware View**:

  - Vocalists: lyrics only
  - Instrumentalists: chords + lyrics

- **Automatic Scrolling**: Users can toggle auto-scroll.
- **Responsive UI**: Optimized for mobile rehearsal environments.

---

Enjoy playing together remotely! 🎶🎺🎹🎸🎷
