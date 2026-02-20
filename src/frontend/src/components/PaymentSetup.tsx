import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useIsStripeConfigured, useSetStripeConfiguration } from '../hooks/useQueries';
import { useIsCallerAdmin } from '../hooks/useQueries';

export default function PaymentSetup() {
  const { data: isConfigured, isLoading } = useIsStripeConfigured();
  const { data: isAdmin } = useIsCallerAdmin();
  const setConfig = useSetStripeConfiguration();
  const [secretKey, setSecretKey] = useState('');
  const [countries, setCountries] = useState('IN,US,GB');

  if (isLoading || isConfigured || !isAdmin) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setConfig.mutateAsync({
        secretKey,
        allowedCountries: countries.split(',').map((c) => c.trim()),
      });
    } catch (error) {
      console.error('Failed to configure Stripe:', error);
    }
  };

  return (
    <Card className="mb-8 border-orange-500">
      <CardHeader>
        <CardTitle>⚠️ Stripe Configuration Required</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <AlertDescription>
            As an admin, you need to configure Stripe before customers can make payments.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="secretKey">Stripe Secret Key</Label>
            <Input
              id="secretKey"
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="sk_test_..."
              required
            />
          </div>

          <div>
            <Label htmlFor="countries">Allowed Countries (comma-separated)</Label>
            <Input
              id="countries"
              value={countries}
              onChange={(e) => setCountries(e.target.value)}
              placeholder="IN,US,GB"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Example: IN, US, GB, CA (ISO country codes)
            </p>
          </div>

          <Button type="submit" disabled={setConfig.isPending}>
            {setConfig.isPending ? 'Configuring...' : 'Configure Stripe'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
