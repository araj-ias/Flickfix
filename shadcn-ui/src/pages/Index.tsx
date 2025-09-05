import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MapPin, User } from 'lucide-react';
import MovieCard from '@/components/MovieCard';
import { Movie, getFromStorage } from '@/lib/mockData';
import { useNavigate } from 'react-router-dom';

export default function Index() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedMovies = getFromStorage('movies') || [];
    setMovies(storedMovies);
    setFilteredMovies(storedMovies);
  }, []);

  useEffect(() => {
    let filtered = movies;

    if (searchTerm) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.genre.some(g => g.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedGenre) {
      filtered = filtered.filter(movie =>
        movie.genre.includes(selectedGenre)
      );
    }

    setFilteredMovies(filtered);
  }, [movies, searchTerm, selectedGenre]);

  const allGenres = [...new Set(movies.flatMap(movie => movie.genre))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">BookMyShow</h1>
              <div className="flex items-center space-x-2 text-white/80">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Mumbai</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => navigate('/profile')}
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => navigate('/admin')}
              >
                Admin
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Book Your Entertainment
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Discover the latest movies, book tickets instantly, and enjoy seamless entertainment experiences
          </p>
          
          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex gap-4 items-center bg-white/10 backdrop-blur-md rounded-full p-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                <Input
                  placeholder="Search movies, genres..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 bg-transparent border-0 text-white placeholder:text-white/60 focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <Button size="sm" className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
            
            {/* Genre Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge
                variant={selectedGenre === '' ? 'default' : 'secondary'}
                className="cursor-pointer hover:bg-purple-500 transition-colors"
                onClick={() => setSelectedGenre('')}
              >
                All
              </Badge>
              {allGenres.map((genre) => (
                <Badge
                  key={genre}
                  variant={selectedGenre === genre ? 'default' : 'secondary'}
                  className="cursor-pointer hover:bg-purple-500 transition-colors"
                  onClick={() => setSelectedGenre(genre)}
                >
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Movies Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-white mb-8 text-center">
            Now Showing
          </h3>
          
          {filteredMovies.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/60 text-lg">No movies found matching your criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-md border-t border-white/10 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/60">
            © 2025 BookMyShow Clone. Built with React, TypeScript & Shadcn/ui
          </p>
          <p className="text-white/40 text-sm mt-2">
            Microservices Architecture Demo - Real-time Seat Booking System
          </p>
        </div>
      </footer>
    </div>
  );
}