// Ticora Store — Checkout (Correos CR + Waze pin + payment unlock + Supabase orders)

document.addEventListener('DOMContentLoaded', async () => {
  await loadProducts();
  updateCartBadge();
  renderCheckout();
  setupDeliveryForm();
  setupPaymentButtons();
  setupNavToggle();
});

function setupNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const header = document.querySelector('.header');
  if (toggle && header) {
    toggle.addEventListener('click', () => {
      header.classList.toggle('open');
      const open = header.classList.contains('open');
      toggle.setAttribute('aria-expanded', open);
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
  }
}

function isValidWazePin(url) {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim().toLowerCase();
  return trimmed.includes('waze.com') || trimmed.includes('waze.app');
}

function renderCheckout() {
  const cart = getCart();
  const emptyEl = document.getElementById('checkout-empty');
  const contentEl = document.getElementById('checkout-content');
  const successEl = document.getElementById('checkout-success');

  if (cart.length === 0) {
    emptyEl?.classList.remove('hidden');
    contentEl?.classList.add('hidden');
    successEl?.classList.add('hidden');
    return;
  }

  emptyEl?.classList.add('hidden');
  contentEl?.classList.remove('hidden');
  successEl?.classList.add('hidden');

  let subtotal = 0;
  const itemsEl = document.getElementById('checkout-items');
  const subtotalEl = document.getElementById('checkout-subtotal');
  const totalEl = document.getElementById('checkout-total');

  itemsEl.innerHTML = cart
    .map((item) => {
      const product = getProductById(item.productId);
      if (!product) return '';
      const lineTotal = product.price * item.quantity;
      subtotal += lineTotal;
      return `
        <div class="checkout-item">
          <span>${escapeHtml(product.name)} × ${item.quantity}</span>
          <span>${formatCrc(lineTotal)}</span>
        </div>
      `;
    })
    .join('');

  subtotalEl.textContent = formatCrc(subtotal);
  totalEl.textContent = formatCrc(subtotal);
}

let _currentOrderId = null;

function setupDeliveryForm() {
  const form = document.getElementById('delivery-form');
  const wazeInput = document.getElementById('wazePinUrl');
  const paymentSection = document.getElementById('payment-section');

  if (!form || !paymentSection) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const wazeUrl = wazeInput?.value?.trim();
    if (!isValidWazePin(wazeUrl)) {
      alert('Please enter a valid Waze pin URL (must contain waze.com or waze.app).');
      wazeInput?.focus();
      return;
    }

    const sb = getSupabase();
    const cart = getCart();
    if (sb && cart.length > 0) {
      try {
        let total = 0;
        const items = [];
        for (const item of cart) {
          const product = getProductById(item.productId);
          if (product) {
            total += product.price * item.quantity;
            items.push({ product_id: product.id, quantity: item.quantity, price_crc: product.price });
          }
        }

        const { data: order, error: orderErr } = await sb.from('orders').insert({
          buyer_email: document.getElementById('email').value.trim(),
          status: 'pending_payment',
          total_price_crc: total,
        }).select('id').single();

        if (orderErr) throw orderErr;

        await sb.from('order_delivery').insert({
          order_id: order.id,
          full_name: document.getElementById('fullName').value.trim(),
          cedula: document.getElementById('cedula').value.trim(),
          phone: document.getElementById('phone').value.trim(),
          province: document.getElementById('province').value,
          canton: document.getElementById('canton').value.trim(),
          exact_address: document.getElementById('exactAddress').value.trim(),
          waze_pin_url: wazeUrl,
        });

        for (const item of items) {
          await sb.from('order_items').insert({
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price_crc: item.price_crc,
          });
        }

        _currentOrderId = order.id;
      } catch (err) {
        console.error('Order creation failed:', err);
        alert('Failed to save order. Please try again.');
        return;
      }
    } else if (!sb) {
      // No Supabase — simulate order, payment still works locally
    }

    paymentSection.classList.remove('hidden');
    paymentSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

function setupPaymentButtons() {
  const stripeBtn = document.getElementById('pay-stripe');
  const paypalBtn = document.getElementById('pay-paypal');

  async function completePayment(method) {
    const sb = getSupabase();
    if (sb && _currentOrderId) {
      try {
        await sb.from('orders').update({
          status: 'paid',
          payment_provider: method.toLowerCase(),
          updated_at: new Date().toISOString(),
        }).eq('id', _currentOrderId);
      } catch (err) {
        console.error('Order update failed:', err);
      }
    }
    clearCart();
    _currentOrderId = null;
    document.getElementById('checkout-content').classList.add('hidden');
    document.getElementById('checkout-success').classList.remove('hidden');
  }

  stripeBtn?.addEventListener('click', () => {
    completePayment('stripe');
  });

  paypalBtn?.addEventListener('click', () => {
    completePayment('paypal');
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
