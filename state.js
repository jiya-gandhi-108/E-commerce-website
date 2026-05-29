let state = {
      route: "home",
      cart: JSON.parse(localStorage.getItem("lh_cart") || "[]"),
      wishlist: JSON.parse(localStorage.getItem("lh_wishlist") || "[]"),
      compare: [],
      coupon: "",
      search: "",
      category: "All",
      style: "All",
      sort: "featured",
      selectedProduct: 1,
      galleryIndex: 0,
      selectedSize: "",
      selectedColor: ""
    };

    const app = document.getElementById("app");
    const navLinks = document.getElementById("navLinks");
    const cartDrawer = document.getElementById("cartDrawer");
    const drawerOverlay = document.getElementById("drawerOverlay");
    const drawerBody = document.getElementById("drawerBody");
    const drawerFoot = document.getElementById("drawerFoot");

    const money = n => "₹" + n.toLocaleString("en-IN");
    const saveState = () => {
      localStorage.setItem("lh_cart", JSON.stringify(state.cart));
      localStorage.setItem("lh_wishlist", JSON.stringify(state.wishlist));
    };
    const getProduct = id => products.find(p => p.id === Number(id));
    const cartQty = () => state.cart.reduce((sum, item) => sum + item.qty, 0);
    const cartSubtotal = () => state.cart.reduce((sum, item) => sum + getProduct(item.id).price * item.qty, 0);
    const discount = () => state.coupon.toUpperCase() === "CARPET40" ? Math.round(cartSubtotal() * .10) : 0;
    const total = () => Math.max(0, cartSubtotal() - discount());
