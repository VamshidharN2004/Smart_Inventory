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

## Step 4: AWS Deployment (EC2 Method)
The easiest way to deploy `docker-compose` on AWS is using an **EC2 Instance**.

### 1. Launch Instance
1.  Go to **AWS Console** -> **EC2** -> **Launch Instance**.
2.  **Name**: `Inventory-Server`
3.  **OS**: `Ubuntu 24.04 LTS` (or latest).
4.  **Instance Type**: `t3.small` (Recommended min 2GB RAM).
5.  **Key Pair**: Create a new one, download the `.pem` file.
6.  **Network Settings (Security Groups)**:
    *   Allow **SSH** (Port 22).
    *   Allow **HTTP** (Port 80) is not enough, we need custom ports.
    *   **Edit Inbound Rules**: Add Custom TCP Rule for Port **3000** (Frontend) and **8080** (Backend).

### 2. Connect to Instance
Open your local terminal (where the `.pem` key is):
```powershell
# Fix permissions (Mac/Linux only, on Windows just skip)
chmod 400 key.pem

# SSH into the server (replace IP with your EC2 Public IP)
ssh -i "key.pem" ubuntu@12.34.56.78
```

### 3. Install Docker on EC2
Run these commands inside the EC2 terminal:
```bash
# Update and install Docker
sudo apt-get update
sudo apt-get install -y docker.io docker-compose

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group (so you don't need sudo)
sudo usermod -aG docker $USER
```
*(You might need to type `exit` and ssh in again for the group change to take effect)*

### 4. Deploy Code
```bash
# Clone your repo
git clone https://github.com/VamshidharN2004/Smart_Inventory.git
cd Smart_Inventory

# Create .env file with your secrets
nano .env
# (Paste your MYSQL_ROOT_PASSWORD, MYSQL_DATABASE, and ALLOWED_ORIGIN here)
# Press Ctrl+X, then Y, then Enter to save.

# Start the app
docker-compose up -d --build
```
Your app is now live at `http://<EC2-PUBLIC-IP>:3000`!

