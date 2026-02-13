// Ticora Store — Homepage app

document.addEventListener('DOMContentLoaded', async () => {
  await loadProducts();
  renderProducts();
  setupNavToggle();
});

function renderProducts() {
  const grid = document.getElementById('product-grid');
  const emptyEl = document.getElementById('products-empty');
  const loadingEl = document.getElementById('products-loading');
  if (!grid) return;

  loadingEl?.classList.add('hidden');
  const products = getProducts();

  if (products.length === 0) {
    grid.classList.add('hidden');
    emptyEl?.classList.remove('hidden');
    return;
  }

  grid.classList.remove('hidden');
  emptyEl?.classList.add('hidden');
  grid.innerHTML = products
    .map(
      (p) => `
    <article class="product-card">
      <div class="product-image">${p.emoji || '📦'}</div>
      <div class="product-info">
        <h3 class="product-name">${escapeHtml(p.name)}</h3>
        <p class="product-category">${escapeHtml(p.category)}</p>
        <p class="product-price">${formatCrc(p.price)}</p>
        <button class="btn btn-primary" data-add-to-cart="${p.id}">Add to Cart</button>
      </div>
    </article>
  `
    )
    .join('');

  grid.querySelectorAll('[data-add-to-cart]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.addToCart;
      addToCart(id);
      btn.textContent = 'Added!';
      setTimeout(() => (btn.textContent = 'Add to Cart'), 1000);
    });
  });
}

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

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
