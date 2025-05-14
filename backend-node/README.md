# Task Manager Backend

A Node.js backend API for the Task Manager application.

## Deployment Options

### Option 1: Render.com (Recommended)

1. Create a free account at [Render.com](https://render.com/)
2. Click "New" and select "Web Service"
3. Connect your GitHub repository or provide the GitHub repository URL
4. Use the following settings:
   - Name: task-manager-backend
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `node server.js`
5. Add the following environment variables:
   - `PORT`: 8080
   - `NODE_ENV`: production
   - `JWT_SECRET`: <create a secure random string>
6. Click "Create Web Service"

### Option 2: Heroku

1. Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. Login to Heroku: `heroku login`
3. Create a new Heroku app: `heroku create task-manager-backend`
4. Deploy to Heroku:
   ```
   git subtree push --prefix backend-node heroku main
   ```
5. Set environment variables:
   ```
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=<your-secret-key>
   ```

### Option 3: Railway

1. Create a free account at [Railway.app](https://railway.app/)
2. Create a new project and select "Deploy from GitHub repo"
3. Connect your GitHub repository
4. Add the following environment variables:
   - `PORT`: 8080
   - `NODE_ENV`: production
   - `JWT_SECRET`: <create a secure random string>

## After Deployment

After your backend is deployed, you'll need to update the frontend configuration to use the new backend URL.

Edit `frontend/src/config.js` and update the production API URL to your deployed backend URL.

```javascript
production: {
  apiUrl: 'https://your-deployed-backend-url.com'
}
```

Then redeploy the frontend. 