import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useCreateCheckoutSession } from '../hooks/useCreateCheckoutSession';
import type { CustomerInfo, ShoppingItem } from '../backend';

interface PaymentProps {
  customerInfo: CustomerInfo;
}

export default function Payment({ customerInfo }: PaymentProps) {
  const { items } = useCart();
  const createCheckoutSession = useCreateCheckoutSession();
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    try {
      setError(null);

      const shoppingItems: ShoppingItem[] = items.map((item) => ({
        productName: item.name,
        productDescription: item.description,
        priceInCents: BigInt(Number(item.listedPrice) * 100),
        quantity: BigInt(item.quantity),
        currency: 'INR',
      }));

      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const successUrl = `${baseUrl}/payment-success`;
      const cancelUrl = `${baseUrl}/payment-failure`;

      const session = await createCheckoutSession.mutateAsync({
        items: shoppingItems,
        successUrl,
        cancelUrl,
      });

      if (!session?.url) {
        throw new Error('Stripe session missing url');
      }

      window.location.href = session.url;
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Failed to initiate payment. Please try again.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded-lg space-y-2">
          <h4 className="font-semibold">Shipping To:</h4>
          <p className="text-sm">{customerInfo.name}</p>
          <p className="text-sm text-muted-foreground">{customerInfo.email}</p>
          <p className="text-sm text-muted-foreground">{customerInfo.phone}</p>
          <p className="text-sm text-muted-foreground">{customerInfo.shippingAddress}</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handlePayment}
          disabled={createCheckoutSession.isPending}
          className="w-full"
          size="lg"
        >
          {createCheckoutSession.isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-5 w-5" />
              Pay with Stripe
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          You will be redirected to Stripe's secure payment page
        </p>
      </CardContent>
    </Card>
  );
}
