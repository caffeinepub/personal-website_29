import { useState } from 'react';
import { Package, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import AdminGuard from '../components/AdminGuard';
import OrderDetailsModal from '../components/OrderDetailsModal';
import NoEmailBanner from '../components/NoEmailBanner';
import { useGetAllOrders } from '../hooks/useQueries';
import type { Order, OrderStatus } from '../backend';

export default function AdminOrders() {
  const { data: orders, isLoading } = useGetAllOrders(0, 100);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
      month: 'short',
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

  const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;

  return (
    <AdminGuard>
      <div className="min-h-screen bg-muted/30 py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <NoEmailBanner />

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Order Management</h1>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orders?.length || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPrice(BigInt(totalRevenue))}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading orders...</p>
              ) : !orders || orders.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No orders yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={Number(order.id)}>
                        <TableCell className="font-mono">#{Number(order.id)}</TableCell>
                        <TableCell>{order.customer.name}</TableCell>
                        <TableCell>{formatDate(order.orderDate)}</TableCell>
                        <TableCell className="font-semibold">{formatPrice(order.total)}</TableCell>
                        <TableCell>{getStatusBadge(order.orderStatus)}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {selectedOrder && (
            <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
          )}
        </div>
      </div>
    </AdminGuard>
  );
}
