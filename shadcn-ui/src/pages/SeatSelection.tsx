import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Users, Clock, AlertCircle } from 'lucide-react';
import { Movie, Theater, Showtime, Seat, getFromStorage, saveToStorage } from '@/lib/mockData';

export default function SeatSelection() {
  const { movieId, showtimeId } = useParams<{ movieId: string; showtimeId: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [theater, setTheater] = useState<Theater | null>(null);
  const [seatLayout, setSeatLayout] = useState<Seat[][]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [lockedSeats, setLockedSeats] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  useEffect(() => {
    // Load data
    const movies = getFromStorage('movies') || [];
    const theaters = getFromStorage('theaters') || [];
    
    const foundMovie = movies.find((m: Movie) => m.id === movieId);
    const foundShowtime = foundMovie?.showtimes.find((st: Showtime) => st.id === showtimeId);
    const foundTheater = theaters.find((t: Theater) => t.id === foundShowtime?.theaterId);
    const screen = foundTheater?.screens.find((s) => s.id === foundShowtime?.screenId);

    setMovie(foundMovie || null);
    setShowtime(foundShowtime || null);
    setTheater(foundTheater || null);
    setSeatLayout(screen?.seatLayout || []);
  }, [movieId, showtimeId]);

  // Timer countdown
  useEffect(() => {
    if (selectedSeats.length > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Time expired, clear selection
            setSelectedSeats([]);
            setLockedSeats(new Set());
            return 300;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [selectedSeats.length]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.isBooked || lockedSeats.has(seat.id)) return;

    const isSelected = selectedSeats.some(s => s.id === seat.id);
    
    if (isSelected) {
      // Deselect seat
      setSelectedSeats(prev => prev.filter(s => s.id !== seat.id));
      setLockedSeats(prev => {
        const newSet = new Set(prev);
        newSet.delete(seat.id);
        return newSet;
      });
    } else {
      // Select seat (max 10 seats)
      if (selectedSeats.length >= 10) return;
      
      setSelectedSeats(prev => [...prev, seat]);
      setLockedSeats(prev => new Set(prev).add(seat.id));
      
      // Simulate real-time locking for other users
      setTimeout(() => {
        if (Math.random() < 0.1) { // 10% chance another user tries to book
          // Seat conflict simulation - would be handled by backend in real app
        }
      }, 2000);
    }
  };

  const getSeatColor = (seat: Seat) => {
    if (seat.isBooked) return 'bg-red-500';
    if (lockedSeats.has(seat.id) && selectedSeats.some(s => s.id === seat.id)) return 'bg-green-500';
    if (lockedSeats.has(seat.id)) return 'bg-yellow-500';
    if (seat.type === 'vip') return 'bg-purple-300 hover:bg-purple-400';
    if (seat.type === 'premium') return 'bg-blue-300 hover:bg-blue-400';
    return 'bg-gray-300 hover:bg-gray-400';
  };

  const totalAmount = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) return;
    
    // Save booking data to localStorage
    const bookingData = {
      movieId,
      showtimeId,
      selectedSeats: selectedSeats.map(s => s.id),
      totalAmount,
      movie: movie?.title,
      theater: theater?.name,
      showtime: showtime?.time,
      date: showtime?.date
    };
    
    saveToStorage('currentBooking', bookingData);
    navigate('/booking-confirmation');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!movie || !showtime || !theater) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => navigate(`/movie/${movieId}`)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            {selectedSeats.length > 0 && (
              <div className="flex items-center gap-4 text-white">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-red-400" />
                  <span className="font-mono text-red-400">{formatTime(timeLeft)}</span>
                </div>
                <Badge variant="secondary">
                  {selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''} selected
                </Badge>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Seat Map */}
          <div className="lg:col-span-3">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-center">
                  {theater.name} - Screen {seatLayout.length > 0 ? '1' : ''}
                </CardTitle>
                <div className="text-center">
                  <div className="bg-gray-600 text-white py-2 px-8 rounded-t-lg inline-block">
                    SCREEN
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Legend */}
                <div className="flex justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-300 rounded"></div>
                    <span className="text-white">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-white">Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-white">Booked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className="text-white">Locked</span>
                  </div>
                </div>

                {/* Seat Layout */}
                <div className="space-y-2 max-w-2xl mx-auto">
                  {seatLayout.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex justify-center gap-1">
                      <div className="w-8 text-white text-center text-sm font-semibold flex items-center justify-center">
                        {row[0]?.row}
                      </div>
                      {row.map((seat, seatIndex) => (
                        <button
                          key={seat.id}
                          onClick={() => handleSeatClick(seat)}
                          disabled={seat.isBooked}
                          className={`w-8 h-8 rounded text-xs font-semibold transition-all duration-200 transform hover:scale-110 ${getSeatColor(seat)} ${
                            seat.isBooked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                          }`}
                          title={`${seat.row}${seat.number} - ₹${seat.price} (${seat.type})`}
                        >
                          {seat.number}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 sticky top-24">
              <CardHeader>
                <CardTitle className="text-white">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-white space-y-2">
                  <h4 className="font-semibold">{movie.title}</h4>
                  <p className="text-sm text-white/80">{theater.name}</p>
                  <p className="text-sm text-white/80">
                    {new Date(showtime.date).toLocaleDateString()} | {showtime.time}
                  </p>
                </div>

                <Separator className="bg-white/20" />

                {selectedSeats.length > 0 ? (
                  <div className="space-y-3">
                    <div className="text-white">
                      <h5 className="font-semibold mb-2">Selected Seats:</h5>
                      <div className="grid grid-cols-3 gap-1 text-xs">
                        {selectedSeats.map((seat) => (
                          <Badge key={seat.id} variant="secondary" className="text-center">
                            {seat.row}{seat.number}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="text-white space-y-1">
                      <div className="flex justify-between">
                        <span>Tickets ({selectedSeats.length})</span>
                        <span>₹{totalAmount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Convenience Fee</span>
                        <span>₹{Math.round(totalAmount * 0.1)}</span>
                      </div>
                      <Separator className="bg-white/20" />
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>₹{totalAmount + Math.round(totalAmount * 0.1)}</span>
                      </div>
                    </div>

                    {timeLeft < 60 && (
                      <div className="bg-red-500/20 border border-red-500/50 rounded p-3">
                        <div className="flex items-center gap-2 text-red-400">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm">Hurry! Only {formatTime(timeLeft)} left</span>
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={handleProceedToPayment}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold"
                    >
                      Proceed to Payment
                    </Button>
                  </div>
                ) : (
                  <div className="text-center text-white/60 py-8">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Select seats to continue</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}