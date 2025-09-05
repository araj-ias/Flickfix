import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Star, Clock, Calendar, MapPin, Play } from 'lucide-react';
import { Movie, Theater, Showtime, getFromStorage } from '@/lib/mockData';

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [selectedDate, setSelectedDate] = useState('2025-01-15');

  useEffect(() => {
    const movies = getFromStorage('movies') || [];
    const foundMovie = movies.find((m: Movie) => m.id === id);
    setMovie(foundMovie || null);
    
    const allTheaters = getFromStorage('theaters') || [];
    setTheaters(allTheaters);
  }, [id]);

  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Movie not found</div>
      </div>
    );
  }

  const handleShowtimeSelect = (showtime: Showtime) => {
    navigate(`/seat-selection/${movie.id}/${showtime.id}`);
  };

  const dates = ['2025-01-15', '2025-01-16', '2025-01-17', '2025-01-18'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Movies
          </Button>
        </div>
      </header>

      {/* Movie Hero Section */}
      <section className="relative py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Movie Poster */}
            <div className="lg:col-span-1">
              <div className="relative group">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full max-w-md mx-auto rounded-lg shadow-2xl"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                  <Button size="lg" className="rounded-full bg-red-600 hover:bg-red-700">
                    <Play className="w-6 h-6 mr-2" />
                    Watch Trailer
                  </Button>
                </div>
              </div>
            </div>

            {/* Movie Details */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-white mb-4">{movie.title}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <Badge className="bg-yellow-500 text-black font-bold">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    {movie.rating}/10
                  </Badge>
                  <div className="flex items-center text-white/80">
                    <Clock className="w-4 h-4 mr-2" />
                    {movie.duration} min
                  </div>
                  <div className="text-white/80">{movie.language}</div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genre.map((genre) => (
                    <Badge key={genre} variant="secondary">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">About the Movie</h3>
                <p className="text-white/80 leading-relaxed">{movie.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-white/80">
                <div>
                  <span className="font-semibold">Release Date:</span>
                  <p>{new Date(movie.releaseDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="font-semibold">Language:</span>
                  <p>{movie.language}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Book Tickets</h2>
          
          {/* Date Selection */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Select Date</h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {dates.map((date) => (
                <Button
                  key={date}
                  variant={selectedDate === date ? 'default' : 'outline'}
                  className={`min-w-fit ${
                    selectedDate === date
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : 'border-white/20 text-white hover:bg-white/10'
                  }`}
                  onClick={() => setSelectedDate(date)}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(date).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </Button>
              ))}
            </div>
          </div>

          {/* Theater and Showtime Selection */}
          <div className="space-y-6">
            {theaters.map((theater) => {
              const theaterShowtimes = movie.showtimes.filter(
                (st) => st.theaterId === theater.id && st.date === selectedDate
              );

              if (theaterShowtimes.length === 0) return null;

              return (
                <Card key={theater.id} className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      {theater.name}
                    </CardTitle>
                    <p className="text-white/60">{theater.location}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {theaterShowtimes.map((showtime) => (
                        <Button
                          key={showtime.id}
                          variant="outline"
                          className="border-white/20 text-white hover:bg-purple-600 hover:border-purple-600 transition-all duration-300"
                          onClick={() => handleShowtimeSelect(showtime)}
                        >
                          <div className="text-center">
                            <div className="font-semibold">{showtime.time}</div>
                            <div className="text-xs opacity-80">₹{showtime.price}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}