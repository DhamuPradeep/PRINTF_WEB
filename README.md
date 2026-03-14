# Printf Website

A dynamic e-commerce website with branding and personalization features.

## Project Structure

- `frontend/`: React + Vite frontend application.
- `backend/`: Express + MongoDB (Mongoose) backend application.

## Prerequisites

- Node.js installed on your system.
- `npm` (Node Package Manager).

## How to Run

### 1. Start the Backend

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node server.js
   ```
   The backend will run on `http://localhost:5000`.

### 2. Start the Frontend

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The website will be accessible via the URL provided by Vite (usually `http://localhost:5173`).

## Admin Credentials

- **Username**: `admin`
- **Password**: `admin123`
  *(Note: Password can be customized in `backend/.env`)*

## Database Setup (MongoDB Atlas)

To get your `MONGODB_URI`:

1.  **Create an Account**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up.
2.  **Create a Cluster**: Deploy a free shared cluster (M0).
3.  **Create a Database User**:
    - Go to **Database Access**.
    - Add a new user with a username and password.
    - Set the role to **Read and write to any database**.
4.  **Whitelist your IP**:
    - Go to **Network Access**.
    - Add your current IP address (or `0.0.0.0/0` to allow access from anywhere, common for hosting).
5.  **Get Connection String**:
    - Go to **Database** -> **Connect**.
    - Choose **Drivers** (Node.js).
    - Copy the connection string. It looks like:
      `mongodb+srv://<username>:<password>@cluster0.abc.mongodb.net/?retryWrites=true&w=majority`
6.  **Update `.env`**:
    - Open `backend/.env`.
    - Replace the placeholder `MONGODB_URI` with your actual string.
    - **Note**: Replace `<password>` with the password you created for the database user.

## Hosting (Free Tier)

### Frontend (Deploys to Vercel/Netlify)
1. Push the code to a GitHub repository.
2. Link the repository to Vercel/Netlify.
3. Set the `VITE_API_URL` environment variable if needed.

### Backend (Deploys to Render)
1. Link the same repository to Render.
2. Set the root directory to `backend`.
3. Build command: `npm install`.
4. Start command: `node server.js`.
5. **Environment Variables**:
   - `JWT_SECRET`: Your secret key.
   - `ADMIN_USERNAME`: Your admin user.
   - `ADMIN_PASSWORD`: Your admin pass.

> [!IMPORTANT]
> This project now uses **MongoDB Atlas** for persistent storage. Ensure you have your `MONGODB_URI` set in the `.env` file or as an environment variable in your hosting provider.
