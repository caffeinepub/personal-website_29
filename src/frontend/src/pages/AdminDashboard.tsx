import { Package, DollarSign, ShoppingBag, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import AdminGuard from '../components/AdminGuard';
import MarkupSettings from '../components/MarkupSettings';
import { useGetAllOrders } from '../hooks/useQueries';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { data: orders } = useGetAllOrders(0, 100);

  const totalOrders = orders?.length || 0;
  const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-muted/30 py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalOrders}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => navigate({ to: '/admin/orders' })}
                  className="w-full"
                  variant="outline"
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Manage Orders
                </Button>
              </CardContent>
            </Card>
          </div>

          <MarkupSettings />
        </div>
      </div>
    </AdminGuard>
  );
}
