import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, Edit, Trash2, Users, Film, Building, BarChart3 } from 'lucide-react';
import { Movie, Theater, getFromStorage, saveToStorage } from '@/lib/mockData';

export default function Admin() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [isAddingMovie, setIsAddingMovie] = useState(false);
  const [newMovie, setNewMovie] = useState({
    title: '',
    genre: '',
    duration: '',
    rating: '',
    description: '',
    language: '',
    poster: ''
  });

  useEffect(() => {
    const storedMovies = getFromStorage('movies') || [];
    const storedTheaters = getFromStorage('theaters') || [];
    setMovies(storedMovies);
    setTheaters(storedTheaters);
  }, []);

  const handleAddMovie = () => {
    if (!newMovie.title || !newMovie.genre) return;

    const movie: Movie = {
      id: `movie_${Date.now()}`,
      title: newMovie.title,
      poster: newMovie.poster || '/images/movieposter.jpg',
      genre: newMovie.genre.split(',').map(g => g.trim()),
      duration: parseInt(newMovie.duration) || 120,
      rating: parseFloat(newMovie.rating) || 8.0,
      description: newMovie.description,
      language: newMovie.language || 'English',
      releaseDate: new Date().toISOString().split('T')[0],
      showtimes: []
    };

    const updatedMovies = [...movies, movie];
    setMovies(updatedMovies);
    saveToStorage('movies', updatedMovies);
    
    setNewMovie({
      title: '',
      genre: '',
      duration: '',
      rating: '',
      description: '',
      language: '',
      poster: ''
    });
    setIsAddingMovie(false);
  };

  const handleDeleteMovie = (movieId: string) => {
    const updatedMovies = movies.filter(m => m.id !== movieId);
    setMovies(updatedMovies);
    saveToStorage('movies', updatedMovies);
  };

  const totalBookings = movies.reduce((sum, movie) => sum + movie.showtimes.length * 50, 0); // Mock calculation
  const totalRevenue = totalBookings * 250; // Mock calculation

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
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6 text-center">
              <Film className="w-8 h-8 mx-auto text-blue-400 mb-2" />
              <p className="text-2xl font-bold text-white">{movies.length}</p>
              <p className="text-sm text-white/60">Total Movies</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6 text-center">
              <Building className="w-8 h-8 mx-auto text-green-400 mb-2" />
              <p className="text-2xl font-bold text-white">{theaters.length}</p>
              <p className="text-sm text-white/60">Total Theaters</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto text-purple-400 mb-2" />
              <p className="text-2xl font-bold text-white">{totalBookings}</p>
              <p className="text-sm text-white/60">Total Bookings</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-8 h-8 mx-auto text-yellow-400 mb-2" />
              <p className="text-2xl font-bold text-white">₹{totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-white/60">Total Revenue</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="movies" className="space-y-6">
          <TabsList className="bg-white/10 border-white/20">
            <TabsTrigger value="movies" className="data-[state=active]:bg-purple-600">
              Movies
            </TabsTrigger>
            <TabsTrigger value="theaters" className="data-[state=active]:bg-purple-600">
              Theaters
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="movies" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Movie Management</h2>
              <Button
                onClick={() => setIsAddingMovie(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Movie
              </Button>
            </div>

            {isAddingMovie && (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Add New Movie</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Title</Label>
                      <Input
                        value={newMovie.title}
                        onChange={(e) => setNewMovie({...newMovie, title: e.target.value})}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="Movie title"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Genre (comma separated)</Label>
                      <Input
                        value={newMovie.genre}
                        onChange={(e) => setNewMovie({...newMovie, genre: e.target.value})}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="Action, Drama, Thriller"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Duration (minutes)</Label>
                      <Input
                        type="number"
                        value={newMovie.duration}
                        onChange={(e) => setNewMovie({...newMovie, duration: e.target.value})}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="120"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Rating</Label>
                      <Input
                        type="number"
                        step="0.1"
                        max="10"
                        value={newMovie.rating}
                        onChange={(e) => setNewMovie({...newMovie, rating: e.target.value})}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="8.5"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Language</Label>
                      <Input
                        value={newMovie.language}
                        onChange={(e) => setNewMovie({...newMovie, language: e.target.value})}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="English"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Poster URL</Label>
                      <Input
                        value={newMovie.poster}
                        onChange={(e) => setNewMovie({...newMovie, poster: e.target.value})}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-white">Description</Label>
                    <Textarea
                      value={newMovie.description}
                      onChange={(e) => setNewMovie({...newMovie, description: e.target.value})}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Movie description..."
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleAddMovie} className="bg-green-600 hover:bg-green-700">
                      Add Movie
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingMovie(false)}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {movies.map((movie) => (
                <Card key={movie.id} className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardContent className="p-4">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-48 object-cover rounded mb-4"
                    />
                    <h3 className="font-bold text-white mb-2">{movie.title}</h3>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {movie.genre.map((g) => (
                        <Badge key={g} variant="secondary" className="text-xs">
                          {g}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-white/80 text-sm mb-3">{movie.duration} min | {movie.language}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                        onClick={() => handleDeleteMovie(movie.id)}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="theaters" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Theater Management</h2>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Theater
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {theaters.map((theater) => (
                <Card key={theater.id} className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">{theater.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/80 mb-4">{theater.location}</p>
                    <div className="space-y-2">
                      <p className="text-white font-semibold">Screens:</p>
                      {theater.screens.map((screen) => (
                        <div key={screen.id} className="flex justify-between items-center bg-white/5 rounded p-2">
                          <span className="text-white">{screen.name}</span>
                          <Badge variant="secondary">{screen.capacity} seats</Badge>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/20">
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Popular Movies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {movies.slice(0, 5).map((movie, index) => (
                      <div key={movie.id} className="flex justify-between items-center">
                        <span className="text-white">{index + 1}. {movie.title}</span>
                        <Badge className="bg-purple-600">
                          {Math.floor(Math.random() * 1000)} bookings
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Revenue by Theater</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {theaters.map((theater, index) => (
                      <div key={theater.id} className="flex justify-between items-center">
                        <span className="text-white">{theater.name}</span>
                        <Badge className="bg-green-600">
                          ₹{(Math.floor(Math.random() * 500000) + 100000).toLocaleString()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-green-400 text-2xl font-bold">99.9%</p>
                    <p className="text-white/60 text-sm">Uptime</p>
                  </div>
                  <div>
                    <p className="text-blue-400 text-2xl font-bold">1.2s</p>
                    <p className="text-white/60 text-sm">Avg Response</p>
                  </div>
                  <div>
                    <p className="text-purple-400 text-2xl font-bold">5.2K</p>
                    <p className="text-white/60 text-sm">Active Users</p>
                  </div>
                  <div>
                    <p className="text-yellow-400 text-2xl font-bold">0</p>
                    <p className="text-white/60 text-sm">Critical Errors</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}