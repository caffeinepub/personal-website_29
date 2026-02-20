import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { X, AlertTriangle } from 'lucide-react';

export default function NoEmailBanner() {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem('emailBannerDismissed');
    if (isDismissed) {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('emailBannerDismissed', 'true');
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <Alert className="mb-6 border-orange-500 bg-orange-50 dark:bg-orange-950/20">
      <AlertTriangle className="h-5 w-5 text-orange-600" />
      <AlertDescription className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="font-semibold text-orange-900 dark:text-orange-100 mb-1">
            Email notifications are currently unavailable
          </p>
          <p className="text-sm text-orange-800 dark:text-orange-200">
            Please bookmark your order ID or take a screenshot for tracking. You can track your
            order at <span className="font-mono">/order-tracking</span> after login.
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDismiss}
          className="shrink-0 h-6 w-6 text-orange-600 hover:text-orange-900"
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
}
