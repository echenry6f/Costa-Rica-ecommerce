// Ticora Store — Admin: add/edit/delete products (Supabase or localStorage)

document.addEventListener('DOMContentLoaded', async () => {
  setupForm();
  setupNavToggle();
  await loadProducts(true);
  renderProducts();
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

function renderProducts() {
  const products = getProducts();
  const listEl = document.getElementById('products-list');
  const emptyEl = document.getElementById('products-empty');

  if (products.length === 0) {
    listEl.innerHTML = '';
    emptyEl?.classList.remove('hidden');
    return;
  }

  emptyEl?.classList.add('hidden');
  listEl.innerHTML = products
    .map(
      (p) => `
    <div class="admin-product-card" data-id="${p.id}">
      <div class="admin-product-icon">${p.emoji || '📦'}</div>
      <div class="admin-product-info">
        <strong>${escapeHtml(p.name)}</strong>
        <span class="admin-product-meta">${escapeHtml(p.category)} · ${formatCrc(p.price)}</span>
      </div>
      <div class="admin-product-actions">
        <button type="button" class="btn btn-secondary btn-small" data-edit="${p.id}">Edit</button>
        <button type="button" class="btn btn-danger btn-small" data-delete="${p.id}">Delete</button>
      </div>
    </div>
  `
    )
    .join('');

  listEl.querySelectorAll('[data-edit]').forEach((btn) => {
    btn.addEventListener('click', () => editProduct(btn.dataset.edit));
  });
  listEl.querySelectorAll('[data-delete]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (confirm('Delete this product?')) {
        try {
          await deleteProduct(btn.dataset.delete);
          renderProducts();
        } catch (err) {
          alert('Failed to delete: ' + (err.message || err));
        }
      }
    });
  });
}

function setupForm() {
  const form = document.getElementById('product-form');
  const cancelBtn = document.getElementById('cancel-edit');
  const formTitle = document.getElementById('form-title');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('product-id').value;
    const product = {
      name: document.getElementById('name').value.trim(),
      category: document.getElementById('category').value.trim(),
      price: parseInt(document.getElementById('price').value, 10) || 0,
      emoji: document.getElementById('emoji').value.trim() || '📦',
      description: document.getElementById('description').value.trim(),
    };

    try {
      if (id) {
        await updateProduct(id, product);
      } else {
        await addProduct(product);
      }
      form.reset();
      document.getElementById('product-id').value = '';
      formTitle.textContent = 'Add Product';
      cancelBtn?.classList.add('hidden');
      renderProducts();
    } catch (err) {
      alert('Failed to save: ' + (err.message || err));
    }
  });

  cancelBtn?.addEventListener('click', () => {
    form.reset();
    document.getElementById('product-id').value = '';
    formTitle.textContent = 'Add Product';
    cancelBtn.classList.add('hidden');
  });
}

function editProduct(id) {
  const product = getProductById(id);
  if (!product) return;

  document.getElementById('product-id').value = product.id;
  document.getElementById('name').value = product.name || '';
  document.getElementById('category').value = product.category || '';
  document.getElementById('price').value = product.price || '';
  document.getElementById('emoji').value = product.emoji || '';
  document.getElementById('description').value = product.description || '';

  document.getElementById('form-title').textContent = 'Edit Product';
  document.getElementById('cancel-edit')?.classList.remove('hidden');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
