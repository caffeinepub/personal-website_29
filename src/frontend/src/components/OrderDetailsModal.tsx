import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { useUpdateOrderStatus, useAddFulfillmentNotes } from '../hooks/useQueries';
import StockVerificationPanel from './StockVerificationPanel';
import ReturnPolicyDisplay from './ReturnPolicyDisplay';
import type { Order, OrderStatus } from '../backend';

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
}

export default function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  const [status, setStatus] = useState(order.orderStatus);
  const [notes, setNotes] = useState('');
  const updateStatus = useUpdateOrderStatus();
  const addNotes = useAddFulfillmentNotes();

  const formatPrice = (price: bigint) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Number(price));
  };

  const handleUpdateStatus = async () => {
    try {
      await updateStatus.mutateAsync({ orderId: order.id, newStatus: status });
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleAddNotes = async () => {
    if (!notes.trim()) return;
    try {
      await addNotes.mutateAsync({ orderId: order.id, notes });
      setNotes('');
    } catch (error) {
      console.error('Failed to add notes:', error);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details - #{Number(order.id)}</DialogTitle>
          <DialogClose />
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-2">Customer Information</h4>
            <div className="bg-muted p-4 rounded-lg space-y-1 text-sm">
              <p>
                <strong>Name:</strong> {order.customer.name}
              </p>
              <p>
                <strong>Email:</strong> {order.customer.email}
              </p>
              <p>
                <strong>Phone:</strong> {order.customer.phone}
              </p>
              <p>
                <strong>Address:</strong> {order.customer.shippingAddress}
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-2">Order Items</h4>
            <div className="space-y-2">
              {order.products.map((product, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-muted rounded">
                  <div>
                    <p className="text-sm font-medium">Product ID: {Number(product.productId)}</p>
                    <p className="text-xs text-muted-foreground">
                      Quantity: {Number(product.quantity)}
                    </p>
                  </div>
                  <p className="font-semibold">{formatPrice(product.priceAtPurchase)}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4 text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">{formatPrice(order.total)}</span>
            </div>
          </div>

          <Separator />

          <StockVerificationPanel order={order} />

          <Separator />

          <div>
            <Label htmlFor="status">Order Status</Label>
            <div className="flex gap-2 mt-2">
              <Select value={status} onValueChange={(value) => setStatus(value as OrderStatus)}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleUpdateStatus} disabled={updateStatus.isPending}>
                Update
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Fulfillment Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about order fulfillment..."
              className="mt-2"
            />
            {order.fulfillmentNotes && (
              <div className="mt-2 p-3 bg-muted rounded text-sm">
                <strong>Previous notes:</strong> {order.fulfillmentNotes}
              </div>
            )}
            <Button onClick={handleAddNotes} disabled={addNotes.isPending} className="mt-2">
              Add Notes
            </Button>
          </div>

          <Separator />

          <ReturnPolicyDisplay platform="amazon" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
