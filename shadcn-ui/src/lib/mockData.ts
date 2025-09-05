export interface Movie {
  id: string;
  title: string;
  poster: string;
  genre: string[];
  duration: number;
  rating: number;
  description: string;
  language: string;
  releaseDate: string;
  showtimes: Showtime[];
}

export interface Theater {
  id: string;
  name: string;
  location: string;
  screens: Screen[];
}

export interface Screen {
  id: string;
  name: string;
  capacity: number;
  seatLayout: Seat[][];
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  type: 'regular' | 'premium' | 'vip';
  price: number;
  isBooked: boolean;
  isSelected: boolean;
  isLocked: boolean;
}

export interface Showtime {
  id: string;
  movieId: string;
  theaterId: string;
  screenId: string;
  time: string;
  date: string;
  price: number;
}

export interface Booking {
  id: string;
  userId: string;
  movieId: string;
  theaterId: string;
  screenId: string;
  showtimeId: string;
  seats: string[];
  totalAmount: number;
  bookingDate: string;
  status: 'confirmed' | 'cancelled' | 'pending';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  bookings: Booking[];
}

// Mock data
export const movies: Movie[] = [
  {
    id: '1',
    title: 'Avatar: The Way of Water',
    poster: '/images/Avatar.jpg',
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    duration: 192,
    rating: 8.5,
    description: 'Set more than a decade after the events of the first film, Avatar: The Way of Water begins to tell the story of the Sully family.',
    language: 'English',
    releaseDate: '2022-12-16',
    showtimes: [
      { id: 'st1', movieId: '1', theaterId: 't1', screenId: 's1', time: '10:00 AM', date: '2025-01-15', price: 200 },
      { id: 'st2', movieId: '1', theaterId: 't1', screenId: 's1', time: '2:00 PM', date: '2025-01-15', price: 250 },
      { id: 'st3', movieId: '1', theaterId: 't1', screenId: 's1', time: '6:00 PM', date: '2025-01-15', price: 300 }
    ]
  },
  {
    id: '2',
    title: 'Top Gun: Maverick',
    poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop',
    genre: ['Action', 'Drama'],
    duration: 131,
    rating: 9.0,
    description: 'After thirty years, Maverick is still pushing the envelope as a top naval aviator.',
    language: 'English',
    releaseDate: '2022-05-27',
    showtimes: [
      { id: 'st4', movieId: '2', theaterId: 't1', screenId: 's2', time: '11:00 AM', date: '2025-01-15', price: 200 },
      { id: 'st5', movieId: '2', theaterId: 't1', screenId: 's2', time: '3:00 PM', date: '2025-01-15', price: 250 }
    ]
  },
  {
    id: '3',
    title: 'Black Panther: Wakanda Forever',
    poster: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=450&fit=crop',
    genre: ['Action', 'Adventure', 'Drama'],
    duration: 161,
    rating: 8.2,
    description: 'The people of Wakanda fight to protect their home from intervening world powers.',
    language: 'English',
    releaseDate: '2022-11-11',
    showtimes: [
      { id: 'st6', movieId: '3', theaterId: 't2', screenId: 's3', time: '1:00 PM', date: '2025-01-15', price: 220 },
      { id: 'st7', movieId: '3', theaterId: 't2', screenId: 's3', time: '7:00 PM', date: '2025-01-15', price: 280 }
    ]
  }
];

export const theaters: Theater[] = [
  {
    id: 't1',
    name: 'PVR Cinemas',
    location: 'Downtown Mall',
    screens: [
      {
        id: 's1',
        name: 'Screen 1 - IMAX',
        capacity: 100,
        seatLayout: generateSeatLayout('s1', 10, 10)
      },
      {
        id: 's2',
        name: 'Screen 2 - Premium',
        capacity: 80,
        seatLayout: generateSeatLayout('s2', 8, 10)
      }
    ]
  },
  {
    id: 't2',
    name: 'INOX Multiplex',
    location: 'City Center',
    screens: [
      {
        id: 's3',
        name: 'Screen 1 - Dolby Atmos',
        capacity: 120,
        seatLayout: generateSeatLayout('s3', 12, 10)
      }
    ]
  }
];

function generateSeatLayout(screenId: string, rows: number, seatsPerRow: number): Seat[][] {
  const layout: Seat[][] = [];
  const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  for (let i = 0; i < rows; i++) {
    const row: Seat[] = [];
    for (let j = 1; j <= seatsPerRow; j++) {
      const seatType = i < 3 ? 'vip' : i < 6 ? 'premium' : 'regular';
      const basePrice = seatType === 'vip' ? 400 : seatType === 'premium' ? 300 : 200;
      
      row.push({
        id: `${screenId}-${rowLabels[i]}${j}`,
        row: rowLabels[i],
        number: j,
        type: seatType,
        price: basePrice,
        isBooked: Math.random() < 0.3, // 30% seats randomly booked
        isSelected: false,
        isLocked: false
      });
    }
    layout.push(row);
  }
  
  return layout;
}

// Mock user data
export const currentUser: User = {
  id: 'user1',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  bookings: []
};

// Local storage helpers
export const saveToStorage = (key: string, data: unknown) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getFromStorage = (key: string): unknown => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

// Initialize storage
if (!getFromStorage('movies')) {
  saveToStorage('movies', movies);
}
if (!getFromStorage('theaters')) {
  saveToStorage('theaters', theaters);
}
if (!getFromStorage('currentUser')) {
  saveToStorage('currentUser', currentUser);
}