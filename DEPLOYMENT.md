# Deployment Guide for Render

## Prerequisites

1. A Render account (https://render.com)
2. Your code pushed to a GitHub repository
3. MongoDB Atlas database (your current setup)

## Deployment Steps

### 1. Prepare Your Repository

Make sure your code is pushed to GitHub with all the recent changes.

### 2. Create a New Web Service on Render

1. Go to your Render dashboard
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Select the repository: `library-management-system`

### 3. Configure the Service

**Basic Settings:**
- **Name**: `library-management-system-backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 4. Environment Variables

Add the following environment variables in Render:

**Required:**
- `NODE_ENV`: `production`
- `DATABASE_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: A secure random string (Render can auto-generate this)
- `JWT_EXPIRES_IN`: `7d`

**Optional:**
- `PORT`: Render will set this automatically, but you can override if needed

### 5. MongoDB Atlas Configuration

1. In your MongoDB Atlas dashboard, go to Network Access
2. Add Render's IP ranges or use `0.0.0.0/0` (less secure but simpler)
3. Make sure your database user has read/write permissions

### 6. Frontend CORS Configuration

After deployment, update the CORS configuration in `app.js`:

```javascript
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://your-frontend-app.onrender.com", // Add your actual frontend URL
];
```

### 7. Deploy

1. Click "Create Web Service"
2. Render will automatically build and deploy your application
3. Monitor the build logs for any errors

### 8. Test Your Deployment

Once deployed, your API will be available at:
`https://your-service-name.onrender.com`

Test the health endpoint:
`https://your-service-name.onrender.com/health`

## Important Notes

- **Free Tier Limitations**: Render's free tier spins down after 15 minutes of inactivity
- **Cold Starts**: First request after sleep may take 30+ seconds
- **Environment Variables**: Never commit sensitive data like database URIs or JWT secrets to your repository
- **Logging**: Check Render logs for debugging deployment issues

## Troubleshooting

### Common Issues:

1. **Build Fails**: Check if all dependencies are in `package.json`
2. **Service Won't Start**: Verify environment variables are set correctly
3. **Database Connection Fails**: Check MongoDB Atlas network access and connection string
4. **CORS Errors**: Update allowed origins with your frontend URL

### Checking Logs:

1. Go to your service dashboard on Render
2. Click on "Logs" tab to see runtime logs
3. Check "Events" tab for deployment history

## Additional Recommendations

1. **Custom Domain**: Configure a custom domain for production
2. **SSL**: Render provides SSL certificates automatically
3. **Monitoring**: Set up health checks and monitoring
4. **Scaling**: Consider upgrading to paid plans for better performance
5. **Database Backup**: Ensure MongoDB Atlas backups are configured
