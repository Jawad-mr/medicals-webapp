/* =========================================================
   GANESH MEDICALS — APOLLO PHARMACY INTERACTIVE SCRIPT
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     1. GLOBAL STATE & TOAST NOTIFICATION SYSTEM
  --------------------------------------------------------- */
  const cartState = [];
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, type = 'success') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const iconSvg = type === 'success' 
      ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>` 
      : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    toast.innerHTML = `<span>${iconSvg}</span> ${message}`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }


  /* ---------------------------------------------------------
     2. SCROLL PROGRESS BAR & HEADER SHADOW
  --------------------------------------------------------- */
  const progress = document.getElementById('progress');

  function handleScroll() {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const scrolledPct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    
    if (progress) progress.style.width = scrolledPct + '%';
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll();


  /* ---------------------------------------------------------
     3. MOBILE MENU TOGGLE & LINK AUTO-CLOSE
  --------------------------------------------------------- */
  const burger = document.getElementById('burger');
  const mainNavBar = document.querySelector('.main-nav-bar');
  const navItems = document.querySelectorAll('.nav-item');

  if (burger && mainNavBar) {
    burger.addEventListener('click', () => {
      mainNavBar.classList.toggle('open');
    });

    navItems.forEach(link => {
      link.addEventListener('click', () => {
        mainNavBar.classList.remove('open');
      });
    });
  }


  /* ---------------------------------------------------------
     4. GENERIC MODAL MANAGER
  --------------------------------------------------------- */
  function setupModal(triggerIds, overlayId, closeBtnId) {
    const overlay = document.getElementById(overlayId);
    const closeBtn = document.getElementById(closeBtnId);

    triggerIds.forEach(id => {
      const btn = typeof id === 'string' ? document.getElementById(id) : id;
      if (btn && overlay) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          overlay.classList.add('active');
        });
      }
    });

    if (closeBtn && overlay) {
      closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('active');
      });
    }

    return overlay;
  }

  // Modals Setup
  const rxModalOverlay = setupModal(['openRxModalBtnTop', 'openRxModalCard', 'openRxModalBtnBanner', 'openRxModalBtnFooter'], 'rxModalOverlay', 'closeRxModalBtn');
  const doctorModalOverlay = setupModal(['doctorConsultCard', 'navDoctorBtn'], 'doctorModalOverlay', 'closeDoctorModalBtn');
  const labTestModalOverlay = setupModal(['labTestsCard', 'navLabBtn'], 'labTestModalOverlay', 'closeLabTestModalBtn');
  const insuranceModalOverlay = setupModal(['insuranceCard', 'navInsuranceBtn'], 'insuranceModalOverlay', 'closeInsuranceModalBtn');
  const offersModalOverlay = setupModal(['bellFloatBtn', 'navOffersBtn'], 'offersModalOverlay', 'closeOffersModalBtn');
  const locationModalOverlay = setupModal(['openLocationModalBtn'], 'locationModalOverlay', 'closeLocationModalBtn');
  const loginModalOverlay = setupModal(['loginBtn'], 'loginModalOverlay', 'closeLoginModalBtn');


  /* ---------------------------------------------------------
     5. PRESCRIPTION UPLOAD & DRAG & DROP
  --------------------------------------------------------- */
  const dropzone = document.getElementById('dropzone');
  const rxFileInput = document.getElementById('rxFileInput');
  const fileSelectedName = document.getElementById('fileSelectedName');
  const rxUploadForm = document.getElementById('rxUploadForm');

  if (dropzone && rxFileInput) {
    dropzone.addEventListener('click', () => rxFileInput.click());

    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.style.background = '#A7F3D0';
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.style.background = '';
      });
    });

    dropzone.addEventListener('drop', (e) => {
      if (e.dataTransfer.files.length > 0) {
        rxFileInput.files = e.dataTransfer.files;
        updateFilePreview(e.dataTransfer.files[0].name);
      }
    });

    rxFileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        updateFilePreview(e.target.files[0].name);
      }
    });
  }

  function updateFilePreview(fileName) {
    if (fileSelectedName) {
      fileSelectedName.textContent = 'Selected: ' + fileName;
      fileSelectedName.style.color = '#0D9488';
      fileSelectedName.style.fontWeight = '700';
    }
  }

  if (rxUploadForm) {
    rxUploadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('custName').value.trim();
      const phone = document.getElementById('custPhone').value.trim();
      const loc = document.getElementById('custLoc').value;
      const fileName = rxFileInput.files.length > 0 ? rxFileInput.files[0].name : 'Prescription Document Attached';

      const msg = `Hello Ganesh Medicals! 🏥%0A*Prescription Order Request*%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Phone:* ${encodeURIComponent(phone)}%0A*Location:* ${encodeURIComponent(loc)}%0A*Prescription File:* ${encodeURIComponent(fileName)}%0A%0APlease verify prescription and send cost quote.`;

      window.open(`https://wa.me/917947433320?text=${msg}`, '_blank');
      if (rxModalOverlay) rxModalOverlay.classList.remove('active');
      showToast('Prescription order submitted via WhatsApp!');
    });
  }


  /* ---------------------------------------------------------
     6. OTHER MODAL FORM SUBMISSIONS
  --------------------------------------------------------- */
  // Doctor Booking Form
  const doctorBookingForm = document.getElementById('doctorBookingForm');
  if (doctorBookingForm) {
    doctorBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const specialty = document.getElementById('docSpecialty').value;
      const name = document.getElementById('docPatientName').value;
      const phone = document.getElementById('docPatientPhone').value;
      const date = document.getElementById('docPreferredDate').value;

      const msg = `Hello Ganesh Medicals! 🩺%0A*Doctor Appointment Request*%0A%0A*Specialty:* ${encodeURIComponent(specialty)}%0A*Patient:* ${encodeURIComponent(name)}%0A*Phone:* ${encodeURIComponent(phone)}%0A*Preferred Date:* ${encodeURIComponent(date)}`;

      window.open(`https://wa.me/917947433320?text=${msg}`, '_blank');
      if (doctorModalOverlay) doctorModalOverlay.classList.remove('active');
      showToast('Doctor appointment inquiry sent!');
    });
  }

  // Lab Test Booking Form
  const labBookingForm = document.getElementById('labBookingForm');
  if (labBookingForm) {
    labBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const pkg = document.getElementById('labPackage').value;
      const name = document.getElementById('labPatientName').value;
      const phone = document.getElementById('labPhone').value;
      const addr = document.getElementById('labAddress').value;

      const msg = `Hello Ganesh Medicals! 🔬%0A*Home Lab Test Booking*%0A%0A*Package:* ${encodeURIComponent(pkg)}%0A*Patient:* ${encodeURIComponent(name)}%0A*Phone:* ${encodeURIComponent(phone)}%0A*Address:* ${encodeURIComponent(addr)}`;

      window.open(`https://wa.me/917947433320?text=${msg}`, '_blank');
      if (labTestModalOverlay) labTestModalOverlay.classList.remove('active');
      showToast('Lab test collection requested!');
    });
  }

  // Insurance Inquiry Form
  const insuranceInquiryForm = document.getElementById('insuranceInquiryForm');
  if (insuranceInquiryForm) {
    insuranceInquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('insName').value;
      const phone = document.getElementById('insPhone').value;

      const msg = `Hello Ganesh Medicals! 🛡️%0A*Health Insurance Inquiry*%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Phone:* ${encodeURIComponent(phone)}`;

      window.open(`https://wa.me/917947433320?text=${msg}`, '_blank');
      if (insuranceModalOverlay) insuranceModalOverlay.classList.remove('active');
      showToast('Insurance inquiry submitted!');
    });
  }

  // Login Form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const phone = document.getElementById('loginPhone').value;
      showToast(`OTP sent to ${phone}. Logging in...`);
      setTimeout(() => {
        if (loginModalOverlay) loginModalOverlay.classList.remove('active');
        showToast('Successfully logged in!', 'success');
      }, 1000);
    });
  }

  // Location Selector
  const currentLocationName = document.getElementById('currentLocationName');
  const locationBtns = document.querySelectorAll('.location-item-btn');
  locationBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      locationBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const loc = btn.getAttribute('data-loc');
      if (currentLocationName) {
        currentLocationName.innerHTML = `${loc} <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>`;
      }
      if (locationModalOverlay) locationModalOverlay.classList.remove('active');
      showToast(`Delivery area changed to ${loc}`);
    });
  });


  /* ---------------------------------------------------------
     7. LIVE SEARCH, REDIRECT & ADVANCED FILTERING SYSTEM
  --------------------------------------------------------- */
  const searchInput = document.getElementById('medicineSearchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');
  const searchSubmitBtn = document.getElementById('searchSubmitBtn');
  const searchResultsDrop = document.getElementById('searchResultsDrop');
  const resultItems = document.querySelectorAll('.search-result-item');
  const prodCards = document.querySelectorAll('.prod-card');
  const noResultsBox = document.getElementById('noResultsBox');
  const activeFilterBar = document.getElementById('activeFilterBar');
  const activeFilterLabel = document.getElementById('activeFilterLabel');
  const resetFilterBtn = document.getElementById('resetFilterBtn');
  const clearSearchStateBtn = document.getElementById('clearSearchStateBtn');

  // Search Page Elements
  const isSearchPage = document.body.classList.contains('search-page-body');
  const searchBannerQuery = document.getElementById('searchBannerQuery');
  const resultsCountEl = document.getElementById('resultsCount');
  const sortSelect = document.getElementById('sortSelect');
  const appliedFiltersRibbon = document.getElementById('appliedFiltersRibbon');
  const mobileFilterToggleBtn = document.getElementById('mobileFilterToggleBtn');
  const filterSidebar = document.getElementById('filterSidebar');
  const clearAllSidebarFiltersBtn = document.getElementById('clearAllSidebarFiltersBtn');

  // Parse URL Parameters
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get('q') || '';
  const initialCat = urlParams.get('cat') || '';

  if (isSearchPage) {
    if (initialQuery && searchInput) searchInput.value = initialQuery;
    if (initialQuery && searchBannerQuery) searchBannerQuery.textContent = `"${initialQuery}"`;
  }

  // Unified Filter Function
  function filterAndSortProducts() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    
    // Sidebar Filter Values
    const selectedCat = document.querySelector('input[name="sidebarCat"]:checked')?.value || 'all';
    const selectedRx = document.querySelector('input[name="sidebarRx"]:checked')?.value || 'all';
    const selectedPrice = document.querySelector('input[name="sidebarPrice"]:checked')?.value || 'all';
    const minDiscount = parseFloat(document.querySelector('input[name="sidebarDiscount"]:checked')?.value || '0');

    let visibleCards = [];

    prodCards.forEach(card => {
      const name = card.querySelector('.prod-name')?.textContent.toLowerCase() || '';
      const brand = card.querySelector('.prod-brand')?.textContent.toLowerCase() || '';
      const cat = card.getAttribute('data-cat') || '';
      const condition = card.getAttribute('data-condition') || '';
      const rx = card.getAttribute('data-rx') || '';
      const price = parseFloat(card.getAttribute('data-price') || '0');
      const discount = parseFloat(card.getAttribute('data-discount') || '0');

      // Query match
      const matchesQuery = !query || 
        query === 'all' || 
        name.includes(query) || 
        brand.includes(query) || 
        cat.toLowerCase().includes(query) || 
        condition.toLowerCase().includes(query);

      // Category match
      const matchesCat = selectedCat === 'all' || cat.toLowerCase().includes(selectedCat.toLowerCase());

      // Rx match
      const matchesRx = selectedRx === 'all' || rx === selectedRx;

      // Price match
      let matchesPrice = true;
      if (selectedPrice === 'under-200') matchesPrice = price < 200;
      else if (selectedPrice === '200-500') matchesPrice = price >= 200 && price <= 500;
      else if (selectedPrice === '500-1000') matchesPrice = price > 500 && price <= 1000;
      else if (selectedPrice === 'above-1000') matchesPrice = price > 1000;

      // Discount match
      const matchesDiscount = discount >= minDiscount;

      if (matchesQuery && matchesCat && matchesRx && matchesPrice && matchesDiscount) {
        card.style.display = 'flex';
        visibleCards.push(card);
      } else {
        card.style.display = 'none';
      }
    });

    // Sorting Logic
    if (sortSelect && visibleCards.length > 0) {
      const sortVal = sortSelect.value;
      const productsGrid = document.getElementById('productsGrid');

      visibleCards.sort((a, b) => {
        const priceA = parseFloat(a.getAttribute('data-price') || '0');
        const priceB = parseFloat(b.getAttribute('data-price') || '0');
        const discA = parseFloat(a.getAttribute('data-discount') || '0');
        const discB = parseFloat(b.getAttribute('data-discount') || '0');
        const titleA = a.querySelector('.prod-name')?.textContent || '';
        const titleB = b.querySelector('.prod-name')?.textContent || '';

        if (sortVal === 'price-asc') return priceA - priceB;
        if (sortVal === 'price-desc') return priceB - priceA;
        if (sortVal === 'discount-desc') return discB - discA;
        if (sortVal === 'title-asc') return titleA.localeCompare(titleB);
        return 0;
      });

      visibleCards.forEach(card => productsGrid.appendChild(card));
    }

    // Results Count & Banner
    if (resultsCountEl) resultsCountEl.textContent = visibleCards.length;
    if (noResultsBox) noResultsBox.style.display = visibleCards.length === 0 ? 'block' : 'none';
    if (searchBannerQuery) searchBannerQuery.textContent = query ? `"${query}"` : (selectedCat !== 'all' ? selectedCat : 'All Products');
  }

  // Live search input & submit handlers
  if (searchInput) {
    searchInput.addEventListener('focus', () => {
      if (searchResultsDrop) searchResultsDrop.classList.add('active');
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-box-wrapper')) {
        if (searchResultsDrop) searchResultsDrop.classList.remove('active');
      }
    });

    searchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      if (searchClearBtn) searchClearBtn.style.display = val.length > 0 ? 'block' : 'none';

      resultItems.forEach(item => {
        const text = item.innerText.toLowerCase();
        item.style.display = text.includes(val.toLowerCase()) ? 'flex' : 'none';
      });

      filterAndSortProducts();
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        triggerSearchRedirect();
      }
    });

    if (searchClearBtn) {
      searchClearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchClearBtn.style.display = 'none';
        filterAndSortProducts();
      });
    }

    resultItems.forEach(item => {
      item.addEventListener('click', () => {
        const query = item.getAttribute('data-query');
        searchInput.value = query;
        if (searchResultsDrop) searchResultsDrop.classList.remove('active');
        triggerSearchRedirect();
      });
    });

    if (searchSubmitBtn) {
      searchSubmitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        triggerSearchRedirect();
      });
    }

    // Glass Hero Search Box Listeners
    const heroSearchInput = document.getElementById('heroSearchInput');
    const heroSearchSubmitBtn = document.getElementById('heroSearchSubmitBtn');

    if (heroSearchInput) {
      heroSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const val = heroSearchInput.value.trim();
          window.location.href = `search.html?q=${encodeURIComponent(val)}`;
        }
      });
    }

    if (heroSearchSubmitBtn) {
      heroSearchSubmitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const val = heroSearchInput ? heroSearchInput.value.trim() : '';
        window.location.href = `search.html?q=${encodeURIComponent(val)}`;
      });
    }
  }

  function triggerSearchRedirect() {
    const val = searchInput ? searchInput.value.trim() : '';
    if (!isSearchPage) {
      window.location.href = `search.html?q=${encodeURIComponent(val)}`;
    } else {
      filterAndSortProducts();
    }
  }

  // Sidebar Filter Change Listeners
  document.querySelectorAll('input[name="sidebarCat"], input[name="sidebarRx"], input[name="sidebarPrice"], input[name="sidebarDiscount"]').forEach(radio => {
    radio.addEventListener('change', filterAndSortProducts);
  });

  if (sortSelect) {
    sortSelect.addEventListener('change', filterAndSortProducts);
  }

  if (clearAllSidebarFiltersBtn) {
    clearAllSidebarFiltersBtn.addEventListener('click', () => {
      document.querySelectorAll('.filter-sidebar input[type="radio"]').forEach(r => {
        r.checked = r.value === 'all' || r.value === '0';
      });
      if (searchInput) searchInput.value = '';
      filterAndSortProducts();
    });
  }

  if (mobileFilterToggleBtn && filterSidebar) {
    mobileFilterToggleBtn.addEventListener('click', () => {
      filterSidebar.classList.toggle('active-mobile');
    });
  }

  // Initial Filter Run on Page Load
  filterAndSortProducts();


  // Product Tabs Filtering
  const tabBtns = document.querySelectorAll('#productTabs .tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      applyProductFilter(filter === 'all' ? '' : filter, btn.textContent);
    });
  });

  // Category Strip Filtering
  const stripBtns = document.querySelectorAll('#stripCategories .strip-item');
  stripBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      stripBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      applyProductFilter(filter === 'all' ? '' : filter, btn.textContent);
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Health Condition Cards Filtering
  const conditionCards = document.querySelectorAll('.condition-card');
  conditionCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = card.getAttribute('data-category');
      conditionCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      applyProductFilter(cat, cat);
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
    });
  });


  /* ---------------------------------------------------------
     8. INTERACTIVE SHOPPING CART DRAWER
  --------------------------------------------------------- */
  const cartBtn = document.getElementById('cartBtn');
  const mobileCartBtn = document.getElementById('mobileCartBtn');
  const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const startShoppingBtn = document.getElementById('startShoppingBtn');
  const cartCountEl = document.getElementById('cartCount');
  const mobileCartCountEl = document.getElementById('mobileCartCount');
  const cartBody = document.getElementById('cartBody');
  const cartEmptyState = document.getElementById('cartEmptyState');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartFooter = document.getElementById('cartFooter');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartGrandTotal = document.getElementById('cartGrandTotal');
  const checkoutWaBtn = document.getElementById('checkoutWaBtn');

  // Open/Close Cart Drawer
  [cartBtn, mobileCartBtn].forEach(btn => {
    if (btn && cartDrawerOverlay) {
      btn.addEventListener('click', () => cartDrawerOverlay.classList.add('active'));
    }
  });

  if (closeCartBtn && cartDrawerOverlay) {
    closeCartBtn.addEventListener('click', () => cartDrawerOverlay.classList.remove('active'));
    cartDrawerOverlay.addEventListener('click', (e) => {
      if (e.target === cartDrawerOverlay) cartDrawerOverlay.classList.remove('active');
    });
  }
  if (startShoppingBtn && cartDrawerOverlay) {
    startShoppingBtn.addEventListener('click', () => {
      cartDrawerOverlay.classList.remove('active');
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Add to Cart Buttons
  const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
  addToCartBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name');
      const price = parseFloat(btn.getAttribute('data-price'));
      const img = btn.getAttribute('data-img');
      const brand = btn.getAttribute('data-brand');

      addToCart(id, name, price, img, brand);

      // Button Feedback
      const originalText = btn.textContent;
      btn.textContent = 'ADDED';
      btn.style.background = '#10B981';
      btn.style.color = '#FFFFFF';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.color = '';
      }, 1500);
    });
  });

  function addToCart(id, name, price, img, brand) {
    const existing = cartState.find(item => item.id === id);
    if (existing) {
      existing.qty++;
    } else {
      cartState.push({ id, name, price, img, brand, qty: 1 });
    }
    renderCart();
    showToast(`Added ${name} to cart`);
  }

  function updateQty(id, delta) {
    const item = cartState.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      removeFromCart(id);
    } else {
      renderCart();
    }
  }

  function removeFromCart(id) {
    const index = cartState.findIndex(i => i.id === id);
    if (index > -1) {
      const removed = cartState.splice(index, 1)[0];
      renderCart();
      showToast(`Removed ${removed.name} from cart`, 'info');
    }
  }

  function renderCart() {
    const totalItems = cartState.reduce((sum, i) => sum + i.qty, 0);
    [cartCountEl, mobileCartCountEl].forEach(el => {
      if (el) {
        el.textContent = totalItems;
        el.style.transform = 'scale(1.3)';
        setTimeout(() => el.style.transform = 'scale(1)', 200);
      }
    });

    if (cartState.length === 0) {
      if (cartEmptyState) cartEmptyState.style.display = 'block';
      if (cartItemsList) cartItemsList.innerHTML = '';
      if (cartFooter) cartFooter.style.display = 'none';
      return;
    }

    if (cartEmptyState) cartEmptyState.style.display = 'none';
    if (cartFooter) cartFooter.style.display = 'block';

    let total = 0;
    if (cartItemsList) {
      cartItemsList.innerHTML = cartState.map(item => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        return `
          <div class="cart-item">
            <img src="${item.img}" alt="${item.name}" class="cart-item-img" onerror="this.src='https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&q=80';">
            <div class="cart-item-info">
              <div class="cart-item-title">${item.name}</div>
              <div class="cart-item-price">₹${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-actions">
              <button class="qty-btn" onclick="window.cartUpdateQty('${item.id}', -1)">-</button>
              <span class="qty-val">${item.qty}</span>
              <button class="qty-btn" onclick="window.cartUpdateQty('${item.id}', 1)">+</button>
              <button class="remove-item-btn" onclick="window.cartRemoveItem('${item.id}')">&times;</button>
            </div>
          </div>
        `;
      }).join('');
    }

    if (cartSubtotal) cartSubtotal.textContent = `₹${total.toFixed(2)}`;
    if (cartGrandTotal) cartGrandTotal.textContent = `₹${total.toFixed(2)}`;
  }

  // Global window functions for onclick handlers in cart HTML string
  window.cartUpdateQty = (id, delta) => updateQty(id, delta);
  window.cartRemoveItem = (id) => removeFromCart(id);

  // WhatsApp Checkout Action
  if (checkoutWaBtn) {
    checkoutWaBtn.addEventListener('click', () => {
      if (cartState.length === 0) return;
      let msg = `Hello Ganesh Medicals! 🛒%0A*New Order Request*%0A%0A*Items:*%0A`;
      let total = 0;
      cartState.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        msg += `${index + 1}. ${encodeURIComponent(item.name)} (x${item.qty}) - ₹${itemTotal.toFixed(2)}%0A`;
      });
      msg += `%0A*Grand Total:* ₹${total.toFixed(2)}%0APlease confirm availability for delivery to Kankanady address.`;

      window.open(`https://wa.me/917947433320?text=${msg}`, '_blank');
      showToast('Order details sent to WhatsApp!');
    });
  }

});
