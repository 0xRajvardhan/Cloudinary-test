
# Image Vault Express

A modern web application for uploading, storing, and managing images with React, Node.js, Express, Cloudinary, and MongoDB.

## Features

- Upload up to three images simultaneously
- Real-time upload progress tracking
- Image preview functionality
- Secure storage with Cloudinary
- MongoDB database for image references
- Responsive design with Tailwind CSS

## Prerequisites

- Node.js and npm installed
- MongoDB instance (local or Atlas)
- Cloudinary account

## Setup Instructions

### Backend Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. Start the backend server:
   ```
   node server.js
   ```

### Frontend Setup

1. Start the React development server:
   ```
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:8080`

## API Endpoints

- `POST /api/images/upload-url` - Get a pre-signed URL for Cloudinary upload
- `POST /api/images/save` - Save image metadata after Cloudinary upload
- `GET /api/images` - Get all uploaded images

## Technology Stack

- **Frontend:**
  - React with TypeScript
  - Tailwind CSS
  - Axios for API calls
  - shadcn/ui components

- **Backend:**
  - Node.js
  - Express
  - MongoDB with Mongoose
  - Cloudinary for image storage

## How It Works

1. User selects up to three images through the UI
2. Frontend requests pre-signed URLs from the backend
3. Images are uploaded directly to Cloudinary using the pre-signed URLs
4. After successful upload, image metadata is saved to MongoDB
5. Images are displayed in the gallery section

## License

MIT
