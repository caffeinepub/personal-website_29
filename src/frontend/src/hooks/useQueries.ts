import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  Product,
  Platform,
  CustomerInfo,
  OrderedProduct,
  Order,
  OrderStatus,
  StripeConfiguration,
} from '../backend';

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

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      customer: CustomerInfo;
      products: OrderedProduct[];
      total: bigint;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createOrder(data.customer, data.products, data.total);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useMyOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['myOrders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllOrders(page: number, pageSize: number) {
  const { actor, isFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['orders', 'all', page, pageSize],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders(BigInt(page), BigInt(pageSize));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { orderId: bigint; newStatus: OrderStatus }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateOrderStatus(data.orderId, data.newStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useAddFulfillmentNotes() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { orderId: bigint; notes: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addFulfillmentNotes(data.orderId, data.notes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useGetPriceMarkupPercentage() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['priceMarkup'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getPriceMarkupPercentage();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetPriceMarkupPercentage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (percentage: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.setPriceMarkupPercentage(percentage);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['priceMarkup'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useIsStripeConfigured() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['stripeConfigured'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetStripeConfiguration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: StripeConfiguration) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.setStripeConfiguration(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stripeConfigured'] });
    },
  });
}
