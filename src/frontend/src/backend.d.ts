import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export type Platform = {
    __kind__: "flipkart";
    flipkart: null;
} | {
    __kind__: "other";
    other: string;
} | {
    __kind__: "amazon";
    amazon: null;
} | {
    __kind__: "blinkit";
    blinkit: null;
} | {
    __kind__: "meesho";
    meesho: null;
};
export interface Order {
    id: bigint;
    total: bigint;
    paymentStatus: PaymentStatus;
    customer: CustomerInfo;
    orderStatus: OrderStatus;
    createdBy: Principal;
    orderDate: Time;
    fulfillmentNotes?: string;
    products: Array<OrderedProduct>;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface OrderedProduct {
    productId: bigint;
    quantity: bigint;
    priceAtPurchase: bigint;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface CustomerInfo {
    name: string;
    email: string;
    shippingAddress: string;
    phone: string;
}
export interface Product {
    id: bigint;
    productUrl: string;
    name: string;
    description: string;
    platform: Platform;
    imageUrl: string;
    listedPrice: bigint;
    category: string;
    price: bigint;
}
export interface UserProfile {
    name: string;
    email: string;
    shippingAddress: string;
    phone: string;
}
export enum OrderStatus {
    shipped = "shipped",
    cancelled = "cancelled",
    pending = "pending",
    delivered = "delivered",
    processing = "processing"
}
export enum PaymentStatus {
    pending = "pending",
    completed = "completed",
    failed = "failed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addFulfillmentNotes(orderId: bigint, notes: string): Promise<void>;
    addProduct(name: string, price: bigint, description: string, imageUrl: string, category: string, platform: Platform, productUrl: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createOrder(customer: CustomerInfo, products: Array<OrderedProduct>, total: bigint): Promise<bigint>;
    getAllOrders(page: bigint, pageSize: bigint): Promise<Array<Order>>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyOrders(): Promise<Array<Order>>;
    getOrderById(orderId: bigint): Promise<Order | null>;
    getPriceMarkupPercentage(): Promise<bigint>;
    getProduct(productId: bigint): Promise<Product | null>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    getProductsByPlatform(platform: Platform): Promise<Array<Product>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchProducts(searchTerm: string, categoryFilter: string | null, platformFilter: Platform | null): Promise<Array<Product>>;
    setPriceMarkupPercentage(percentage: bigint): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateOrderStatus(orderId: bigint, newStatus: OrderStatus): Promise<void>;
    updatePaymentStatus(orderId: bigint, newStatus: PaymentStatus): Promise<void>;
    updateProductPrice(productId: bigint, newPrice: bigint): Promise<void>;
}
