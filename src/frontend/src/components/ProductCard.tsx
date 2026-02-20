import { ExternalLink, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Product } from '../backend';
import { useCart } from '../contexts/CartContext';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

const platformLogos: Record<string, string> = {
  amazon: '/assets/generated/amazon-logo.dim_64x64.png',
  flipkart: '/assets/generated/flipkart-logo.dim_64x64.png',
  meesho: '/assets/generated/meesho-logo.dim_64x64.png',
  blinkit: '/assets/generated/blinkit-logo.dim_64x64.png',
  other: '/assets/generated/generic-shop.dim_64x64.png',
};

const platformNames: Record<string, string> = {
  amazon: 'Amazon',
  flipkart: 'Flipkart',
  meesho: 'Meesho',
  blinkit: 'BlinkIt',
  other: 'Other',
};

export default function ProductCard({ product }: ProductCardProps) {
  const platformKey = product.platform.__kind__;
  const platformName = platformNames[platformKey] || platformKey;
  const platformLogo = platformLogos[platformKey] || platformLogos.other;
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const formatPrice = (price: bigint) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Number(price));
  };

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Card className="group overflow-hidden hover:shadow-warm transition-all duration-300 flex flex-col h-full">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <img
            src={platformLogo}
            alt={platformName}
            className="w-10 h-10 rounded-lg bg-background/90 p-1.5 shadow-md"
          />
        </div>
      </div>

      <CardContent className="flex-1 p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-lg text-foreground line-clamp-2 flex-1">
            {product.name}
          </h3>
        </div>

        <Badge variant="secondary" className="mb-3">
          {product.category}
        </Badge>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary">{formatPrice(product.listedPrice)}</span>
          {product.price !== product.listedPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          onClick={handleAddToCart}
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          disabled={added}
        >
          <ShoppingCart className="h-4 w-4" />
          {added ? 'Added!' : 'Add to Cart'}
        </Button>
        <Button variant="outline" size="icon" asChild>
          <a href={product.productUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
