const products = [
  // {
  //   id: "ghost-fest-tee",
  //   name: "Ghost Fest T‑Shirt",
  //   price: 799,
  //   description: "Soft black tee with spectral cyan sigil that glows under UV.",
  //   image:
  //     "https://images.pexels.com/photos/6311579/pexels-photo-6311579.jpeg?auto=compress&cs=tinysrgb&w=800",
  //   tag: "Best seller",
  // },
  // {
  //   id: "phantom-hoodie",
  //   name: "Phantom Hoodie",
  //   price: 1999,
  //   description: "Heavyweight midnight hoodie, lined for late-night hauntings.",
  //   image:
  //     "https://images.pexels.com/photos/6311575/pexels-photo-6311575.jpeg?auto=compress&cs=tinysrgb&w=800",
  //   tag: "Limited",
  // },
  // {
  //   id: "haunted-mug",
  //   name: "Haunted Mug",
  //   price: 499,
  //   description: "Matte black mug; a ghostly print appears with hot drinks.",
  //   image:
  //     "https://images.pexels.com/photos/4226785/pexels-photo-4226785.jpeg?auto=compress&cs=tinysrgb&w=800",
  //   tag: "Staff pick",
  // },
  // {
  //   id: "glow-wristband",
  //   name: "Glow Wristband",
  //   price: 199,
  //   description: "Neon green and cyan dual band that pulses in the dark.",
  //   image:
  //     "https://images.pexels.com/photos/7671169/pexels-photo-7671169.jpeg?auto=compress&cs=tinysrgb&w=800",
  //   tag: "Night mode",
  // },
  // {
  //   id: "dark-sticker-pack",
  //   name: "Dark Sticker Pack",
  //   price: 249,
  //   description: "Vinyl ghosts, sigils, and haunted doors for your laptop.",
  //   image:
  //     "https://images.pexels.com/photos/6311564/pexels-photo-6311564.jpeg?auto=compress&cs=tinysrgb&w=800",
  //   tag: "New",
  // },
  // {
  //   id: "ghost-mask",
  //   name: "Ghost Mask",
  //   price: 349,
  //   description: "Soft fabric mask with pale phantom grin and cyan lining.",
  //   image:
  //     "https://images.pexels.com/photos/6194215/pexels-photo-6194215.jpeg?auto=compress&cs=tinysrgb&w=800",
  //   tag: "Crowd favorite",
  // },
];

const cartState = {
  items: [],
};

const selectors = {
  productGrid: document.getElementById("productGrid"),
  cartToggle: document.getElementById("cartToggle"),
  cartPanel: document.getElementById("cartPanel"),
  cartClose: document.getElementById("cartClose"),
  cartItems: document.getElementById("cartItems"),
  cartEmpty: document.getElementById("cartEmpty"),
  cartTotal: document.getElementById("cartTotal"),
  cartCount: document.getElementById("cartCount"),
  checkoutBtn: document.getElementById("checkoutBtn"),
  browseBtn: document.getElementById("browseBtn"),
  featuredBtn: document.getElementById("featuredBtn"),
  scrollTopBtn: document.getElementById("scrollTopBtn"),
};

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";
  card.innerHTML = `
    <div class="product-ghost-shadow"></div>
    <div class="product-image-wrapper">
      <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy" />
      <div class="image-overlay-gradient"></div>
    </div>
    <h3 class="product-title">${product.name}</h3>
    <p class="product-price">₹${product.price.toLocaleString("en-IN")}</p>
    <p class="product-description">${product.description}</p>
    <div class="product-footer">
      <span class="product-tag">${product.tag}</span>
      <button class="btn primary add-to-cart-btn" data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>
  `;
  return card;
}


function renderProducts() {
  if (!selectors.productGrid) return;
  const fragment = document.createDocumentFragment();
  products.forEach((product) => {
    fragment.appendChild(createProductCard(product));
  });
  selectors.productGrid.appendChild(fragment);
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existing = cartState.items.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cartState.items.push({ ...product, quantity: 1 });
  }
  animateCartCount();
  renderCart();
}

function removeFromCart(productId) {
  cartState.items = cartState.items.filter((item) => item.id !== productId);
  renderCart();
}

function updateQuantity(productId, delta) {
  const item = cartState.items.find((i) => i.id === productId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    renderCart();
  }
}

function getCartTotals() {
  return cartState.items.reduce(
    (acc, item) => {
      acc.count += item.quantity;
      acc.total += item.quantity * item.price;
      return acc;
    },
    { count: 0, total: 0 }
  );
}

function renderCart() {
  const { items } = cartState;
  const hasItems = items.length > 0;

  selectors.cartItems.innerHTML = "";
  selectors.cartEmpty.style.display = hasItems ? "none" : "block";

  if (!hasItems) {
    selectors.cartTotal.textContent = "₹0";
    selectors.cartCount.textContent = "0";
    return;
  }

  const fragment = document.createDocumentFragment();
  items.forEach((item) => {
    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `
      <div class="cart-item-main">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-meta">Qty: ${item.quantity}</span>
      </div>
      <div class="cart-item-actions">
        <span class="cart-item-price">₹${(
          item.price * item.quantity
        ).toLocaleString("en-IN")}</span>
        <div class="cart-qty-controls">
          <button class="qty-btn" data-qty-delta="-1" data-item-id="${item.id}">−</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn" data-qty-delta="1" data-item-id="${item.id}">+</button>
        </div>
        <button class="remove-item" data-remove-id="${item.id}">Remove</button>
      </div>
    `;
    fragment.appendChild(li);
  });

  selectors.cartItems.appendChild(fragment);

  const totals = getCartTotals();
  selectors.cartTotal.textContent = `₹${totals.total.toLocaleString("en-IN")}`;
  selectors.cartCount.textContent = String(totals.count);
}

function animateCartCount() {
  selectors.cartCount.classList.add("cart-count-pulse");
  setTimeout(() => {
    selectors.cartCount.classList.remove("cart-count-pulse");
  }, 280);
}

// function openCart() {
//   selectors.cartPanel.classList.add("open");
//   selectors.cartPanel.setAttribute("aria-hidden", "false");
// }

// function closeCart() {
//   selectors.cartPanel.classList.remove("open");
//   selectors.cartPanel.setAttribute("aria-hidden", "true");
// }

// function setupCartInteractions() {
//   if (selectors.cartToggle) {
//     selectors.cartToggle.addEventListener("click", () => {
//       const isOpen = selectors.cartPanel.classList.contains("open");
//       if (isOpen) {
//         closeCart();
//       } else {
//         openCart();
//       }
//     });
//   }

//   if (selectors.cartClose) {
//     selectors.cartClose.addEventListener("click", () => closeCart());
//   }

//   if (selectors.cartPanel) {
//     selectors.cartPanel.addEventListener("click", (event) => {
//       const target = event.target;

//       if (target.matches(".qty-btn")) {
//         const id = target.getAttribute("data-item-id");
//         const delta = parseInt(target.getAttribute("data-qty-delta"), 10);
//         updateQuantity(id, delta);
//       }

//       if (target.matches(".remove-item")) {
//         const id = target.getAttribute("data-remove-id");
//         removeFromCart(id);
//       }
//     });
//   }

//   if (selectors.checkoutBtn) {
//     selectors.checkoutBtn.addEventListener("click", () => {
//       const totals = getCartTotals();
//       if (totals.count === 0) {
//         alert("Your haunt is empty. Add an item before checking out.");
//         return;
//       }
//       alert(
//         `Your ritual is prepared.\n\nItems: ${totals.count}\nTotal: ₹${totals.total.toLocaleString(
//           "en-IN"
//         )}\n\n(Checkout flow would continue here.)`
//       );
//     });
//   }
// }

// function setupProductInteractions() {
//   if (!selectors.productGrid) return;
//   selectors.productGrid.addEventListener("click", (event) => {
//     const target = event.target;
//     if (target.matches("[data-product-id]")) {
//       const id = target.getAttribute("data-product-id");
//       addToCart(id);
//     }
//   });

//   const featuredBtn = document.querySelector("[data-add-featured='phantom-hoodie']");
//   if (featuredBtn) {
//     featuredBtn.addEventListener("click", () => addToCart("phantom-hoodie"));
//   }
// }

function smoothScrollTo(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  window.scrollTo({
    top: el.offsetTop - 80,
    behavior: "smooth",
  });
}

function setupScrollAndAtmosphere() {
  if (selectors.browseBtn) {
    selectors.browseBtn.addEventListener("click", () => smoothScrollTo("#merch"));
  }
  if (selectors.featuredBtn) {
    selectors.featuredBtn.addEventListener("click", () => smoothScrollTo("#featured"));
  }

  if (selectors.scrollTopBtn) {
    selectors.scrollTopBtn.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );

    window.addEventListener("scroll", () => {
      const offset = window.scrollY || window.pageYOffset;
      if (offset > 280) {
        selectors.scrollTopBtn.classList.add("visible");
      } else {
        selectors.scrollTopBtn.classList.remove("visible");
      }
    });
  }

  // Subtle parallax for hero visuals
  const heroVisual = document.querySelector(".hero-visual");
  if (heroVisual) {
    window.addEventListener(
      "scroll",
      () => {
        const rect = heroVisual.getBoundingClientRect();
        const scrolledRatio = Math.min(Math.max((window.innerHeight - rect.top) / window.innerHeight, 0), 1);
        heroVisual.style.transform = `translateY(${scrolledRatio * -14}px)`;
      },
      { passive: true }
    );
  }
}

function setYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  setupCartInteractions();
  setupProductInteractions();
  setupScrollAndAtmosphere();
  setYear();
});

