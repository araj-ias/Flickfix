import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Clock } from 'lucide-react';
import { Movie } from '@/lib/mockData';
import { useNavigate } from 'react-router-dom';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg">
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-2 right-2">
            <Badge className="bg-yellow-500 text-black font-bold">
              <Star className="w-3 h-3 mr-1 fill-current" />
              {movie.rating}
            </Badge>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <div className="p-4 space-y-3">
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {movie.title}
          </h3>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{movie.duration} min</span>
            <span>•</span>
            <span>{movie.language}</span>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {movie.genre.slice(0, 2).map((genre) => (
              <Badge key={genre} variant="secondary" className="text-xs">
                {genre}
              </Badge>
            ))}
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2">
            {movie.description}
          </p>
          
          <Button 
            onClick={handleBookNow}
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Book Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}