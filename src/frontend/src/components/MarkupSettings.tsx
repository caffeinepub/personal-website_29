import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGetPriceMarkupPercentage, useSetPriceMarkupPercentage } from '../hooks/useQueries';

export default function MarkupSettings() {
  const { data: currentMarkup, isLoading } = useGetPriceMarkupPercentage();
  const setMarkup = useSetPriceMarkupPercentage();
  const [percentage, setPercentage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setMarkup.mutateAsync(BigInt(percentage));
      setPercentage('');
    } catch (error) {
      console.error('Failed to update markup:', error);
    }
  };

  if (isLoading) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Markup Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            Current markup: <strong>{currentMarkup?.toString() || '0'}%</strong>
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="markup">New Markup Percentage</Label>
            <Input
              id="markup"
              type="number"
              min="0"
              max="100"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              placeholder="Enter percentage (e.g., 20)"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              This percentage will be applied to all products. Existing products will be updated.
            </p>
          </div>

          <Button type="submit" disabled={setMarkup.isPending}>
            {setMarkup.isPending ? 'Updating...' : 'Update Markup'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
