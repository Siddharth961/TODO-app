# TODO App

## Overview

TODO is a web-based note-taking application designed for creating and managing small notes quickly. It utilizes real-time updates, allowing users to seamlessly create, edit, and delete notes with automatic page reloads. The app is built using HTML, CSS, Bootstrap, JavaScript, Node.js, Express.js, and MongoDB.

## Features

- **User Authentication:** Secure user authentication system with signup, login, and password functionalities using JSON Web Tokens (JWT).
- **CRUD Operations:** Users can create, read, update, and delete notes with real-time updates for immediate changes.
- **Real-Time Updates:** Home page automatically reloads when a note is created, edited, or deleted.
- **Security Measures:** User password encryption, enhanced security with npm packages (`helmet`, `xss-clean`, `express-rate-limiter`, `express-mongo-sanitizer`, `hpp`), and adherence to security best practices.

## Getting Started

### Prerequisites

Make sure you have Node.js and npm installed.

```bash
# Install dependencies
npm install
```
### Installation
```bash
# Clone the repository
git clone https://github.com/Siddharth961/TODO-app.git
```
### Make sure you setup your config variables
- NODE_ENV
- PORT
- USER
- DATABASE
- DATABASE_PASSWORD 

- JWT_SECRET 
- JWT_EXPIRES_IN 
- JWT_COOKIE_EXPIRES_IN 

// mail variables for development phase
- MAIL_USER 
- MAIL_PASS 
- MAIL_HOST 
- MAIL_PORT 

// mail variables for production phase
- GMAIL_USER 
- GMAIL_PASS

### Usage
Visit http://localhost:3000 in your web browser to access the application. Create an account, log in, and start managing your notes.

## Security Considerations
The application prioritizes security through user password encryption, proper authentication using JWT, and the implementation of security npm packages. These measures ensure the confidentiality and integrity of user data.
