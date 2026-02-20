import { useState } from 'react';
import { ExternalLink, AlertCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import type { Order } from '../backend';

interface StockVerificationPanelProps {
  order: Order;
}

type StockStatus = 'available' | 'check-official' | 'unavailable';

export default function StockVerificationPanel({ order }: StockVerificationPanelProps) {
  const [stockStatuses, setStockStatuses] = useState<Record<string, StockStatus>>({});

  const handleStatusChange = (productId: string, status: StockStatus) => {
    setStockStatuses((prev) => ({ ...prev, [productId]: status }));
  };

  const officialWebsites = {
    apple: 'https://www.apple.com/in/',
    samsung: 'https://www.samsung.com/in/',
    oneplus: 'https://www.oneplus.in/',
    xiaomi: 'https://www.mi.com/in/',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-orange-600" />
        <h4 className="font-semibold">Stock Verification</h4>
      </div>

      <Alert>
        <AlertDescription className="text-sm">
          Manually verify stock availability before processing this order. Check the platform URLs
          or official brand websites.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        {order.products.map((product, idx) => {
          const productId = `${order.id}-${product.productId}`;
          const currentStatus = stockStatuses[productId];

          return (
            <div key={idx} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Product ID: {Number(product.productId)}</p>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {Number(product.quantity)}
                  </p>
                </div>
              </div>

              <RadioGroup
                value={currentStatus}
                onValueChange={(value) => handleStatusChange(productId, value as StockStatus)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="available" id={`${productId}-available`} />
                  <Label htmlFor={`${productId}-available`} className="cursor-pointer">
                    Available on Platform
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="check-official" id={`${productId}-official`} />
                  <Label htmlFor={`${productId}-official`} className="cursor-pointer">
                    Check Official Website
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unavailable" id={`${productId}-unavailable`} />
                  <Label htmlFor={`${productId}-unavailable`} className="cursor-pointer">
                    Unavailable
                  </Label>
                </div>
              </RadioGroup>

              {currentStatus === 'check-official' && (
                <div className="bg-muted p-3 rounded space-y-2">
                  <p className="text-sm font-medium">Suggested Official Websites:</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(officialWebsites).map(([brand, url]) => (
                      <Button key={brand} variant="outline" size="sm" asChild>
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          {brand.charAt(0).toUpperCase() + brand.slice(1)}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {currentStatus === 'unavailable' && (
                <Alert variant="destructive">
                  <AlertDescription className="text-sm">
                    This product is marked as unavailable. Consider contacting the customer.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
