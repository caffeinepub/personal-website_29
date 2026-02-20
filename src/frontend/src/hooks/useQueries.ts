import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product, Platform } from '../backend';

// Query to get all products
export function useGetAllProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

// Query to search products
export function useSearchProducts(searchTerm: string, platformFilter: Platform | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products', 'search', searchTerm, platformFilter],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchProducts(searchTerm, null, platformFilter);
    },
    enabled: !!actor && !isFetching,
  });
}

// Mutation to add a product
export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: {
      name: string;
      price: bigint;
      description: string;
      imageUrl: string;
      category: string;
      platform: Platform;
      productUrl: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addProduct(
        product.name,
        product.price,
        product.description,
        product.imageUrl,
        product.category,
        product.platform,
        product.productUrl
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
