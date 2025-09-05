import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, CreditCard, Smartphone, Wallet, QrCode } from 'lucide-react';
import { getFromStorage, saveToStorage, Booking } from '@/lib/mockData';

interface BookingData {
  movieId: string;
  showtimeId: string;
  selectedSeats: string[];
  totalAmount: number;
  movie: string;
  theater: string;
  showtime: string;
  date: string;
}

export default function BookingConfirmation() {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState('');

  useEffect(() => {
    const data = getFromStorage('currentBooking') as BookingData | null;
    if (!data) {
      navigate('/');
      return;
    }
    setBookingData(data);
  }, [navigate]);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Create booking record
    const newBooking: Booking = {
      id: `BMS${Date.now()}`,
      userId: 'user1',
      movieId: bookingData!.movieId,
      theaterId: 'theater1',
      screenId: 'screen1',
      showtimeId: bookingData!.showtimeId,
      seats: bookingData!.selectedSeats,
      totalAmount: bookingData!.totalAmount + Math.round(bookingData!.totalAmount * 0.1),
      bookingDate: new Date().toISOString(),
      status: 'confirmed'
    };

    // Save booking to user's history
    const currentUser = getFromStorage('currentUser') as { bookings: Booking[] } | null;
    const userWithBookings = currentUser || { bookings: [] };
    userWithBookings.bookings.push(newBooking);
    saveToStorage('currentUser', userWithBookings);

    setBookingId(newBooking.id);
    setIsProcessing(false);
    setIsConfirmed(true);
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="text-center p-8 space-y-6">
            <div className="text-green-400">
              <CheckCircle className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white">Booking Confirmed!</h2>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4 space-y-2">
              <div className="text-white">
                <p className="text-sm text-white/80">Booking ID</p>
                <p className="font-mono text-lg font-bold">{bookingId}</p>
              </div>
              
              <Separator className="bg-white/20" />
              
              <div className="text-white text-sm space-y-1">
                <p><span className="text-white/80">Movie:</span> {bookingData.movie}</p>
                <p><span className="text-white/80">Theater:</span> {bookingData.theater}</p>
                <p><span className="text-white/80">Date & Time:</span> {new Date(bookingData.date).toLocaleDateString()} | {bookingData.showtime}</p>
                <p><span className="text-white/80">Seats:</span> {bookingData.selectedSeats.join(', ')}</p>
                <p><span className="text-white/80">Total Paid:</span> ₹{bookingData.totalAmount + Math.round(bookingData.totalAmount * 0.1)}</p>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <QrCode className="w-24 h-24 mx-auto text-white/60 mb-2" />
              <p className="text-white/60 text-xs">Show this QR code at the theater</p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => navigate('/profile')}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                View My Bookings
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                Book More Tickets
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalAmount = bookingData.totalAmount + Math.round(bookingData.totalAmount * 0.1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="container mx-auto max-w-4xl py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Payment Method Selection */}
              <div className="space-y-3">
                <Label className="text-white">Select Payment Method</Label>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant={paymentMethod === 'card' ? 'default' : 'outline'}
                    className={`p-4 h-auto flex-col ${
                      paymentMethod === 'card' 
                        ? 'bg-purple-600 hover:bg-purple-700' 
                        : 'border-white/20 text-white hover:bg-white/10'
                    }`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <CreditCard className="w-6 h-6 mb-2" />
                    <span className="text-xs">Card</span>
                  </Button>
                  <Button
                    variant={paymentMethod === 'upi' ? 'default' : 'outline'}
                    className={`p-4 h-auto flex-col ${
                      paymentMethod === 'upi' 
                        ? 'bg-purple-600 hover:bg-purple-700' 
                        : 'border-white/20 text-white hover:bg-white/10'
                    }`}
                    onClick={() => setPaymentMethod('upi')}
                  >
                    <Smartphone className="w-6 h-6 mb-2" />
                    <span className="text-xs">UPI</span>
                  </Button>
                  <Button
                    variant={paymentMethod === 'wallet' ? 'default' : 'outline'}
                    className={`p-4 h-auto flex-col ${
                      paymentMethod === 'wallet' 
                        ? 'bg-purple-600 hover:bg-purple-700' 
                        : 'border-white/20 text-white hover:bg-white/10'
                    }`}
                    onClick={() => setPaymentMethod('wallet')}
                  >
                    <Wallet className="w-6 h-6 mb-2" />
                    <span className="text-xs">Wallet</span>
                  </Button>
                </div>
              </div>

              {/* Payment Form Fields */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Card Number</Label>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Expiry Date</Label>
                      <Input
                        placeholder="MM/YY"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      />
                    </div>
                    <div>
                      <Label className="text-white">CVV</Label>
                      <Input
                        placeholder="123"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-white">Cardholder Name</Label>
                    <Input
                      placeholder="John Doe"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div>
                  <Label className="text-white">UPI ID</Label>
                  <Input
                    placeholder="yourname@upi"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>
              )}

              {paymentMethod === 'wallet' && (
                <div className="text-center py-8">
                  <Wallet className="w-16 h-16 mx-auto text-white/60 mb-4" />
                  <p className="text-white/80">Select your preferred wallet</p>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      PayTM
                    </Button>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      PhonePe
                    </Button>
                  </div>
                </div>
              )}

              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3"
              >
                {isProcessing ? 'Processing Payment...' : `Pay ₹${totalAmount}`}
              </Button>
            </CardContent>
          </Card>

          {/* Booking Summary */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-white space-y-2">
                <h4 className="font-semibold text-lg">{bookingData.movie}</h4>
                <p className="text-white/80">{bookingData.theater}</p>
                <p className="text-white/80">
                  {new Date(bookingData.date).toLocaleDateString()} | {bookingData.showtime}
                </p>
              </div>

              <Separator className="bg-white/20" />

              <div className="space-y-3">
                <div className="text-white">
                  <h5 className="font-semibold mb-2">Selected Seats:</h5>
                  <div className="flex flex-wrap gap-2">
                    {bookingData.selectedSeats.map((seat: string) => (
                      <Badge key={seat} variant="secondary">
                        {seat}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="text-white space-y-2">
                  <div className="flex justify-between">
                    <span>Tickets ({bookingData.selectedSeats.length})</span>
                    <span>₹{bookingData.totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Convenience Fee</span>
                    <span>₹{Math.round(bookingData.totalAmount * 0.1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST</span>
                    <span>₹0</span>
                  </div>
                  <Separator className="bg-white/20" />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Amount</span>
                    <span>₹{totalAmount}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/20 border border-blue-500/50 rounded p-3">
                <p className="text-blue-300 text-sm">
                  🔒 Your payment is secured with 256-bit SSL encryption
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}