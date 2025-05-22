# Recipe Keeper Application

## Overview

This is a full-stack recipe management application built with React on the frontend and Express on the backend. The application allows users to create, view, edit, and delete recipes, with support for categorization, searching, and image uploads. The application uses Drizzle ORM for database operations, with a schema designed for recipe storage.

## User Preferences

```
Preferred communication style: Simple, everyday language.
```

## System Architecture

The application follows a client-server architecture with a clear separation between frontend and backend:

1. **Frontend**: React application with UI components built using shadcn/ui (based on Radix UI) and styled with Tailwind CSS
2. **Backend**: Express server that handles API requests and serves the React application
3. **Database**: Drizzle ORM with PostgreSQL (configured but not explicitly implemented yet)
4. **File Storage**: Local file system for recipe image uploads

The application is structured in a monorepo style with clear separation between client, server, and shared code.

## Key Components

### Frontend (`client/`)

- **React Application**: Main UI built with React 
- **Component Library**: Uses shadcn/ui components based on Radix UI primitives
- **Styling**: Tailwind CSS for styling with a custom color scheme
- **State Management**: 
  - React Query for server state (fetching, caching, updating)
  - React Hook Form for form management
  - Local state for UI components
- **Routing**: Uses wouter for lightweight routing
- **Pages**:
  - Home page (`home.tsx`) - Lists all recipes with filtering by category
  - View Recipe page (`view-recipe.tsx`) - Displays detailed recipe information
  - Edit Recipe page (`edit-recipe.tsx`) - Form for editing recipes
  - Not Found page (`not-found.tsx`)

### Backend (`server/`)

- **Express Server**: Handles API routes and serves the frontend
- **Storage**: Interface for database operations defined in `storage.ts`
- **Routes**: API endpoints defined in `routes.ts`
- **File Handling**: Multer for handling image uploads

### Shared (`shared/`)

- **Schema**: Database schema and validation rules with Drizzle and Zod
- **Types**: Shared TypeScript types between frontend and backend

## Data Flow

1. **Recipe Creation**:
   - User fills out recipe form on frontend
   - Form data is validated with Zod schemas
   - Data is sent to backend API
   - Backend processes data and stores it in the database
   - If successful, user is redirected to view the new recipe

2. **Recipe Retrieval**:
   - Frontend requests recipes from API endpoints (`/api/recipes`)
   - Backend retrieves data from database and returns it as JSON
   - Frontend displays recipes using React Query for data fetching/caching
   - Support for filtering by category and searching

3. **Image Uploads**:
   - Images are uploaded via Multer middleware
   - Stored in the filesystem at `/dist/public/uploads`
   - Image URLs are stored in the database

## External Dependencies

### Frontend
- **@radix-ui/react-*** - UI primitive components
- **@tanstack/react-query** - Data fetching and caching
- **react-hook-form** - Form management
- **wouter** - Routing
- **tailwindcss** - Styling
- **class-variance-authority** - Component variants
- **date-fns** - Date formatting

### Backend
- **express** - Web server
- **multer** - File uploads
- **drizzle-orm** - Database ORM
- **zod** - Schema validation

## Database Schema

The application uses two main tables:

1. **users** - Stores user information:
   - id (primary key)
   - username (unique)
   - password

2. **recipes** - Stores recipe information:
   - id (primary key)
   - title
   - description
   - category (one of: breakfast, lunch, dinner, desserts, drinks, other)
   - cookTimeMinutes
   - ingredients (stored as JSON array)
   - steps (stored as JSON array)
   - notes (optional)
   - imageUrl (optional)
   - createdAt

## Deployment Strategy

The application is configured for deployment in Replit with:

1. **Development Mode**:
   - Uses `npm run dev` to start both frontend and backend
   - Vite for hot module reloading

2. **Production Build**:
   - Frontend built with Vite (`vite build`)
   - Backend compiled with esbuild
   - Static assets served by Express from the `dist/public` directory

The application is configured to connect to a PostgreSQL database via environment variables, with Drizzle handling the database schema and migrations.

## Potential Future Enhancements

1. **Authentication**: Fully implement the user authentication system
2. **Favorites**: Add ability to favorite recipes (UI components exist but not implemented)
3. **User Profiles**: Allow users to create profiles and share recipes
4. **Advanced Search**: Enhance search capabilities for ingredients and more granular filtering
5. **Rating System**: Add ability to rate recipes
6. **API Documentation**: Add Swagger/OpenAPI documentation for the API endpoints