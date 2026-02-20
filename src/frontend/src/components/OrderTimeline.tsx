import { Clock, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import type { OrderStatus } from '../backend';

interface OrderTimelineProps {
  status: OrderStatus;
}

export default function OrderTimeline({ status }: OrderTimelineProps) {
  const stages = [
    { key: 'pending', label: 'Order Placed', icon: Clock },
    { key: 'processing', label: 'Processing', icon: Package },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle },
  ];

  const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
  const currentIndex = statusOrder.indexOf(status);
  const isCancelled = status === 'cancelled';

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
        <XCircle className="h-5 w-5 text-red-600" />
        <span className="font-semibold text-red-900 dark:text-red-100">Order Cancelled</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex justify-between items-center">
        {stages.map((stage, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const Icon = stage.icon;

          return (
            <div key={stage.key} className="flex flex-col items-center flex-1 relative">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  isCompleted
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span
                className={`text-xs text-center ${
                  isCompleted ? 'text-foreground font-medium' : 'text-muted-foreground'
                }`}
              >
                {stage.label}
              </span>
              {index < stages.length - 1 && (
                <div
                  className={`absolute top-5 left-1/2 w-full h-0.5 ${
                    isCompleted ? 'bg-primary' : 'bg-muted'
                  }`}
                  style={{ transform: 'translateY(-50%)' }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
