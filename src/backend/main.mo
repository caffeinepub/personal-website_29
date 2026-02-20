import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Stripe "stripe/stripe";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import OutCall "http-outcalls/outcall";

actor {
  type Platform = {
    #amazon;
    #flipkart;
    #meesho;
    #blinkit;
    #other : Text;
  };

  type Product = {
    id : Nat;
    name : Text;
    price : Nat;
    description : Text;
    imageUrl : Text;
    category : Text;
    platform : Platform;
    productUrl : Text;
    listedPrice : Nat;
  };

  type CustomerInfo = {
    name : Text;
    email : Text;
    phone : Text;
    shippingAddress : Text;
  };

  type OrderedProduct = {
    productId : Nat;
    quantity : Nat;
    priceAtPurchase : Nat;
  };

  type OrderStatus = {
    #pending;
    #processing;
    #shipped;
    #delivered;
    #cancelled;
  };

  type PaymentStatus = {
    #pending;
    #completed;
    #failed;
  };

  type Order = {
    id : Nat;
    customer : CustomerInfo;
    products : [OrderedProduct];
    total : Nat;
    orderStatus : OrderStatus;
    paymentStatus : PaymentStatus;
    orderDate : Time.Time;
    fulfillmentNotes : ?Text;
    createdBy : Principal;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
    shippingAddress : Text;
  };

  type CheckoutSession = {
    sessionId : Text;
    createdBy : Principal;
    createdAt : Time.Time;
  };

  // State
  var nextProductId = 0;
  var nextOrderId = 0;
  let products = Map.empty<Nat, Product>();
  let orders = Map.empty<Nat, Order>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let checkoutSessions = Map.empty<Text, CheckoutSession>();
  var priceMarkupPercentage : Nat = 0;

  // Include core authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Functions
  public shared ({ caller }) func addProduct(name : Text, price : Nat, description : Text, imageUrl : Text, category : Text, platform : Platform, productUrl : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    let productId = nextProductId;
    let listedPrice = price + ((price * priceMarkupPercentage) / 100);
    let product : Product = {
      id = productId;
      name;
      price;
      description;
      imageUrl;
      category;
      platform;
      productUrl;
      listedPrice;
    };
    products.add(productId, product);
    nextProductId += 1;
    productId;
  };

  public query func getProduct(productId : Nat) : async ?Product {
    // Public read access - anyone can view products
    products.get(productId);
  };

  public query func getAllProducts() : async [Product] {
    // Public read access - anyone can view products
    let allProducts = List.empty<Product>();
    for ((_, product) in products.entries()) {
      allProducts.add(product);
    };
    allProducts.toArray();
  };

  public shared ({ caller }) func updateProductPrice(productId : Nat, newPrice : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) {
        let updatedProduct : Product = {
          product with
          price = newPrice;
          listedPrice = newPrice + ((newPrice * priceMarkupPercentage) / 100);
        };
        products.add(productId, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func setPriceMarkupPercentage(percentage : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set markup");
    };
    priceMarkupPercentage := percentage;
    // Update listed prices for all products
    for ((id, product) in products.entries()) {
      let updatedProduct : Product = {
        product with
        listedPrice = product.price + ((product.price * percentage) / 100);
      };
      products.add(id, updatedProduct);
    };
  };

  public query ({ caller }) func getPriceMarkupPercentage() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view markup");
    };
    priceMarkupPercentage;
  };

  // Order Functions
  public shared ({ caller }) func createOrder(customer : CustomerInfo, products : [OrderedProduct], total : Nat) : async Nat {
    // Allow any authenticated user (including guests) to create orders for checkout
    // This is necessary for the e-commerce flow
    let orderId = nextOrderId;
    let order : Order = {
      id = orderId;
      customer;
      products;
      total;
      orderStatus = #pending;
      paymentStatus = #pending;
      orderDate = Time.now();
      fulfillmentNotes = null;
      createdBy = caller;
    };
    orders.add(orderId, order);
    nextOrderId += 1;
    orderId;
  };

  public query ({ caller }) func getOrderById(orderId : Nat) : async ?Order {
    switch (orders.get(orderId)) {
      case (null) { null };
      case (?order) {
        // Only the order creator or admins can view the order
        if (order.createdBy != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
        ?order;
      };
    };
  };

  public query ({ caller }) func getMyOrders() : async [Order] {
    // Users can view their own orders
    let myOrders = List.empty<Order>();
    for ((_, order) in orders.entries()) {
      if (order.createdBy == caller) {
        myOrders.add(order);
      };
    };
    myOrders.toArray();
  };

  public query ({ caller }) func getAllOrders(page : Nat, pageSize : Nat) : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    let allOrders = List.empty<Order>();
    for ((_, order) in orders.entries()) {
      allOrders.add(order);
    };
    let ordersArray = allOrders.toArray();
    let start = page * pageSize;
    let end = Nat.min(start + pageSize, ordersArray.size());
    ordersArray.sliceToArray(start, end);
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, newStatus : OrderStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder : Order = { order with orderStatus = newStatus };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public shared ({ caller }) func updatePaymentStatus(orderId : Nat, newStatus : PaymentStatus) : async () {
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        // Only the order creator or admins can update payment status
        if (order.createdBy != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only update your own order payment status");
        };
        let updatedOrder : Order = { order with paymentStatus = newStatus };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public shared ({ caller }) func addFulfillmentNotes(orderId : Nat, notes : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add fulfillment notes");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder : Order = { order with fulfillmentNotes = ?notes };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  // Search and Filtering Functions
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

  // Stripe Integration
  var stripeConfig : ?Stripe.StripeConfiguration = null;

  public query ({ caller }) func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    let config = getStripeConfiguration();
    let sessionId = await Stripe.createCheckoutSession(config, caller, items, successUrl, cancelUrl, transform);

    // Track the session for authorization purposes
    let session : CheckoutSession = {
      sessionId;
      createdBy = caller;
      createdAt = Time.now();
    };
    checkoutSessions.add(sessionId, session);

    sessionId;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    stripeConfig := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    // Verify the session belongs to the caller or caller is admin
    switch (checkoutSessions.get(sessionId)) {
      case (null) {
        // Session not tracked, allow admins only
        if (not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Session not found or access denied");
        };
      };
      case (?session) {
        if (session.createdBy != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only check your own payment sessions");
        };
      };
    };

    let stripe = getStripeConfiguration();
    await Stripe.getSessionStatus(stripe, sessionId, transform);
  };

  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };
};
