import { useEffect, useState } from 'react';
import { CheckCircle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from '@tanstack/react-router';
import { useCart } from '../contexts/CartContext';
import { useCreateOrder } from '../hooks/useQueries';
import NoEmailBanner from '../components/NoEmailBanner';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { items, clearCart, getCartTotal } = useCart();
  const createOrder = useCreateOrder();
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');

    if (sessionId && items.length > 0) {
      const customerInfo = {
        name: 'Customer',
        email: 'customer@example.com',
        phone: '0000000000',
        shippingAddress: 'Address from checkout',
      };

      const orderedProducts = items.map((item) => ({
        productId: item.id,
        quantity: BigInt(item.quantity),
        priceAtPurchase: item.listedPrice,
      }));

      createOrder
        .mutateAsync({
          customer: customerInfo,
          products: orderedProducts,
          total: BigInt(getCartTotal()),
        })
        .then((id) => {
          setOrderId(id.toString());
          clearCart();
        })
        .catch((error) => {
          console.error('Failed to create order:', error);
        });
    }
  }, []);

  return (
    <div className="min-h-screen bg-muted/30 py-24">
      <div className="container mx-auto px-4 max-w-2xl">
        <NoEmailBanner />

        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Thank you for your order. Your payment has been processed successfully.
            </p>

            {orderId && (
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-semibold mb-2">Your Order ID:</p>
                <p className="text-2xl font-mono font-bold text-primary">#{orderId}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Please save this order ID for tracking
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigate({ to: '/order-tracking' })} className="gap-2">
                <Package className="h-4 w-4" />
                Track Order
              </Button>
              <Button variant="outline" onClick={() => navigate({ to: '/' })}>
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
