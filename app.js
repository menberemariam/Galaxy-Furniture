(function () {
  'use strict';

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));
  const LS = {
    cart: 'galaxy_furniture_cart',
    wishlist: 'galaxy_furniture_wishlist',
    profile: 'galaxy_furniture_profile',
    orders: 'galaxy_furniture_orders',
    trial: 'galaxy_furniture_trial'
  };

  const PRODUCTS = {
    no01: { id: 'no01', name: 'Galaxy Furniture No. 01 Executive', price: 177000, img: 'images/office-chair.jpg', spec: 'Natural White Oak · Tuscan Cognac Leather', category: 'task', materials: 'oak leather', mechanics: 'lumbar armrest recline', rating: '4.9 (42)' },
    klint: { id: 'klint', name: 'Klint Recline & Ottoman', price: 217500, img: 'images/brown-lounge.jpg', spec: 'Smoked Oak · Saddle Hide · Ottoman included', category: 'lounge', materials: 'oak leather', mechanics: 'recline lumbar', rating: '5.0 (28)' },
    nora: { id: 'nora', name: 'Nora Sculptural Dining', price: 73500, img: 'images/dining-chairs.jpg', spec: 'Steam-Bent Oak · Oat Linen Seat', category: 'dining', materials: 'oak linen', mechanics: 'waterfall', rating: '4.8 (64)' },
    arv: { id: 'arv', name: 'Arv Task Swivel Chair', price: 129000, img: 'images/office-desk.jpg', spec: '3D Wool Knit · Cast Aluminum Base', category: 'task', materials: 'aluminum wool', mechanics: 'lumbar recline', rating: '4.9 (51)' },
    freja: { id: 'freja', name: 'Freja Low Slung Chair', price: 147000, img: 'images/armchair-window.jpg', spec: 'Belgian Linen · Brushed Brass Joints', category: 'lounge', materials: 'walnut linen', mechanics: 'lumbar', rating: '4.7 (19)' },
    malm: { id: 'malm', name: 'Malm Architectural Stool', price: 51000, img: 'images/wooden-stool.jpg', spec: 'Solid White Oak · Sculpted Saddle Seat', category: 'stools', materials: 'oak wood', mechanics: 'waterfall', rating: '4.9 (33)' },
    ottoman: { id: 'ottoman', name: 'Klint Ergonomic Ottoman', price: 99000, img: 'images/brown-lounge.jpg', spec: 'Natural White Oak · Tuscan Cognac Leather', category: 'lounge', materials: 'oak leather', mechanics: 'recline', rating: '4.8 (21)' },
    footrest: { id: 'footrest', name: 'Solid Oak Angled Footrest', price: 42000, img: 'images/cozy-lounge.jpg', spec: 'Solid Oak · Leather Tread', category: 'accessories', materials: 'oak leather', mechanics: 'waterfall', rating: '4.7 (16)' },
    blotter: { id: 'blotter', name: 'Merino Wool Desk Blotter', price: 11250, img: 'images/office-desk.jpg', spec: 'Heather Grey Merino Felt · 5mm', category: 'accessories', materials: 'wool', mechanics: '', rating: '4.6 (12)' },
    headrest: { id: 'headrest', name: 'Cervical Headrest Add-on', price: 27000, img: 'images/leather-armchair.jpg', spec: 'Detachable Leather · Aluminum Bracket', category: 'accessories', materials: 'leather aluminum', mechanics: 'lumbar', rating: '4.8 (9)' }
  };

  const DEFAULT_CART = [
    { id: 'no01', qty: 1, config: 'Natural White Oak · Tuscan Cognac Leather · Brushed Satin Aluminum · Soft Hardwood Casters' },
    { id: 'ottoman', qty: 1, config: 'Natural White Oak · Tuscan Cognac Leather · Dynamic Angle Rest · Solid Glides' }
  ];
  const DEFAULT_WISHLIST = ['klint', 'arv', 'freja'];

  function load(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return parsed == null ? fallback : parsed;
    } catch (e) {
      return fallback;
    }
  }

  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  function getCart() {
    const stored = load(LS.cart, null);
    if (!stored) {
      save(LS.cart, DEFAULT_CART);
      return DEFAULT_CART.slice();
    }
    return stored;
  }

  function getWishlist() {
    const stored = load(LS.wishlist, null);
    if (!stored) {
      save(LS.wishlist, DEFAULT_WISHLIST);
      return DEFAULT_WISHLIST.slice();
    }
    return stored;
  }

  function getOrders() {
    const stored = load(LS.orders, []);
    if (!stored || !stored.length) {
      return [
        {
          id: 'LIB-ET-202611',
          date: '2026-11-03',
          total: 276000,
          status: 'Out for delivery',
          items: [{ id: 'no01', qty: 1 }, { id: 'ottoman', qty: 1 }],
          city: 'Addis Ababa'
        },
        {
          id: 'LIB-ET-202510',
          date: '2026-10-18',
          total: 51000,
          status: 'Delivered · trial day 22 of 100',
          items: [{ id: 'malm', qty: 1 }],
          city: 'Addis Ababa'
        }
      ];
    }
    return stored;
  }

  function formatETB(amount) {
    return 'ETB ' + Number(amount || 0).toLocaleString('en-US');
  }

  function productFor(item) {
    if (item.customPrice) {
      return { ...PRODUCTS.no01, price: item.customPrice, name: 'Galaxy Furniture No. 01 Executive (Custom)', spec: item.config || PRODUCTS.no01.spec };
    }
    return PRODUCTS[item.id] || null;
  }

  function cartTotals(items = getCart()) {
    return items.reduce((acc, item) => {
      const p = productFor(item);
      if (!p) return acc;
      acc.count += item.qty;
      acc.total += p.price * item.qty;
      return acc;
    }, { count: 0, total: 0 });
  }

  function toast(message) {
    const existing = $('.galaxy-furniture-toast');
    if (existing) existing.remove();
    const el = document.createElement('div');
    el.className = 'galaxy-furniture-toast fixed bottom-6 left-1/2 z-[999] -translate-x-1/2 rounded-full bg-on-surface px-5 py-3 text-surface shadow-lg font-label-md text-label-md';
    el.textContent = message;
    document.body.appendChild(el);
    window.setTimeout(() => el.remove(), 2600);
  }

  function renderHeader() {
    const totals = cartTotals();
    $$('[data-cart-total]').forEach(el => { el.textContent = formatETB(totals.total); });
    $$('[data-cart-count]').forEach(el => {
      const count = totals.count;
      el.textContent = count + (count === 1 ? ' item' : ' items');
    });
    $$('[data-wishlist-count]').forEach(el => { el.textContent = String(getWishlist().length); });
  }

  function addToCart(id, qty = 1, config = '', customPrice = 0) {
    const items = getCart();
    const key = customPrice ? 'no01-custom' : id;
    const found = items.find(item => (item.key || item.id) === key);
    if (found) {
      found.qty += qty;
      if (config) found.config = config;
      if (customPrice) found.customPrice = customPrice;
    } else {
      const item = { id, qty, config: config || (PRODUCTS[id] ? PRODUCTS[id].spec : '') };
      if (customPrice) { item.key = key; item.customPrice = customPrice; }
      items.push(item);
    }
    save(LS.cart, items);
    renderHeader();
    renderCartPage();
    toast('Added to cart');
  }

  function addAccessory(name, price) {
    const map = { Footrest: 'footrest', 'Desk Pad': 'blotter', Headrest: 'headrest' };
    const id = map[name] || 'footrest';
    addToCart(id, 1, '', price || PRODUCTS[id].price);
  }

  function setQty(id, qty) {
    const items = getCart().map(item => {
      const key = item.key || item.id;
      if (key === id || item.id === id) item.qty = Math.max(0, qty);
      return item;
    }).filter(item => item.qty > 0);
    save(LS.cart, items);
    renderHeader();
    renderCartPage();
  }

  function removeFromCart(id) {
    const items = getCart().filter(item => (item.key || item.id) !== id && item.id !== id);
    save(LS.cart, items);
    renderHeader();
    renderCartPage();
    toast('Removed from cart');
  }

  function toggleWishlist(id) {
    let wish = getWishlist();
    if (wish.includes(id)) {
      wish = wish.filter(x => x !== id);
      toast('Removed from wishlist');
    } else {
      wish.push(id);
      toast('Saved to wishlist');
    }
    save(LS.wishlist, wish);
    renderHeader();
    renderWishlistPage();
    syncWishlistButtons();
  }

  function idFromCard(card) {
    const title = (card.querySelector('h3') || {}).textContent || '';
    const t = title.toLowerCase();
    if (t.includes('no. 01')) return 'no01';
    if (t.includes('klint')) return 'klint';
    if (t.includes('nora')) return 'nora';
    if (t.includes('arv')) return 'arv';
    if (t.includes('freja')) return 'freja';
    if (t.includes('malm')) return 'malm';
    return '';
  }

  function syncWishlistButtons() {
    const wish = getWishlist();
    $$('.product-card [aria-label="Add to Curated Collection"], [data-wishlist-id]').forEach(btn => {
      const id = btn.dataset ? btn.dataset.wishlistId : '';
      const cardId = btn.closest('.product-card') ? idFromCard(btn.closest('.product-card')) : '';
      const productId = id || cardId;
      if (!productId) return;
      btn.dataset.wishlistId = productId;
      const active = wish.includes(productId);
      btn.classList.toggle('text-primary', active);
      btn.classList.toggle('bg-primary', active);
      btn.classList.toggle('text-on-primary', active);
      const icon = btn.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = active ? 'favorite' : 'favorite';
    });
  }

  function initButtons() {
    const mobileToggle = $('[data-mobile-toggle]');
    const mobileNav = $('#mobileNav');
    if (mobileToggle && mobileNav) {
      mobileToggle.addEventListener('click', () => {
        mobileNav.classList.toggle('hidden');
        const icon = mobileToggle.querySelector('.material-symbols-outlined');
        if (icon) icon.textContent = mobileNav.classList.contains('hidden') ? 'menu' : 'close';
      });
    }

    $$('[data-book-trial]').forEach(btn => {
      btn.addEventListener('click', () => { window.location.href = 'checkout.html'; });
    });

    $$('.product-card [aria-label="Add to Curated Collection"], [data-wishlist-id]').forEach(btn => {
      btn.addEventListener('click', (event) => {
        event.preventDefault();
        const id = btn.dataset.wishlistId || (btn.closest('.product-card') ? idFromCard(btn.closest('.product-card')) : '');
        if (id) toggleWishlist(id);
      });
    });

    $$('[data-add-to-cart]').forEach(btn => {
      btn.addEventListener('click', (event) => {
        event.preventDefault();
        addToCart(btn.dataset.addToCart);
      });
    });

    $$('.product-card button[title], article button[title]').forEach(btn => {
      btn.addEventListener('click', (event) => {
        event.preventDefault();
        const card = btn.closest('.product-card') || btn.closest('article');
        if (!card) return;
        $$('button[title]', card).forEach(b => {
          b.classList.remove('ring-2', 'ring-primary', 'ring-offset-2', 'ring-offset-surface-container-low');
        });
        btn.classList.add('ring-2', 'ring-primary', 'ring-offset-2', 'ring-offset-surface-container-low');
        toast('Colorway selected: ' + btn.title);
      });
    });

    $$('form[data-newsletter-form]').forEach(form => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = form.querySelector('input[type="email"]');
        if (!email || !email.value.includes('@')) {
          toast('Enter a valid email to join the salon list');
          return;
        }
        toast('Welcome to the Galaxy Furniture salon list');
        form.reset();
      });
    });
  }

  function initSearch() {
    $$('form[data-search-form]').forEach(form => {
      form.addEventListener('submit', (event) => {
        const input = form.querySelector('input[name="q"]');
        if (!input || !input.value.trim()) {
          event.preventDefault();
          toast('Type a chair, material, or style to search');
        }
      });
    });
  }

  function initCatalog() {
    const grid = $('#productCatalogGrid');
    if (!grid) return;
    const cards = $$('.product-card', grid);
    const params = new URLSearchParams(window.location.search);
    const state = {
      category: 'all',
      search: (params.get('q') || '').toLowerCase(),
      price: 277500,
      materials: new Set(['oak']),
      mechanics: new Set(['lumbar', 'armrest'])
    };

    cards.forEach(card => {
      const id = idFromCard(card);
      const p = PRODUCTS[id] || {};
      card.dataset.productId = id;
      card.dataset.category = p.category || '';
      card.dataset.materials = p.materials || '';
      card.dataset.mechanics = p.mechanics || '';
      card.dataset.price = String(p.price || 0);
      card.dataset.search = ((p.name || '') + ' ' + (p.spec || '') + ' ' + (p.category || '') + ' ' + (p.materials || '')).toLowerCase();
    });

    const resultCount = $('[data-results-count]');
    const activeChips = $$('[data-active-criteria] .chip');

    function applyFilters() {
      let visible = 0;
      cards.forEach(card => {
        const searchOk = !state.search || card.dataset.search.includes(state.search);
        const categoryOk = state.category === 'all' || card.dataset.category === state.category;
        const priceOk = Number(card.dataset.price || 0) <= state.price;
        const materialOk = !state.materials.size || card.dataset.materials.split(' ').some(m => state.materials.has(m));
        const mechanicOk = !state.mechanics.size || card.dataset.mechanics.split(' ').some(m => state.mechanics.has(m));
        const show = searchOk && categoryOk && priceOk && materialOk && mechanicOk;
        card.classList.toggle('hidden', !show);
        if (show) visible += 1;
      });
      if (resultCount) resultCount.textContent = String(visible);
      activeChips.forEach(chip => {
        const type = chip.dataset.criteriaType;
        const value = chip.dataset.criteriaValue;
        let active = true;
        if (type === 'material') active = state.materials.has(value);
        if (type === 'mechanics') active = state.mechanics.has(value);
        if (type === 'price') active = state.price < 330000;
        chip.classList.toggle('hidden', !active);
      });
    }

    $$('.category-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        state.category = btn.dataset.category || 'all';
        $$('.category-pill').forEach(b => {
          const active = b === btn;
          b.classList.toggle('bg-on-surface', active);
          b.classList.toggle('text-surface', active);
          b.classList.toggle('bg-surface-container', !active);
          b.classList.toggle('text-on-surface', !active);
        });
        applyFilters();
      });
    });

    $$('#filterRail input[type="checkbox"][data-filter-group="material"]').forEach(box => {
      box.addEventListener('change', () => {
        if (box.checked) state.materials.add(box.dataset.filterValue);
        else state.materials.delete(box.dataset.filterValue);
        applyFilters();
      });
    });
    $$('#filterRail input[type="checkbox"][data-filter-group="mechanics"]').forEach(box => {
      box.addEventListener('change', () => {
        if (box.checked) state.mechanics.add(box.dataset.filterValue);
        else state.mechanics.delete(box.dataset.filterValue);
        applyFilters();
      });
    });

    const priceRange = $('#priceRange');
    const priceDisplay = $('#priceDisplayValue');
    if (priceRange && priceDisplay) {
      const syncPrice = () => {
        state.price = Number(priceRange.value);
        priceDisplay.textContent = 'ETB 52,500 – ETB ' + state.price.toLocaleString('en-US');
        applyFilters();
      };
      priceRange.addEventListener('input', syncPrice);
    }

    const sortSelect = $('#sortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        const sorted = cards.slice().sort((a, b) => {
          if (sortSelect.value === 'price-asc') return Number(a.dataset.price) - Number(b.dataset.price);
          if (sortSelect.value === 'price-desc') return Number(b.dataset.price) - Number(a.dataset.price);
          if (sortSelect.value === 'ergo') return (b.dataset.search.includes('lumbar') ? 1 : 0) - (a.dataset.search.includes('lumbar') ? 1 : 0);
          return 0;
        });
        sorted.forEach(card => grid.appendChild(card));
        toast('Catalog sorted');
      });
    }

    const reset = $('#resetFilters');
    if (reset) {
      reset.addEventListener('click', () => {
        state.category = 'all';
        state.search = '';
        state.price = 277500;
        state.materials.clear();
        state.mechanics.clear();
        $$('#filterRail input[type="checkbox"]').forEach(box => { box.checked = false; });
        if (priceRange) priceRange.value = '277500';
        if (priceDisplay) priceDisplay.textContent = 'ETB 52,500 – ETB 277,500';
        applyFilters();
        toast('Filters reset');
      });
    }

    applyFilters();
  }

  function itemRow(item, mode) {
    const p = productFor(item);
    if (!p) return '';
    const key = item.key || item.id;
    const qty = item.qty || 1;
    if (mode === 'wishlist') {
      return `
        <article class="bg-surface-container p-5 rounded-2xl shadow-sm flex flex-col gap-4">
          <img src="${p.img}" alt="${p.name}" class="w-full aspect-[4/3] object-cover rounded-xl" loading="lazy">
          <div>
            <h3 class="font-title-md text-title-md text-on-surface">${p.name}</h3>
            <p class="font-body-sm text-body-sm text-on-surface-variant mt-1">${p.spec}</p>
            <p class="font-spec-numeral text-spec-numeral text-primary font-semibold mt-2">${formatETB(p.price)}</p>
          </div>
          <div class="flex gap-2">
            <button class="flex-1 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md" data-add-to-cart="${p.id}" type="button">Add to cart</button>
            <button class="px-4 py-2.5 rounded-full bg-surface-container-high font-label-md text-label-md" data-remove-wishlist="${p.id}" type="button">Remove</button>
          </div>
        </article>`;
    }
    return `
      <article class="bg-surface p-5 rounded-2xl shadow-sm flex flex-col md:flex-row gap-5">
        <img src="${p.img}" alt="${p.name}" class="w-full md:w-40 aspect-[4/3] object-cover rounded-xl" loading="lazy">
        <div class="flex-1 flex flex-col gap-2">
          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 class="font-title-md text-title-md text-on-surface">${p.name}</h3>
              <p class="font-body-sm text-body-sm text-on-surface-variant">${item.config || p.spec}</p>
            </div>
            <p class="font-spec-numeral text-spec-numeral text-on-surface font-semibold whitespace-nowrap">${formatETB(p.price * qty)}</p>
          </div>
          <div class="flex items-center justify-between pt-1">
            <div class="inline-flex items-center rounded-full bg-surface-container-low p-1">
              <button class="w-8 h-8 rounded-full bg-surface shadow-sm" data-qty="${key}" data-delta="-1" type="button" aria-label="Decrease quantity">−</button>
              <span class="w-10 text-center font-label-md text-label-md">${qty}</span>
              <button class="w-8 h-8 rounded-full bg-surface shadow-sm" data-qty="${key}" data-delta="1" type="button" aria-label="Increase quantity">+</button>
            </div>
            <button class="font-label-md text-label-md text-primary" data-remove-cart="${key}" type="button">Remove</button>
          </div>
        </div>
      </article>`;
  }

  function renderCartPage() {
    const box = $('#cartItems');
    if (!box) return;
    const items = getCart();
    box.innerHTML = items.length ? items.map(item => itemRow(item, 'cart')).join('') : `
      <div class="bg-surface p-8 rounded-2xl shadow-sm text-center">
        <p class="font-headline-md text-headline-md text-on-surface">Your cart is empty</p>
        <p class="font-body-md text-body-md text-on-surface-variant mt-2">Configure a chair or add a piece from the catalog.</p>
        <a href="catalog.html" class="inline-flex mt-5 px-6 py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md">Browse catalog</a>
      </div>`;
    const totals = cartTotals(items);
    $$('[data-cart-subtotal]').forEach(el => { el.textContent = formatETB(totals.total); });
    $$('[data-cart-grand]').forEach(el => { el.textContent = formatETB(totals.total); });
    box.addEventListener('click', (event) => {
      const qtyBtn = event.target.closest('[data-qty]');
      const removeBtn = event.target.closest('[data-remove-cart]');
      if (qtyBtn) {
        const id = qtyBtn.dataset.qty;
        const item = getCart().find(x => (x.key || x.id) === id || x.id === id);
        if (item) setQty(id, item.qty + Number(qtyBtn.dataset.delta));
      }
      if (removeBtn) removeFromCart(removeBtn.dataset.removeCart);
    }, { once: true });
    $$('[data-add-to-cart]', box).forEach(btn => btn.addEventListener('click', (event) => {
      event.preventDefault();
      addToCart(btn.dataset.addToCart);
    }));
  }

  function renderWishlistPage() {
    const box = $('#wishlistItems');
    if (!box) return;
    const wish = getWishlist();
    box.innerHTML = wish.length ? wish.map(id => itemRow({ id, qty: 1 }, 'wishlist')).join('') : `
      <div class="bg-surface p-8 rounded-2xl shadow-sm text-center">
        <p class="font-headline-md text-headline-md text-on-surface">No saved pieces yet</p>
        <p class="font-body-md text-body-md text-on-surface-variant mt-2">Tap the heart on any chair to save it here.</p>
        <a href="catalog.html" class="inline-flex mt-5 px-6 py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md">Browse catalog</a>
      </div>`;
    $$('[data-add-to-cart]', box).forEach(btn => btn.addEventListener('click', (event) => {
      event.preventDefault();
      addToCart(btn.dataset.addToCart);
    }));
    $$('[data-remove-wishlist]', box).forEach(btn => btn.addEventListener('click', () => toggleWishlist(btn.dataset.removeWishlist)));

    const addAll = $('#wishlistAddAll');
    if (addAll) {
      if (!wish.length) {
        addAll.classList.add('hidden');
      } else {
        addAll.classList.remove('hidden');
        addAll.onclick = () => {
          wish.forEach(id => addToCart(id));
          save(LS.wishlist, []);
          renderHeader();
          renderWishlistPage();
          syncWishlistButtons();
        };
      }
    }
  }

  function initProfile() {
    const form = $('#profileForm');
    if (!form) return;

    const DEFAULTS = {
      fullName: 'Abraham Tesfaye',
      email: 'abraham@galaxyfurniture.et',
      phone: '+251 911 234 567',
      address: 'Bole Road, Friendship Building',
      city: 'Addis Ababa'
    };

    function profileData() {
      return Object.assign({}, DEFAULTS, load(LS.profile, null) || {});
    }

    function renderOrders() {
      const ordersBox = $('#profileOrders');
      if (!ordersBox) return;
      ordersBox.innerHTML = getOrders().map(order => `
        <div class="bg-surface p-5 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p class="font-label-md text-label-md text-on-surface font-semibold">${order.id}</p>
            <p class="font-body-sm text-body-sm text-on-surface-variant">${order.date} · ${order.city || 'Addis Ababa'} · ${(order.items || []).length} item(s)</p>
          </div>
          <div class="flex items-center gap-4">
            <span class="font-label-sm text-label-sm text-secondary">${order.status || 'Processing'}</span>
            <span class="font-spec-numeral text-spec-numeral text-on-surface font-semibold">${formatETB(order.total)}</span>
            <a href="checkout.html" class="px-4 py-2 rounded-full bg-surface-container font-label-md text-label-md">View</a>
          </div>
        </div>`).join('');
    }

    function renderSummary() {
      const profile = profileData();
      Object.entries(profile).forEach(([key, value]) => {
        const field = form.elements.namedItem(key);
        if (field) field.value = value;
      });
      $$('[data-profile-name]').forEach(el => { el.textContent = profile.fullName || 'Galaxy Client'; });
      $$('[data-profile-email]').forEach(el => { el.textContent = profile.email || DEFAULTS.email; });
      $$('[data-profile-phone]').forEach(el => { el.textContent = profile.phone || DEFAULTS.phone; });
      $$('[data-profile-city]').forEach(el => { el.textContent = profile.city || DEFAULTS.city; });
      $$('[data-profile-orders]').forEach(el => { el.textContent = String(getOrders().length); });
      $$('[data-profile-wishlist]').forEach(el => { el.textContent = String(getWishlist().length); });
      $$('[data-profile-cart]').forEach(el => { el.textContent = formatETB(cartTotals().total); });
      renderOrders();
    }

    Object.entries(profileData()).forEach(([key, value]) => {
      const field = form.elements.namedItem(key);
      if (field) field.value = value;
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      save(LS.profile, data);
      renderSummary();
      toast('Profile saved');
    });

    $$('[data-profile-tab]').forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.profileTab;
        $$('.profile-tab').forEach(t => {
          const active = t.dataset.profileTab === target;
          t.classList.toggle('bg-primary', active);
          t.classList.toggle('text-on-primary', active);
          t.classList.toggle('text-on-surface-variant', !active);
        });
        $$('.profile-panel').forEach(panel => panel.classList.toggle('hidden', panel.id !== 'panel-' + target));
      });
    });

    $$('[data-clear-store]').forEach(btn => {
      btn.addEventListener('click', () => {
        const scope = btn.dataset.clearStore;
        if (scope === 'cart' || scope === 'all') save(LS.cart, []);
        if (scope === 'wishlist' || scope === 'all') save(LS.wishlist, []);
        if (scope === 'profile' || scope === 'all') save(LS.profile, {});
        renderHeader();
        renderCartPage();
        renderWishlistPage();
        syncWishlistButtons();
        renderSummary();
        toast('Saved data cleared');
      });
    });

    renderSummary();
  }

  function validateCheckout() {
    const required = ['given-name', 'surname', 'email', 'phone', 'street', 'city', 'postal', 'country'];
    const missing = required.map(id => document.getElementById(id)).filter(el => el && !el.value.trim());
    if (missing.length) {
      missing.forEach(el => el.classList.add('ring-2', 'ring-primary'));
      toast('Please complete client & delivery details');
      missing[0].focus();
      return false;
    }
    return true;
  }

  function placeOrder() {
    if (!validateCheckout()) return;
    const totals = cartTotals();
    if (!totals.count) {
      toast('Your cart is empty');
      return;
    }
    const activePay = $('.pay-tab.bg-surface');
    const fieldValue = (id, fallback) => {
      const el = document.getElementById(id);
      return el ? el.value.trim() : (fallback ? (document.getElementById(fallback) || {}).value || '' : '');
    };
    const order = {
      id: 'LIB-ET-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toISOString().slice(0, 10),
      total: totals.total,
      status: 'Confirmed · workshop scheduling',
      items: getCart(),
      firstName: fieldValue('given-name', 'firstName'),
      lastName: fieldValue('surname', 'lastName'),
      email: fieldValue('email'),
      phone: fieldValue('phone'),
      address: fieldValue('street', 'address'),
      city: fieldValue('city'),
      postal: fieldValue('postal'),
      country: fieldValue('country'),
      payment: activePay ? activePay.textContent.trim() : 'Card'
    };
    const orders = load(LS.orders, []) || [];
    orders.unshift(order);
    save(LS.orders, orders);
    save(LS.cart, []);
    renderHeader();
    window.location.href = 'order-confirmation.html?order=' + order.id;
  }

  function initCheckout() {
    const btn = $('#placeOrderBtn');
    if (btn) btn.addEventListener('click', placeOrder);
    const live = $('#liveChatBtn');
    if (live) {
      live.addEventListener('click', () => {
        window.open('https://wa.me/251911234567?text=Hello%20Galaxy Furniture%20Atelier%2C%20I%20need%20ergonomic%20fitting%20help', '_blank');
      });
    }
  }

  function initConfirmation() {
    const params = new URLSearchParams(window.location.search);
    const wanted = params.get('order');
    const orders = getOrders();
    const order = orders.find(o => o.id === wanted) || orders[0];
    if (!order) return;
    $$('[data-order-id]').forEach(el => { el.textContent = order.id; });
    $$('[data-order-total]').forEach(el => { el.textContent = formatETB(order.total); });
    $$('[data-order-status]').forEach(el => { el.textContent = order.status || 'Confirmed'; });
    $$('[data-order-name]').forEach(el => { el.textContent = [order.firstName, order.lastName].filter(Boolean).join(' ') || 'Atelier Client'; });
    const box = $('#confirmationItems');
    if (box) {
      box.innerHTML = (order.items || []).map(item => itemRow(item, 'cart')).join('') || '<p class="font-body-md text-body-md text-on-surface-variant">Order items will appear here once saved.</p>';
    }
  }

  function initTrial() {
    const form = $('#trialForm');
    if (!form) return;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      if (!data.fullName || !data.phone || !data.date || !data.location) {
        toast('Please complete the trial booking form');
        return;
      }
      save(LS.trial, { ...data, bookedAt: new Date().toISOString() });
      toast('Trial booked — confirmation sent by SMS & email');
      form.reset();
      const out = $('#trialSuccess');
      if (out) out.classList.remove('hidden');
    });
  }

  function initPolicyTabs() {
    $$('[data-policy-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('[data-policy-tab]').forEach(b => {
          const active = b === btn;
          b.classList.toggle('bg-primary', active);
          b.classList.toggle('text-on-primary', active);
          b.classList.toggle('text-on-surface-variant', !active);
        });
        $$('.policy-panel').forEach(panel => panel.classList.toggle('hidden', panel.id !== 'policy-' + btn.dataset.policyTab));
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    initSearch();
    initCatalog();
    initButtons();
    syncWishlistButtons();
    renderCartPage();
    renderWishlistPage();
    initProfile();
    initCheckout();
    initConfirmation();
    initTrial();
    initPolicyTabs();
  });

  window.GalaxyFurnitureApp = { formatETB, addToCart, addAccessory, toggleWishlist, getCart, getWishlist, placeOrder, toast, PRODUCTS };
})();
