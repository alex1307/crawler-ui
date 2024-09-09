#!/bin/bash

# Define the remote server details and SSH key path
REMOTE_USER="root"
REMOTE_HOST="68.183.3.134"
SSH_KEY_PATH="~/.ssh/digital_ocean_ssh_key.key"
REMOTE_DIR="/crawler-ui"  # The directory where your UI app is deployed
REPO_URL="https://github.com/yourusername/your-repo.git"  # Update with your Git repository URL
SERVICE_NAME="crawler-ui"  # The name of your app in PM2

# Install Vite on the remote server (if not installed)
echo "Installing Vite on the remote server..."
ssh -i $SSH_KEY_PATH $REMOTE_USER@$REMOTE_HOST << EOF
  npm install -g vite
  exit
EOF

# SSH into the remote machine and execute the deployment commands
echo "Deploying UI app on the remote server..."
ssh -i $SSH_KEY_PATH $REMOTE_USER@$REMOTE_HOST << EOF
  # Navigate to the deployment directory
  cd $REMOTE_DIR

  # Stop the PM2 service for the UI app
  echo "Stopping $SERVICE_NAME service..."
  pm2 stop $SERVICE_NAME || true  # Stop the service if it's running, ignore errors if it's not

  # Pull the latest changes from the Git repository
  echo "Pulling latest changes from Git..."
  git pull $REPO_URL

  # Upgrade dependencies and build the project
  echo "Upgrading dependencies and building the project..."
  yarn upgrade
  yarn build

  # Optional: Copy assets if necessary
  echo "Copying static assets..."
  yarn copy-assets
  node copy-static-files.js

  # Start the PM2 service for the UI app
  echo "Starting $SERVICE_NAME service..."
  pm2 start dist --name $SERVICE_NAME -- serve -s build # Ensure PM2 serves the correct directory

  # Save PM2 state
  pm2 save

  exit
EOF

echo "Deployment completed on $REMOTE_HOST."