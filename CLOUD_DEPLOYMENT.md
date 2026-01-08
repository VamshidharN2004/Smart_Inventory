# Cloud Deployment Guide

This guide explains how to deploy the **Inventory Service** to a cloud provider.

## Prerequisites
- A GitHub account.
- A Cloud Provider account (e.g., Render, Railway, DigitalOcean).

## Step 1: Push to GitHub
1.  Create a new repository on GitHub.
2.  Push your code:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/VamshidharN2004/Smart_Inventory.git
    git push -u origin main
    ```

## Step 2: Environment Variables
**NEVER** commit your `.env` file to GitHub. Instead, you must set these variables in your Cloud Provider's "Environment" or "Secrets" settings:

| Variable | Value (Example) | Description |
| :--- | :--- | :--- |
| `MYSQL_ROOT_PASSWORD` | `s3cr3t_p4ssw0rd` | Strong password for DB root user. |
| `MYSQL_DATABASE` | `new_inventory` | Name of the database. |
| `ALLOWED_ORIGIN` | `https://your-app-name.onrender.com` | The URL of your deployed Frontend. |

## Step 3: Deploying with Docker Compose
Most providers (like Railway or DigitalOcean App Platform) support deploying directly from `docker-compose.yml`.

### Example: Railway.app
1.  Connect your GitHub repo.
2.  Railway will detect `docker-compose.yml`.
3.  Go to the "Variables" tab and add the 3 variables listed above.
4.  Railway will build and deploy the services.

### Example: Render.com
Render is great but requires defining a `render.yaml` or deploying services individually (1 for Backend, 1 for Frontend, 1 for Managed DB).
*   **Easier Path**: Use a generic "Docker" service type pointing to your repo and specifying the Dockerfile path.

## Local Testing
To test if your environment variables work locally:
1.  Edit `.env` (it is ignored by git).
