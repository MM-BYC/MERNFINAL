# SnapNote

**A personal note-taking and task management web application.**
Organize your thoughts, tasks, and lists into cards — accessible from any device, any browser.

SnapNote is a MERN full-stack note management app built rapidly in just a couple of days with AI-assisted coding, not weeks or months. It includes user authentication, email verification, password reset, dark/light mode, and an interactive dashboard for creating, editing, organizing, and deleting notes with a polished responsive UI.

🔗 **Live App:** [https://mernfinal-kxun.onrender.com](https://mernfinal-kxun.onrender.com)

---

## Table of Contents

1. [What Is SnapNote?](#what-is-snapnote)
2. [Getting Started](#getting-started)
3. [How the Pages Connect](#how-the-pages-connect)
4. [Cards and Items](#cards-and-items)
5. [Data Structure](#data-structure)
6. [Account & Security](#account--security)

---

## What Is SnapNote?

SnapNote is a web-based notes app where each **Note** is a card on your dashboard. Each card holds a title and a list of items underneath it. You can create as many cards as you need, add items to them, move items between cards by dragging, and delete what you no longer need.

Everything is tied to your personal account — no one else can see your notes.

---

## Getting Started

| Step | Action |
|------|--------|
| 1 | Go to the app URL and click **Sign Up** |
| 2 | Enter your First Name, Last Name, Email, and a Password |
| 3 | Check your email inbox and click the verification link |
| 4 | Return to the app and **Log In** |
| 5 | You land on your **Dashboard** — your notes workspace |

> **Note:** Your email must be verified before you can log in. This is a one-time step.

---

## How the Pages Connect

```
                        ┌─────────────────────┐
                        │     Landing Page     │
                        │  (Sign Up / Log In)  │
                        └────────┬────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                                     │
        ┌─────▼──────┐                      ┌──────▼──────┐
        │  Sign Up   │                      │   Log In    │
        │   Form     │                      │   Form      │
        └─────┬──────┘                      └──────┬──────┘
              │                                    │
              │  Submit → Email sent               │ Submit → Token issued
              │                                    │
        ┌─────▼──────────────┐                     │
        │  Check Your Email  │                     │
        │  (Verify Account)  │                     │
        └─────┬──────────────┘                     │
              │                                    │
              │  Click link in email               │
              │                                    │
        ┌─────▼──────────────┐                     │
        │  Email Verified    │                     │
        │  (Redirect to app) │                     │
        └─────┬──────────────┘                     │
              │                                    │
              └──────────────┬─────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   Dashboard     │
                    │  (Your Notes)   │
                    └────────┬────────┘
                             │
              ┌──────────────┼────────────────┐
              │              │                │
       ┌──────▼──────┐  ┌───▼──────┐  ┌──────▼──────┐
       │  + New Note │  │  Cards   │  │  Log Out    │
       │   (Modal)   │  │ & Items  │  │             │
       └─────────────┘  └──────────┘  └─────────────┘

     Forgot Password Flow (from Log In page):
     Log In → Forgot Password → Email sent → Reset Password page → Log In
```

---

## Cards and Items

### The Dashboard

When you log in, you see your dashboard — a grid of cards. Each card represents one **Note** (e.g., "Grocery List", "Work Tasks", "Ideas").

### Creating a Card

Click **+ New Note** in the toolbar. A modal window appears. Enter a title and an optional first item, then click **Add Note**. The card appears on your dashboard immediately.

### Adding Items to a Card

Inside any card, type into the input field at the bottom of the card and click **+ Add Item**. The item appears as a line inside the card.

### Dragging Items Between Cards

- **Pick up:** Click and hold any item, then drag it over a different card.
- **Drop:** Release it on the target card — the item moves there instantly.
- Each item can only exist in one card at a time. Dragging does not duplicate it.

### Deleting Items

Check the checkbox next to any item (or multiple items), then click the **delete** button on that card. Checked items are removed. If all items in a card are deleted, the card is also removed.

### Deleting a Card

Use the delete button on the card header to remove the entire card and all its items at once.

---

## Data Structure

SnapNote stores data in two MongoDB collections: **Users** and **Notes**.

---

### Collection: `users`

Stores one document per registered account.

| Field | Type | Description |
|-------|------|-------------|
| `firstname` | String · Required | User's first name |
| `lastname` | String · Required | User's last name |
| `email` | String · Required · Unique | Login email (stored lowercase) |
| `password` | String · Required · Min 3 chars | Stored as a secure hash (never plain text) |
| `isVerified` | Boolean · Default: `false` | Becomes `true` after email verification |
| `verificationToken` | String | Temporary token sent in the verification email |
| `resetPasswordToken` | String | Temporary token for password reset |
| `resetPasswordExpires` | Date | Expiry timestamp for the reset token (1 hour) |
| `createdAt` | Date · Auto | When the account was created |
| `updatedAt` | Date · Auto | Last time the account record was modified |

> Passwords are never stored in plain text. They are encrypted using bcrypt before being saved.

---

### Collection: `notes`

Stores one document per card. Each card belongs to one user.

| Field | Type | Description |
|-------|------|-------------|
| `title` | String · Required | The card's heading (e.g., "Grocery List") |
| `bodies` | Array of Objects | The list of items inside the card |
| `bodies[].text` | String | The text of a single item |
| `bodies[]._id` | ObjectId · Auto | Unique identifier for each item |
| `user` | ObjectId · Ref: User | Links the card to its owner's account |

**Example card document:**
```json
{
  "title": "Grocery List",
  "bodies": [
    { "_id": "abc123", "text": "Milk" },
    { "_id": "def456", "text": "Eggs" },
    { "_id": "ghi789", "text": "Bread" }
  ],
  "user": "user_object_id_here"
}
```

---

## Account & Security

### Email Verification
After signing up, the app sends a verification link to your email. You must click it before you can log in. This prevents fake accounts.

### Session Tokens
Once logged in, the app issues a **JWT (JSON Web Token)** that lasts 24 hours. You stay logged in automatically during that window. After 24 hours, you will be asked to log in again.

### Forgot Password
On the Log In page, click **Forgot Password**. Enter your email. If an account exists, a reset link is sent. The link is valid for **1 hour**. After clicking it, you can set a new password and log in.

### Log Out
Click **Log Out** on the dashboard to end your session immediately. Your notes remain saved and will be there when you log back in.

### Theme
The app supports **Light**, **Dark**, and **System** (follows your device setting) display modes. Click the theme toggle in the top-left corner of any page to switch.

---

## Project Structure

```text
thanosCompleted/
├── backend/                        # Server-side application (Node.js + Express)
│   ├── server.js                   # Entry point — starts the server, registers all routes
│   ├── package.json                # Backend dependencies (express, mongoose, bcrypt, jwt, etc.)
│   ├── config/
│   │   ├── connectToDb.js          # Establishes the MongoDB database connection
│   │   ├── checkToken.js           # Middleware — reads and validates the JWT on every request
│   │   ├── ensureLoggedIn.js       # Middleware — blocks unauthenticated requests to protected routes
│   │   └── emailService.js         # Sends verification and password reset emails via third-party service
│   ├── controllers/
│   │   ├── notesController.js      # Handles all note operations: create, read, update, delete, move items
│   │   └── usersController.js      # Handles signup, login, email verification, and password reset
│   └── models/
│       ├── user.js                 # MongoDB schema for user accounts (name, email, password hash, tokens)
│       └── note.js                 # MongoDB schema for notes/cards (title, items list, owner reference)
│
└── frontend/                       # Client-side application (React + Vite)
    ├── index.html                  # Root HTML file — Vite injects the React bundle here
    ├── vite.config.js              # Vite build configuration and local dev proxy settings
    ├── package.json                # Frontend dependencies (react, react-router-dom, axios, etc.)
    ├── eslint.config.js            # Code quality rules for the frontend
    ├── public/
    │   └── vite.svg                # Static assets served as-is (not processed by Vite)
    └── src/                        # All React source code
        ├── main.jsx                # React entry point — mounts the app and defines page routes
        ├── App.jsx                 # Root component — controls dashboard, modal, and note state
        ├── App.css                 # All application styles including glassmorphism and theme variables
        ├── index.css               # Base browser resets and font settings
        ├── assets/                 # Images and static files used inside components
        ├── components/
        │   ├── Index.jsx           # Renders the full grid of note cards
        │   ├── Note.jsx            # Individual card — displays title, items, drag-and-drop, delete
        │   ├── SignUpForm.jsx       # Create account form
        │   ├── LoginForm.jsx        # Log in form
        │   ├── SnapNoteBrand.jsx   # Animated brand title with parallax effect
        │   ├── ThemeToggle.jsx     # Light / Dark / System theme switcher
        │   ├── DateDisplay.jsx     # Live date display shown on the dashboard
        │   ├── Navbar.jsx          # Navigation bar component
        │   └── Profile.jsx         # User profile display component
        ├── pages/
        │   ├── AuthPage.jsx        # Sign Up / Log In toggle page
        │   ├── VerifyEmailPage.jsx  # Handles the email verification link from inbox
        │   ├── ForgotPasswordPage.jsx  # Forgot password request form
        │   └── ResetPasswordPage.jsx   # New password entry form (from reset email link)
        └── utilities/
            ├── users-service.js    # Business logic for auth: getUser, logOut, signUp, login
            ├── users-api.js        # API call definitions for user-related endpoints
            └── send-request.js     # Base HTTP request helper used by all API calls
```

---

*Built with MongoDB · Express · React · Node.js*
