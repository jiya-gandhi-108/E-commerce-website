function addToCart(id, open) {
      const p = getProduct(id);
      const existing = state.cart.find(item => item.id === id && item.size === (state.selectedSize || p.size[0]) && item.color === (state.selectedColor || p.colors[0]));
      if (existing) existing.qty += 1;
      else state.cart.push({id, qty:1, size:state.selectedSize || p.size[0], color:state.selectedColor || p.colors[0]});
      saveState();
      updateCounters();
      renderDrawer();
      if (open) openCart();
      showMiniMessage(`${p.name} added to cart`);
    }

    function changeQty(id, delta) {
      const item = state.cart.find(i => i.id === id);
      if (!item) return;
      item.qty += delta;
      if (item.qty <= 0) state.cart = state.cart.filter(i => i !== item);
      saveState();
      render();
    }

    function removeItem(id) {
      state.cart = state.cart.filter(i => i.id !== id);
      saveState();
      render();
    }

    function toggleWishlist(id) {
      state.wishlist = state.wishlist.includes(id) ? state.wishlist.filter(x => x !== id) : [...state.wishlist, id];
      saveState();
      render();
    }

    function toggleCompare(id) {
      if (state.compare.includes(id)) state.compare = state.compare.filter(x => x !== id);
      else state.compare = [...state.compare.slice(-2), id];
      render();
    }

    function applyCoupon(code) {
      state.coupon = (code || "").trim().toUpperCase();
      if (state.coupon !== "CARPET40") alert("Try CARPET40 for an extra discount.");
      render();
      showMiniMessage(state.coupon === "CARPET40" ? "Coupon CARPET40 applied" : "Coupon checked");
    }

    function clearFilters() {
      state.search = ""; state.category = "All"; state.style = "All"; state.sort = "featured"; render();
    }

    function openCart() {
      cartDrawer.classList.add("open");
      drawerOverlay.classList.add("open");
      document.body.classList.add("lock");
    }

    function closeCart() {
      cartDrawer.classList.remove("open");
      drawerOverlay.classList.remove("open");
      document.body.classList.remove("lock");
    }

    function renderDrawer() {
      drawerBody.innerHTML = cartContent(true);
      drawerFoot.innerHTML = state.cart.length ? `${summaryBox()}` : `<button class="btn primary full" onclick="navigate('shop'); closeCart()">Shop Best Sellers</button>`;
    }

    function setGallery(i) { state.galleryIndex = i; render(); }
    function selectSize(s) { state.selectedSize = s; render(); }
    function selectColor(c) { state.selectedColor = c; render(); }
    function switchTab(btn, tab) {
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById("tabContent").innerHTML = detailText(getProduct(state.selectedProduct), tab);
    }
    function toggleFaq(btn) { btn.parentElement.classList.toggle("open"); }
    function showTracking() { document.getElementById("trackingResult").innerHTML = trackingSteps(); showMiniMessage("Tracking details updated"); }

    function placeOrder() {
      if (!state.cart.length) { alert("Your cart is empty."); return; }
      state.cart = [];
      saveState();
      state.route = "track";
      render();
      alert("Order placed successfully. Your tracking ID is CDC48291.");
    }

    function whatsapp() {
      const text = encodeURIComponent("Hi Carpet Decors, I want help choosing a premium carpet.");
      window.open("https://wa.me/919876543210?text=" + text, "_blank");
    }

    function showMiniMessage(text) {
      const toast = document.getElementById("purchaseToast");
      const p = products[Math.floor(Math.random() * products.length)];
      toast.innerHTML = `<img src="${p.img}" alt=""><p><strong>${text}</strong><br>Free shipping and CARPET40 offer are active now.</p>`;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2800);
    }

    function randomPurchase() {
      const names = ["Ritika from Pune", "Arjun from Delhi", "Meera from Bengaluru", "Kabir from Jaipur", "Ananya from Mumbai"];
      const p = products[Math.floor(Math.random() * products.length)];
      const toast = document.getElementById("purchaseToast");
      toast.innerHTML = `<img src="${p.img}" alt=""><p><strong>${names[Math.floor(Math.random()*names.length)]}</strong> recently bought<br>${p.name}</p>`;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 4200);
    }

    function countdown() {
      let end = Date.now() + 1000 * 60 * 60 * 5 + 1000 * 60 * 42;
      setInterval(() => {
        const left = Math.max(0, end - Date.now());
        const h = String(Math.floor(left / 3600000)).padStart(2,"0");
        const m = String(Math.floor(left % 3600000 / 60000)).padStart(2,"0");
        const s = String(Math.floor(left % 60000 / 1000)).padStart(2,"0");
        ["hh","mm","ss"].forEach((id,i) => {
          const el = document.getElementById(id);
          if (el) el.textContent = [h,m,s][i];
        });
      }, 1000);
    }

    function visitorPulse() {
      setInterval(() => {
        const el = document.getElementById("visitorCount");
        if (el) el.textContent = 110 + Math.floor(Math.random() * 58);
        const live = document.getElementById("liveViews");
        if (live) live.textContent = `· ${18 + Math.floor(Math.random()*24)} viewing now`;
      }, 2500);
    }

    let exitShown = localStorage.getItem("lh_exit") === "1";
    function showExit() {
      if (exitShown) return;
      exitShown = true;
      localStorage.setItem("lh_exit","1");
      document.getElementById("exitOverlay").classList.add("open");
      document.getElementById("exitModal").classList.add("open");
    }
    function closeExit() {
      document.getElementById("exitOverlay").classList.remove("open");
      document.getElementById("exitModal").classList.remove("open");
    }

    document.getElementById("cartBtn").onclick = openCart;
    document.getElementById("mobileCart").onclick = openCart;
    document.getElementById("closeCart").onclick = closeCart;
    drawerOverlay.onclick = closeCart;
    document.getElementById("menuBtn").onclick = () => navLinks.classList.toggle("open");
    document.getElementById("searchBtn").onclick = () => navigate("shop");
    document.getElementById("wishlistBtn").onclick = () => {
      state.route = "shop";
      state.search = "";
      render();
      showMiniMessage(`${state.wishlist.length} carpet${state.wishlist.length === 1 ? "" : "s"} saved to wishlist`);
    };
    document.getElementById("topBtn").onclick = () => window.scrollTo({top:0, behavior:"smooth"});
    document.getElementById("whatsappBtn").onclick = whatsapp;
    document.getElementById("exitClose").onclick = closeExit;
    document.getElementById("exitOverlay").onclick = closeExit;
    document.getElementById("exitClaim").onclick = () => { closeExit(); applyCoupon("CARPET40"); };
    document.addEventListener("mouseleave", e => { if (e.clientY <= 0) showExit(); });
    window.addEventListener("hashchange", () => {
      const route = location.hash.replace("#","");
      if (navItems.some(i => i[0] === route)) { state.route = route; render(); }
    });

    window.toggleWishlist = toggleWishlist;
    window.toggleCompare = toggleCompare;
    window.addToCart = addToCart;
    window.navigate = navigate;
    window.applyCoupon = applyCoupon;
    window.clearFilters = clearFilters;
    window.changeQty = changeQty;
    window.removeItem = removeItem;
    window.setGallery = setGallery;
    window.selectSize = selectSize;
    window.selectColor = selectColor;
    window.switchTab = switchTab;
    window.toggleFaq = toggleFaq;
    window.showTracking = showTracking;
    window.placeOrder = placeOrder;
    window.openCart = openCart;
    window.closeCart = closeCart;
    window.whatsapp = whatsapp;

    render();
    countdown();
    visitorPulse();
    setInterval(randomPurchase, 9000);
    setTimeout(() => document.getElementById("skeleton").classList.add("hide"), 650);
    setTimeout(randomPurchase, 2300);
