import { useState } from 'react';
import { Package } from 'lucide-react';
import ProductCard from './ProductCard';
import ProductSearch from './ProductSearch';
import { useGetAllProducts, useSearchProducts } from '../hooks/useQueries';
import type { Platform } from '../backend';

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState<Platform | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const { data: allProducts, isLoading: isLoadingAll } = useGetAllProducts();
  const { data: searchResults, isLoading: isLoadingSearch } = useSearchProducts(
    searchTerm,
    platformFilter
  );

  const handleSearch = (term: string, platform: Platform | null) => {
    setSearchTerm(term);
    setPlatformFilter(platform);
    setIsSearching(term.length > 0 || platform !== null);
  };

  const products = isSearching ? searchResults : allProducts;
  const isLoading = isSearching ? isLoadingSearch : isLoadingAll;

  return (
    <section id="products" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Package className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4">
            Product Index
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse products from Amazon, Flipkart, Meesho, BlinkIt, and other shopping platforms
          </p>
        </div>

        <ProductSearch onSearch={handleSearch} />

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
            {products.map((product) => (
              <ProductCard key={Number(product.id)} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No products found
            </h3>
            <p className="text-muted-foreground">
              {isSearching
                ? 'Try adjusting your search or filters'
                : 'Products will appear here once added'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
