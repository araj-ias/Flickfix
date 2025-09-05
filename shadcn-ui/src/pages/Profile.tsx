import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, User, Calendar, MapPin, Ticket, Download, QrCode } from 'lucide-react';
import { User as UserType, Booking, getFromStorage } from '@/lib/mockData';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const userData = getFromStorage('currentUser');
    if (userData) {
      setUser(userData);
      setBookings(userData.bookings || []);
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const handleDownloadTicket = (booking: Booking) => {
    // Simulate ticket download
    const ticketData = {
      bookingId: booking.id,
      movieId: booking.movieId,
      seats: booking.seats,
      amount: booking.totalAmount,
      date: booking.bookingDate
    };
    
    const dataStr = JSON.stringify(ticketData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `ticket-${booking.id}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Please log in to view your profile</div>
      </div>
    );
  }

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
            Back to Home
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-8">
            <CardContent className="p-8">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div className="text-white">
                  <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                  <p className="text-white/80 mb-1">{user.email}</p>
                  <p className="text-white/80">{user.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList className="bg-white/10 border-white/20">
              <TabsTrigger value="bookings" className="data-[state=active]:bg-purple-600">
                My Bookings
              </TabsTrigger>
              <TabsTrigger value="profile" className="data-[state=active]:bg-purple-600">
                Profile Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bookings" className="space-y-4">
              {bookings.length === 0 ? (
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardContent className="text-center py-12">
                    <Ticket className="w-16 h-16 mx-auto text-white/40 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Bookings Yet</h3>
                    <p className="text-white/60 mb-6">Start booking your favorite movies!</p>
                    <Button
                      onClick={() => navigate('/')}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      Browse Movies
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <Card key={booking.id} className="bg-white/10 backdrop-blur-md border-white/20">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-2">
                              Booking #{booking.id}
                            </h3>
                            <Badge className={`${getStatusColor(booking.status)} text-white`}>
                              {booking.status.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="text-right text-white">
                            <p className="text-2xl font-bold">₹{booking.totalAmount}</p>
                            <p className="text-sm text-white/60">
                              {new Date(booking.bookingDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="text-white">
                            <p className="text-sm text-white/60">Movie</p>
                            <p className="font-semibold">Movie ID: {booking.movieId}</p>
                          </div>
                          <div className="text-white">
                            <p className="text-sm text-white/60">Theater</p>
                            <p className="font-semibold">Theater ID: {booking.theaterId}</p>
                          </div>
                          <div className="text-white">
                            <p className="text-sm text-white/60">Seats</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {booking.seats.map((seat) => (
                                <Badge key={seat} variant="secondary" className="text-xs">
                                  {seat}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="text-white">
                            <p className="text-sm text-white/60">Show Time</p>
                            <p className="font-semibold">Showtime ID: {booking.showtimeId}</p>
                          </div>
                        </div>

                        <Separator className="bg-white/20 mb-4" />

                        <div className="flex gap-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10"
                            onClick={() => handleDownloadTicket(booking)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            <QrCode className="w-4 h-4 mr-2" />
                            Show QR
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="profile" className="space-y-4">
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Full Name
                      </label>
                      <div className="bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white">
                        {user.name}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Email Address
                      </label>
                      <div className="bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white">
                        {user.email}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Phone Number
                      </label>
                      <div className="bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white">
                        {user.phone}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Member Since
                      </label>
                      <div className="bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white">
                        January 2025
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Booking Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-3xl font-bold text-white">{bookings.length}</p>
                      <p className="text-sm text-white/60">Total Bookings</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white">
                        ₹{bookings.reduce((sum, b) => sum + b.totalAmount, 0)}
                      </p>
                      <p className="text-sm text-white/60">Total Spent</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white">
                        {bookings.filter(b => b.status === 'confirmed').length}
                      </p>
                      <p className="text-sm text-white/60">Confirmed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}