# BookMyShow Clone - MVP Implementation Plan

## Core Features (MVP)
1. **Movie Listing & Details** - Display movies with posters, details, showtimes
2. **Theater & Seat Selection** - Interactive seat map with real-time availability
3. **User Authentication** - Login/Register functionality
4. **Booking Flow** - Complete ticket booking process
5. **Payment Integration** - Mock payment processing
6. **Booking History** - User's past bookings
7. **Admin Panel** - Basic movie/theater management

## File Structure (8 files max)
1. **src/pages/Index.tsx** - Home page with movie listings
2. **src/pages/MovieDetails.tsx** - Movie details and showtime selection
3. **src/pages/SeatSelection.tsx** - Interactive seat booking interface
4. **src/pages/BookingConfirmation.tsx** - Payment and booking confirmation
5. **src/pages/Profile.tsx** - User profile and booking history
6. **src/pages/Admin.tsx** - Admin panel for content management
7. **src/components/MovieCard.tsx** - Reusable movie card component
8. **src/lib/mockData.ts** - Mock data for movies, theaters, bookings

## Key Components
- Movie grid with search/filter
- Seat map with real-time locking simulation
- Payment form with validation
- Booking confirmation with QR code
- User authentication flow
- Admin CRUD operations

## Tech Stack
- React + TypeScript
- Shadcn/ui components
- Tailwind CSS for styling
- Local storage for state persistence
- Mock APIs for backend simulation

## Microservices Simulation
- Frontend will simulate microservices architecture
- Different pages represent different service boundaries
- Mock API calls to demonstrate service communication
- Real-time seat locking with setTimeout simulation