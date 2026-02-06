// Ticora Store — Cart page

document.addEventListener('DOMContentLoaded', async () => {
  await loadProducts();
  updateCartBadge();
  renderCart();
});

function renderCart() {
  const cart = getCart();
  const emptyEl = document.getElementById('cart-empty');
  const contentEl = document.getElementById('cart-content');
  const itemsEl = document.getElementById('cart-items');
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');

  if (cart.length === 0) {
    emptyEl?.classList.remove('hidden');
    contentEl?.classList.add('hidden');
    return;
  }

  emptyEl?.classList.add('hidden');
  contentEl?.classList.remove('hidden');
  updateCartBadge();

  let subtotal = 0;
  itemsEl.innerHTML = cart
    .map((item) => {
      const product = getProductById(item.productId);
      if (!product) return '';
      const lineTotal = product.price * item.quantity;
      subtotal += lineTotal;
      return `
        <div class="cart-item" data-product-id="${product.id}">
          <div class="cart-item-image">${product.emoji || '📦'}</div>
          <div class="cart-item-details">
            <p class="cart-item-name">${escapeHtml(product.name)}</p>
            <p class="cart-item-price">${formatCrc(product.price)} each</p>
            <div class="cart-item-quantity">
              <button type="button" data-action="minus">−</button>
              <span>${item.quantity}</span>
              <button type="button" data-action="plus">+</button>
            </div>
          </div>
          <div>
            <p class="cart-item-total">${formatCrc(lineTotal)}</p>
            <button type="button" class="cart-item-remove" data-action="remove">Remove</button>
          </div>
        </div>
      `;
    })
    .join('');

  subtotalEl.textContent = formatCrc(subtotal);
  totalEl.textContent = formatCrc(subtotal);

  // Event listeners
  itemsEl.querySelectorAll('.cart-item').forEach((el) => {
    const productId = el.dataset.productId;
    el.querySelector('[data-action="minus"]')?.addEventListener('click', () => {
      const item = cart.find((i) => i.productId === productId);
      if (item) updateQuantity(productId, item.quantity - 1);
      renderCart();
    });
    el.querySelector('[data-action="plus"]')?.addEventListener('click', () => {
      const item = cart.find((i) => i.productId === productId);
      if (item) updateQuantity(productId, item.quantity + 1);
      renderCart();
    });
    el.querySelector('[data-action="remove"]')?.addEventListener('click', () => {
      removeFromCart(productId);
      renderCart();
    });
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
