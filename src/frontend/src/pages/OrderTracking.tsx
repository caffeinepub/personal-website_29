import { Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useMyOrders } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import OrderTimeline from '../components/OrderTimeline';
import ReturnPolicyDisplay from '../components/ReturnPolicyDisplay';
import type { Order, OrderStatus } from '../backend';

export default function OrderTracking() {
  const { identity } = useInternetIdentity();
  const { data: orders, isLoading } = useMyOrders();
  const navigate = useNavigate();

  if (!identity) {
    return (
      <div className="min-h-screen bg-muted/30 py-24">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-4">Login Required</h2>
          <p className="text-muted-foreground mb-6">
            Please login to view your order history
          </p>
          <Button onClick={() => navigate({ to: '/' })}>Go to Home</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 py-24">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  const formatPrice = (price: bigint) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Number(price));
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: OrderStatus) => {
    const statusMap = {
      pending: { label: 'Pending', variant: 'secondary' as const },
      processing: { label: 'Processing', variant: 'default' as const },
      shipped: { label: 'Shipped', variant: 'default' as const },
      delivered: { label: 'Delivered', variant: 'default' as const },
      cancelled: { label: 'Cancelled', variant: 'destructive' as const },
    };
    const config = statusMap[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-muted/30 py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {!orders || orders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-6">
                Start shopping to see your orders here
              </p>
              <Button onClick={() => navigate({ to: '/' })}>Browse Products</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={Number(order.id)}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">Order #{Number(order.id)}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Placed on {formatDate(order.orderDate)}
                      </p>
                    </div>
                    {getStatusBadge(order.orderStatus)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <OrderTimeline status={order.orderStatus} />

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">Order Items</h4>
                    <div className="space-y-3">
                      {order.products.map((product, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <div>
                            <p className="text-sm">Product ID: {Number(product.productId)}</p>
                            <p className="text-xs text-muted-foreground">
                              Quantity: {Number(product.quantity)}
                            </p>
                          </div>
                          <p className="font-semibold">
                            {formatPrice(product.priceAtPurchase)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold text-primary">
                      {formatPrice(order.total)}
                    </span>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Shipping Address</h4>
                    <p className="text-sm text-muted-foreground">
                      {order.customer.shippingAddress}
                    </p>
                  </div>

                  <ReturnPolicyDisplay platform="amazon" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
