import { ExternalLink, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ReturnPolicyDisplayProps {
  platform: string;
}

const platformPolicies = {
  amazon: {
    name: 'Amazon',
    returnPeriod: '30 days',
    policyUrl: 'https://www.amazon.in/gp/help/customer/display.html?nodeId=GKM69DUUYKQWKWX7',
  },
  flipkart: {
    name: 'Flipkart',
    returnPeriod: '10 days',
    policyUrl: 'https://www.flipkart.com/pages/returnpolicy',
  },
  meesho: {
    name: 'Meesho',
    returnPeriod: '7 days',
    policyUrl: 'https://www.meesho.com/legal/returns-and-refunds',
  },
  blinkit: {
    name: 'BlinkIt',
    returnPeriod: 'Varies by product',
    policyUrl: 'https://blinkit.com/help',
  },
};

export default function ReturnPolicyDisplay({ platform }: ReturnPolicyDisplayProps) {
  const policy = platformPolicies[platform as keyof typeof platformPolicies] || platformPolicies.amazon;

  return (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertDescription>
        <div className="space-y-2">
          <p className="font-semibold">Returns & Refunds</p>
          <p className="text-sm">
            Returns accepted only if <strong>{policy.name}</strong> accepts returns.
          </p>
          <p className="text-sm text-muted-foreground">
            Return eligibility: <strong>{policy.returnPeriod}</strong> from delivery
          </p>
          <Button variant="link" className="h-auto p-0 text-sm" asChild>
            <a href={policy.policyUrl} target="_blank" rel="noopener noreferrer">
              View {policy.name} Return Policy
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
