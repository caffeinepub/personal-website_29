import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Iter "mo:core/Iter";

actor {
  // Type Definitions
  type Product = {
    id : Nat;
    name : Text;
    price : Nat;
    description : Text;
    imageUrl : Text;
    category : Text;
    platform : Platform;
    productUrl : Text;
  };

  type Platform = {
    #amazon;
    #flipkart;
    #meesho;
    #blinkit;
    #other : Text;
  };

  // State
  var nextProductId = 0;
  let products = Map.empty<Nat, Product>();

  // Add Product Functions
  public shared ({ caller }) func addProduct(name : Text, price : Nat, description : Text, imageUrl : Text, category : Text, platform : Platform, productUrl : Text) : async Nat {
    let productId = nextProductId;
    let product : Product = {
      id = productId;
      name;
      price;
      description;
      imageUrl;
      category;
      platform;
      productUrl;
    };
    products.add(productId, product);
    nextProductId += 1;
    productId;
  };

  // Search Functionality
  public query ({ caller }) func searchProducts(searchTerm : Text, categoryFilter : ?Text, platformFilter : ?Platform) : async [Product] {
    let filteredProducts = List.empty<Product>();

    for (product in products.values()) {
      let matchesSearch = product.name.contains(#text searchTerm) or product.description.contains(#text searchTerm);
      let matchesCategory = switch (categoryFilter) {
        case (null) { true };
        case (?category) { product.category == category };
      };
      let matchesPlatform = switch (platformFilter) {
        case (null) { true };
        case (?platform) { product.platform == platform };
      };

      if (matchesSearch and matchesCategory and matchesPlatform) {
        filteredProducts.add(product);
      };
    };

    filteredProducts.toArray();
  };

  // Helper Functions
  public query ({ caller }) func getProductById(productId : Nat) : async ?Product {
    products.get(productId);
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public query ({ caller }) func getProductsByPlatform(platform : Platform) : async [Product] {
    let filteredProducts = List.empty<Product>();
    for (product in products.values()) {
      if (product.platform == platform) {
        filteredProducts.add(product);
      };
    };
    filteredProducts.toArray();
  };

  public query ({ caller }) func getProductsByCategory(category : Text) : async [Product] {
    let filteredProducts = List.empty<Product>();
    for (product in products.values()) {
      if (product.category == category) {
        filteredProducts.add(product);
      };
    };
    filteredProducts.toArray();
  };
};
