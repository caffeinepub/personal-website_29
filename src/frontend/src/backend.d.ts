import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: bigint;
    productUrl: string;
    name: string;
    description: string;
    platform: Platform;
    imageUrl: string;
    category: string;
    price: bigint;
}
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
export interface backendInterface {
    addProduct(name: string, price: bigint, description: string, imageUrl: string, category: string, platform: Platform, productUrl: string): Promise<bigint>;
    getAllProducts(): Promise<Array<Product>>;
    getProductById(productId: bigint): Promise<Product | null>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    getProductsByPlatform(platform: Platform): Promise<Array<Product>>;
    searchProducts(searchTerm: string, categoryFilter: string | null, platformFilter: Platform | null): Promise<Array<Product>>;
}
