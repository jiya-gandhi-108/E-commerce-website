function renderNav() {
      navLinks.innerHTML = navItems.map(([route,label]) => `<button class="nav-link ${state.route === route ? "active" : ""}" data-route="${route}">${label}</button>`).join("");
      document.querySelectorAll("[data-route]").forEach(btn => btn.onclick = () => navigate(btn.dataset.route));
    }

    function navigate(route, productId) {
      state.route = route;
      if (productId) {
        state.selectedProduct = productId;
        state.galleryIndex = 0;
        const p = getProduct(productId);
        state.selectedSize = p.size[0];
        state.selectedColor = p.colors[0];
      }
      navLinks.classList.remove("open");
      render();
      window.scrollTo({top:0, behavior:"smooth"});
    }

    function updateCounters() {
      document.getElementById("cartCount").textContent = cartQty();
      document.getElementById("wishCount").textContent = state.wishlist.length;
    }

    function productCard(p) {
      const activeWish = state.wishlist.includes(p.id) ? "active" : "";
      return `
        <article class="product-card reveal">
          <div class="product-media" onclick="navigate('product', ${p.id})">
            <img src="${p.img}" alt="${p.name}">
            <div class="badge-row">
              <span class="badge ${p.stock <= 3 ? "hot" : ""}">${p.discount}% OFF</span>
              <span class="badge soft">${p.badge}</span>
            </div>
          </div>
          <button class="wishlist ${activeWish}" onclick="toggleWishlist(${p.id})" aria-label="Wishlist ${p.name}">♥</button>
          <div class="product-body">
            <div class="rating">★★★★★ <span>${p.rating} (${p.reviews})</span></div>
            <h3 class="product-title" onclick="navigate('product', ${p.id})">${p.name}</h3>
            <div class="product-meta">${p.material}</div>
            <div class="price-row">
              <span class="price">${money(p.price)}</span>
              <span class="mrp">${money(p.mrp)}</span>
              <span class="save">Save ${money(p.mrp - p.price)}</span>
            </div>
            <div class="card-actions">
              <button class="btn primary" onclick="addToCart(${p.id})">Add to Cart</button>
              <button class="quick" onclick="toggleCompare(${p.id})">${state.compare.includes(p.id) ? "✓" : "⇄"}</button>
            </div>
          </div>
        </article>`;
    }

    function homePage() {
      const featured = products.slice(0, 4);
      const trending = products.filter(p => ["Trending","Hot Deal","Bestseller","Only 3 left"].includes(p.badge)).slice(0, 4);
      const best = [...products].sort((a,b) => b.reviews - a.reviews).slice(0,4);
      return `
        <section class="hero">
          <div class="hero-inner">
            <div class="hero-copy reveal">
              <p class="eyebrow">Premium carpets delivered to your door</p>
              <h1>Transform your home with carpets people notice.</h1>
              <p class="lead">Shop plush wool, Persian, jute, washable, and designer carpets with free shipping, secure checkout, and easy returns.</p>
              <div class="hero-actions">
                <button class="btn primary pulse" onclick="navigate('shop')">Shop Flat 40% Off</button>
                <button class="btn ghost" onclick="navigate('offers')">View Today’s Deals</button>
              </div>
              <div class="hero-proof">
                <span>✓ 18,000+ happy homes</span>
                <span>✓ 4.8 average rating</span>
                <span>✓ Free insured shipping</span>
              </div>
            </div>
          </div>
        </section>
        <div class="container"><div class="sale-banner reveal">
          <div><strong>Flat 40% Off</strong> on premium carpets. Extra 10% with code IBRAHIM40. Free shipping ends tonight.</div>
          <div class="timer" id="heroTimer">${timerBoxes()}</div>
        </div></div>
        ${trustSection()}
        ${productSection("Featured Carpets", "Hand-picked carpets that convert empty rooms into styled spaces.", featured)}
        ${offerStrip()}
        ${productSection("Trending Now", "Fast-moving designs with high review scores and low stock alerts.", trending)}
        ${productSection("Best Sellers", "Customer favorites with proven quality, comfort, and room impact.", best)}
        ${testimonialsSection()}
        ${policySection()}
        ${faqSection(true)}
        ${newsletterSection()}
      `;
    }

    function timerBoxes() {
      return `<div class="time-box"><b id="hh">05</b><small>Hours</small></div><div class="time-box"><b id="mm">42</b><small>Mins</small></div><div class="time-box"><b id="ss">18</b><small>Secs</small></div>`;
    }

    function trustSection() {
      return `<section class="section tight"><div class="container"><div class="trust-grid reveal">
        ${[
          ["🚚","Free Shipping","Insured doorstep delivery on every prepaid carpet order."],
          ["↩","7-Day Returns","Try it at home. Return easily if the size or style is not right."],
          ["🔒","Secure Checkout","Protected payment simulation with trust-first checkout design."],
          ["☎","WhatsApp Support","Get quick sizing help before ordering."]
        ].map(i => `<div class="trust-item"><div class="icon">${i[0]}</div><strong>${i[1]}</strong><p>${i[2]}</p></div>`).join("")}
      </div></div></section>`;
    }

    function productSection(title, text, list) {
      return `<section class="section"><div class="container">
        <div class="section-head reveal"><div><p class="eyebrow">Limited stock</p><h2>${title}</h2></div><p>${text}</p></div>
        <div class="product-grid">${list.map(productCard).join("")}</div>
      </div></section>`;
    }

    function offerStrip() {
      return `<section class="section offer-band"><div class="container"><div class="offer-grid">
        <div class="reveal">
          <p class="eyebrow">Today’s conversion offer</p>
          <h2>Buy premium texture now. Pay less than showroom pricing.</h2>
          <p class="lead">Direct-to-home pricing, seasonal inventory deals, and free shipping remove the usual friction from buying large carpets online.</p>
          <div class="coupon-row"><span class="coupon">IBRAHIM40</span><button class="btn primary" onclick="applyCoupon('IBRAHIM40'); openCart()">Apply Coupon</button></div>
        </div>
        <div class="offer-panel reveal">
          <h3>Live store activity</h3>
          <p><strong id="visitorCount">127</strong> shoppers are viewing carpet deals right now.</p>
          <p><strong>23 orders</strong> placed in the last 6 hours.</p>
          <div class="progress"><span></span></div>
          <p style="margin-top:10px;color:var(--danger);font-weight:900">Sale inventory is moving quickly.</p>
        </div>
      </div></div></section>`;
    }

    function shopPage() {
      let list = products.filter(p => {
        const q = state.search.toLowerCase();
        return (!q || `${p.name} ${p.category} ${p.style} ${p.material}`.toLowerCase().includes(q))
          && (state.category === "All" || p.category === state.category)
          && (state.style === "All" || p.style === state.style);
      });
      if (state.sort === "priceLow") list.sort((a,b) => a.price - b.price);
      if (state.sort === "priceHigh") list.sort((a,b) => b.price - a.price);
      if (state.sort === "rating") list.sort((a,b) => b.rating - a.rating);
      if (state.sort === "discount") list.sort((a,b) => b.discount - a.discount);
      return `
        ${pageTitle("Shop Premium Carpets", "Filter by material, style, price, rating, and urgency. Every carpet includes free shipping and secure checkout visuals.")}
        <section class="section"><div class="container">
          <div class="filters reveal">
            <input class="field" id="searchInput" placeholder="Search carpets, material, style..." value="${state.search}">
            ${selectField("categoryFilter", ["All", ...new Set(products.map(p => p.category))], state.category)}
            ${selectField("styleFilter", ["All", ...new Set(products.map(p => p.style))], state.style)}
            ${selectField("sortFilter", [["featured","Featured"],["priceLow","Price: Low to High"],["priceHigh","Price: High to Low"],["rating","Top Rated"],["discount","Best Discount"]], state.sort)}
            <button class="btn primary" onclick="clearFilters()">Reset</button>
          </div>
          <div class="section-head reveal"><div><p class="eyebrow">${list.length} carpets found</p><h2>Ready-to-ship designs</h2></div><p>Use wishlist and comparison to shortlist, then checkout with IBRAHIM40 for extra savings.</p></div>
          <div class="product-grid">${list.length ? list.map(productCard).join("") : `<div class="empty">No carpets match your filters.</div>`}</div>
          ${compareSection()}
        </div></section>`;
    }

    function selectField(id, options, value) {
      return `<select class="field" id="${id}">${options.map(o => Array.isArray(o) ? `<option value="${o[0]}" ${o[0] === value ? "selected" : ""}>${o[1]}</option>` : `<option value="${o}" ${o === value ? "selected" : ""}>${o}</option>`).join("")}</select>`;
    }

    function pageTitle(title, text) {
      return `<section class="page-title"><div class="container"><p class="eyebrow">Ibrahim Trading Co.</p><h1>${title}</h1><p>${text}</p></div></section>`;
    }

    function productPage() {
      const p = getProduct(state.selectedProduct);
      const img = p.gallery[state.galleryIndex] || p.img;
      return `
        ${pageTitle(p.name, p.desc)}
        <section class="section"><div class="container">
          <div class="product-detail">
            <div class="reveal">
              <div class="gallery-main"><img src="${img}" alt="${p.name}"></div>
              <div class="thumbs">${p.gallery.map((g,i) => `<button class="thumb ${i === state.galleryIndex ? "active" : ""}" onclick="setGallery(${i})"><img src="${g}" alt="${p.name} view ${i+1}"></button>`).join("")}</div>
              <div class="tabs">
                <button class="tab active" onclick="switchTab(this,'details')">Details</button>
                <button class="tab" onclick="switchTab(this,'shipping')">Shipping</button>
                <button class="tab" onclick="switchTab(this,'reviews')">Reviews</button>
              </div>
              <div class="tab-content" id="tabContent">${detailText(p, "details")}</div>
            </div>
            <aside class="detail-panel reveal">
              <div class="rating">★★★★★ <span>${p.rating} from ${p.reviews} reviews</span></div>
              <h2>${p.name}</h2>
              <div class="price-row"><span class="price">${money(p.price)}</span><span class="mrp">${money(p.mrp)}</span><span class="save">${p.discount}% OFF</span></div>
              <p>${p.desc}</p>
              <div class="stock-line">● ${p.stock <= 3 ? "Only 3 left in this design" : p.stock + " pieces available"} <span id="liveViews"></span></div>
              <div class="progress"><span style="width:${Math.max(18, 100 - p.stock * 7)}%"></span></div>
              <h3>Choose Size</h3>
              <div class="sizes">${p.size.map(s => `<button class="choice ${s === state.selectedSize ? "active" : ""}" onclick="selectSize('${s}')">${s}</button>`).join("")}</div>
              <h3>Choose Color</h3>
              <div class="swatches">${p.colors.map(c => `<button class="choice ${c === state.selectedColor ? "active" : ""}" onclick="selectColor('${c}')"><span class="swatch-dot" style="background:${colorValue(c)}"></span>${c}</button>`).join("")}</div>
              <button class="btn primary full sticky-buy" onclick="addToCart(${p.id}, true)">Add to Cart - ${money(p.price)}</button>
              <button class="btn ghost full" style="margin-top:10px" onclick="toggleWishlist(${p.id})">${state.wishlist.includes(p.id) ? "Saved to Wishlist" : "Add to Wishlist"}</button>
              <div class="secure-row"><span>🔒 Secure checkout</span><span>🚚 Free shipping</span><span>↩ Easy returns</span></div>
            </aside>
          </div>
        </div></section>
        ${productSection("Pairs Well With", "Complete the room with these matching customer favorites.", products.filter(x => x.id !== p.id).slice(0,4))}
      `;
    }

    function colorValue(c) {
      const map = {Ivory:"#eee7db",Charcoal:"#2a2d2c",Emerald:"#0f7a4f",Ruby:"#8d2232",Navy:"#1d3557",Sand:"#d8c4a5",Snow:"#f7f7f4",Oat:"#d6c8b3",Slate:"#6b7475",Black:"#101312",Wine:"#7d2338",Cream:"#efe3ca",Natural:"#c8a979",Taupe:"#9b8975",Gold:"#c99b46",Beige:"#d8c5a9",Mint:"#a9d8bd",Blush:"#e8b8b8",Sky:"#9fc7df",Grey:"#9aa0a0",Terracotta:"#b96542",Indigo:"#2f4f75",Silver:"#c7caca",Champagne:"#dfc894",Forest:"#3d6b4a",Graphite:"#494d4d",Camel:"#b48654",Blue:"#456c91"};
      return map[c] || "#ddd";
    }

    function detailText(p, tab) {
      if (tab === "shipping") return "Free insured shipping is included. Orders are packed with edge protection and tracking updates. Delivery usually takes 4 to 7 business days depending on your city.";
      if (tab === "reviews") return `"Beautiful quality and very premium underfoot." - Verified Buyer<br><br>"The size guide helped me choose correctly and the room looks complete now." - Verified Buyer`;
      return `${p.material}. ${p.desc} Designed for modern Indian homes with durable finishing, rich texture, and easy maintenance guidance included in the box.`;
    }

    function offersPage() {
      return `
        ${pageTitle("Today’s Carpet Offers", "Aggressive direct-to-home pricing with coupon stacking, low-stock urgency, and free shipping.")}
        ${offerStrip()}
        ${productSection("Deal Zone", "These carpets combine high discount depth with strong customer demand.", products.filter(p => p.discount >= 40).slice(0,8))}
      `;
    }

    function cartPage() {
      return `
        ${pageTitle("Shopping Cart", "Review your selected carpets, apply IBRAHIM40, and move to secure checkout.")}
        <section class="section"><div class="container"><div class="cart-layout">
          <div class="cart-list">${cartContent(false)}</div>
          ${summaryBox()}
        </div></div></section>`;
    }

    function cartContent(drawer) {
      if (!state.cart.length) return `<div class="empty">Your cart is empty. Add a premium carpet before the sale timer ends.<br><br><button class="btn primary" onclick="navigate('shop')">Shop Carpets</button></div>`;
      return state.cart.map(item => {
        const p = getProduct(item.id);
        return `<div class="cart-row">
          <img class="cart-img" src="${p.img}" alt="${p.name}">
          <div>
            <strong>${p.name}</strong>
            <p style="margin:6px 0;color:var(--muted);font-size:13px">${item.size || p.size[0]} · ${item.color || p.colors[0]}</p>
            <div class="qty"><button onclick="changeQty(${p.id}, -1)">−</button><span>${item.qty}</span><button onclick="changeQty(${p.id}, 1)">+</button></div>
          </div>
          <div style="text-align:right">
            <strong>${money(p.price * item.qty)}</strong><br>
            <button class="nav-link" onclick="removeItem(${p.id})">Remove</button>
          </div>
        </div>`;
      }).join("");
    }

    function summaryBox() {
      return `<aside class="summary-box">
        <h3>Order Summary</h3>
        <div class="summary-line"><span>Subtotal</span><strong>${money(cartSubtotal())}</strong></div>
        <div class="summary-line"><span>Shipping</span><strong style="color:var(--emerald)">FREE</strong></div>
        <div class="summary-line"><span>Coupon discount</span><strong>-${money(discount())}</strong></div>
        <div class="coupon-form"><input class="field" id="couponInput" placeholder="Coupon code" value="${state.coupon}"><button class="btn primary" onclick="applyCoupon(document.getElementById('couponInput').value)">Apply</button></div>
        <div class="summary-line total"><span>Total</span><span>${money(total())}</span></div>
        <button class="btn primary full pulse" onclick="navigate('checkout')" ${!state.cart.length ? "disabled" : ""}>Secure Checkout</button>
        <div class="secure-row"><span>🔒 SSL secure</span><span>✓ Free returns</span><span>☎ WhatsApp help</span></div>
      </aside>`;
    }

    function checkoutPage() {
      return `
        ${pageTitle("Secure Checkout", "Complete your order simulation with delivery details and payment trust cues.")}
        <section class="section"><div class="container"><div class="checkout-layout">
          <div class="checkout-form">
            <h3>Delivery Details</h3>
            <div class="form-grid">
              <input class="field" placeholder="First name">
              <input class="field" placeholder="Last name">
              <input class="field wide" placeholder="Email address">
              <input class="field wide" placeholder="Mobile number">
              <input class="field wide" placeholder="Full address">
              <input class="field" placeholder="City">
              <input class="field" placeholder="PIN code">
              <select class="field wide"><option>Prepaid secure payment</option><option>Cash on delivery</option><option>UPI on delivery</option></select>
            </div>
            <button class="btn primary full pulse" style="margin-top:14px" onclick="placeOrder()">Place Order</button>
          </div>
          ${summaryBox()}
        </div></div></section>`;
    }

    function trackPage() {
      return `
        ${pageTitle("Track Your Order", "Enter your order ID to view a polished delivery tracking simulation.")}
        <section class="section"><div class="container">
          <div class="track-box reveal">
            <div class="form-grid">
              <input class="field" id="trackInput" placeholder="Enter order ID, e.g. ITC48291">
              <button class="btn primary" onclick="showTracking()">Track Order</button>
            </div>
            <div id="trackingResult" class="track-steps">
              ${trackingSteps()}
            </div>
          </div>
        </div></section>`;
    }

    function trackingSteps() {
      return `
        <div class="step"><div class="step-dot">✓</div><div><strong>Order confirmed</strong><p>Your carpet order has been received and packed.</p></div></div>
        <div class="step"><div class="step-dot">✓</div><div><strong>Quality checked</strong><p>Edges, size, and finish verified before dispatch.</p></div></div>
        <div class="step"><div class="step-dot">✓</div><div><strong>Shipped</strong><p>Package is moving through the delivery network.</p></div></div>
        <div class="step pending"><div class="step-dot">4</div><div><strong>Out for delivery</strong><p>Expected within 24 to 48 hours.</p></div></div>`;
    }

    function faqPage() {
      return `${pageTitle("Frequently Asked Questions", "Everything buyers need before confidently ordering carpets online.")}${faqSection(false)}`;
    }

    function faqSection(home) {
      return `<section class="section"><div class="container">
        <div class="section-head reveal"><div><p class="eyebrow">Buyer confidence</p><h2>${home ? "Questions before you buy" : "FAQs"}</h2></div><p>Clear answers reduce hesitation and help you order the right carpet faster.</p></div>
        <div class="faq-list">${faqs.map((f,i) => `<div class="faq-item ${i === 0 ? "open" : ""}"><button class="faq-q" onclick="toggleFaq(this)">${f[0]}<span>+</span></button><div class="faq-a">${f[1]}</div></div>`).join("")}</div>
      </div></section>`;
    }

    function aboutPage() {
      return `
        ${pageTitle("About Ibrahim Trading Co.", "A modern carpet destination built around premium feel, transparent pricing, and buyer confidence.")}
        <section class="section"><div class="container"><div class="info-grid">
          <div class="info-card reveal"><div class="icon">✦</div><h3>Curated Quality</h3><p>We shortlist carpets by texture, finish, durability, and room impact so buyers can choose faster.</p></div>
          <div class="info-card reveal"><div class="icon">₹</div><h3>Direct Pricing</h3><p>Our offer-led model simulates showroom-quality shopping with better online conversion value.</p></div>
          <div class="info-card reveal"><div class="icon">✓</div><h3>Trust First</h3><p>Clear policies, reviews, checkout cues, and support UI remove friction at every step.</p></div>
        </div></div></section>
        ${testimonialsSection()}`;
    }

    function contactPage() {
      return `
        ${pageTitle("Contact Us", "Get sizing help, order support, or WhatsApp guidance before buying.")}
        <section class="section"><div class="container"><div class="checkout-layout">
          <div class="checkout-form reveal">
            <h3>Send a Message</h3>
            <div class="form-grid">
              <input class="field" placeholder="Your name">
              <input class="field" placeholder="Mobile number">
              <input class="field wide" placeholder="Email address">
              <textarea class="field wide" placeholder="Tell us about your room, preferred size, or order question"></textarea>
            </div>
            <button class="btn primary" style="margin-top:12px" onclick="alert('Message sent. Our carpet specialist will contact you shortly.')">Submit</button>
          </div>
          <div class="summary-box reveal">
            <h3>Store Support</h3>
            <p><strong>WhatsApp:</strong> +91 98765 43210</p>
            <p><strong>Email:</strong> care@ibrahimtrading.example</p>
            <p><strong>Hours:</strong> 10 AM to 8 PM</p>
            <button class="btn primary full" onclick="whatsapp()">Order on WhatsApp</button>
          </div>
        </div></div></section>`;
    }

    function testimonialsSection() {
      return `<section class="section offer-band"><div class="container">
        <div class="section-head reveal"><div><p class="eyebrow">Social proof</p><h2>Loved by real home buyers</h2></div><p>Review-led confidence for middle and upper-middle-class online buyers.</p></div>
        <div class="review-grid">${testimonials.map(t => `<div class="testimonial reveal"><div class="rating">★★★★★</div><p>“${t[2]}”</p><div class="avatar-row"><div class="avatar">${t[0]}</div><div><strong>${t[1]}</strong><br><span style="color:var(--muted);font-size:13px">Verified buyer</span></div></div></div>`).join("")}</div>
      </div></section>`;
    }

    function policySection() {
      return `<section class="section"><div class="container"><div class="info-grid">
        <div class="info-card reveal"><div class="icon">↩</div><h3>7-Day Easy Returns</h3><p>Try the carpet in your room. If it is not the right fit, start a simple return.</p></div>
        <div class="info-card reveal"><div class="icon">🚚</div><h3>Fast Delivery</h3><p>Most orders are dispatched within 24 hours with insured packaging and tracking.</p></div>
        <div class="info-card reveal"><div class="icon">♢</div><h3>Premium Finish</h3><p>Every design is selected for texture, room presence, and long-term everyday use.</p></div>
      </div></div></section>`;
    }

    function newsletterSection() {
      return `<section class="section"><div class="container"><div class="newsletter reveal">
        <div><p class="eyebrow">Private sale access</p><h2>Get 10% extra off your first order.</h2><p>Join 18,000+ home buyers receiving limited carpet drops and size restock alerts.</p></div>
        <div class="newsletter-form"><input class="field" placeholder="Enter email address"><button class="btn primary" onclick="alert('Offer unlocked: use IBRAHIM40 at checkout.')">Unlock Offer</button></div>
      </div></div></section>`;
    }

    function compareSection() {
      if (!state.compare.length) return "";
      const list = state.compare.map(getProduct);
      return `<section class="section tight"><div class="section-head"><div><p class="eyebrow">Comparison</p><h2>Compare shortlisted carpets</h2></div><button class="btn ghost" onclick="state.compare=[]; render()">Clear</button></div>
        <div class="product-grid">${list.map(p => `<div class="info-card"><img src="${p.img}" alt="${p.name}" style="height:150px;width:100%;object-fit:cover;border-radius:8px;margin-bottom:12px"><h3>${p.name}</h3><p>${p.material}</p><p><strong>${money(p.price)}</strong> · ${p.rating}★ · ${p.stock} left</p><button class="btn primary full" onclick="navigate('product',${p.id})">View</button></div>`).join("")}</div>
      </section>`;
    }

    function render() {
      renderNav();
      updateCounters();
      const pages = {home:homePage, shop:shopPage, product:productPage, offers:offersPage, cart:cartPage, checkout:checkoutPage, track:trackPage, faqs:faqPage, about:aboutPage, contact:contactPage};
      app.innerHTML = (pages[state.route] || homePage)();
      bindPageEvents();
      renderDrawer();
      revealSoon();
    }

    function bindPageEvents() {
      const searchInput = document.getElementById("searchInput");
      if (searchInput) {
        searchInput.onkeydown = e => { if (e.key === "Enter") { state.search = e.target.value; render(); } };
        searchInput.onchange = e => { state.search = e.target.value; render(); };
      }
      const categoryFilter = document.getElementById("categoryFilter");
      if (categoryFilter) categoryFilter.onchange = e => { state.category = e.target.value; render(); };
      const styleFilter = document.getElementById("styleFilter");
      if (styleFilter) styleFilter.onchange = e => { state.style = e.target.value; render(); };
      const sortFilter = document.getElementById("sortFilter");
      if (sortFilter) sortFilter.onchange = e => { state.sort = e.target.value; render(); };
    }

    function revealSoon() {
      const items = document.querySelectorAll(".reveal");
      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
      }, {threshold:.08});
      items.forEach(el => io.observe(el));
    }
