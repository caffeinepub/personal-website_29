import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from '@tanstack/react-router';
import PaymentSetup from '../components/PaymentSetup';
import NoEmailBanner from '../components/NoEmailBanner';
import type { CustomerInfo } from '../backend';

interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>();

  const onSubmit = (data: CheckoutFormData) => {
    const fullAddress = `${data.address}, ${data.city}, ${data.state} - ${data.postalCode}`;
    setCustomerInfo({
      name: data.name,
      email: data.email,
      phone: data.phone,
      shippingAddress: fullAddress,
    });
  };

  return (
    <div className="min-h-screen bg-muted/30 py-24">
      <div className="container mx-auto px-4 max-w-2xl">
        <NoEmailBanner />
        <PaymentSetup />

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  {...register('name', { required: 'Name is required' })}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  {...register('phone', {
                    required: 'Phone is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Invalid phone number (10 digits)',
                    },
                  })}
                  placeholder="9876543210"
                />
                {errors.phone && (
                  <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  {...register('address', { required: 'Address is required' })}
                  placeholder="123 Main Street"
                />
                {errors.address && (
                  <p className="text-sm text-destructive mt-1">{errors.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    {...register('city', { required: 'City is required' })}
                    placeholder="Mumbai"
                  />
                  {errors.city && (
                    <p className="text-sm text-destructive mt-1">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    {...register('state', { required: 'State is required' })}
                    placeholder="Maharashtra"
                  />
                  {errors.state && (
                    <p className="text-sm text-destructive mt-1">{errors.state.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="postalCode">Postal Code *</Label>
                <Input
                  id="postalCode"
                  {...register('postalCode', {
                    required: 'Postal code is required',
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: 'Invalid postal code (6 digits)',
                    },
                  })}
                  placeholder="400001"
                />
                {errors.postalCode && (
                  <p className="text-sm text-destructive mt-1">{errors.postalCode.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" size="lg">
                Continue to Payment
              </Button>
            </form>
          </CardContent>
        </Card>

        {customerInfo && (
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information Saved</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Your information has been saved. You can now proceed with payment.
                </p>
                <div className="mt-4 space-y-2 text-sm">
                  <p><strong>Name:</strong> {customerInfo.name}</p>
                  <p><strong>Email:</strong> {customerInfo.email}</p>
                  <p><strong>Phone:</strong> {customerInfo.phone}</p>
                  <p><strong>Address:</strong> {customerInfo.shippingAddress}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
