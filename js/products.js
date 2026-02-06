// Ticora Store — Product catalog (Supabase or localStorage fallback)
// Prices in CRC (Costa Rica colones)

const PRODUCTS_KEY = 'ticora_products';
let _productsCache = [];

function getProducts() {
  return _productsCache;
}

function getProductById(id) {
  return _productsCache.find((p) => p.id === id);
}

async function loadProducts(includeInactive = false) {
  const sb = getSupabase();
  if (sb) {
    try {
      let query = sb.from('products').select('*').order('created_at', { ascending: false });
      if (!includeInactive) query = query.eq('active', true);
      const { data, error } = await query;
      if (error) throw error;
      _productsCache = (data || []).map((r) => ({
        id: r.id,
        name: r.name,
        category: r.category,
        price: r.price,
        emoji: r.emoji || '📦',
        description: r.description,
      }));
      return _productsCache;
    } catch (err) {
      console.warn('Supabase products fetch failed, using localStorage:', err);
      _productsCache = loadFromLocalStorage();
      return _productsCache;
    }
  }
  _productsCache = loadFromLocalStorage();
  return _productsCache;
}

function loadFromLocalStorage() {
  try {
    const data = localStorage.getItem(PRODUCTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveToLocalStorage(products) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

async function addProduct(product) {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb.from('products').insert({
        name: product.name,
        category: product.category,
        price: product.price,
        emoji: product.emoji || '📦',
        description: product.description || '',
      }).select('id').single();
      if (error) throw error;
      await loadProducts();
      return data.id;
    } catch (err) {
      console.error('Supabase add product failed:', err);
      throw err;
    }
  }
  const id = String(Date.now());
  const products = loadFromLocalStorage();
  products.push({ ...product, id });
  saveToLocalStorage(products);
  _productsCache = products;
  return id;
}

async function updateProduct(id, product) {
  const sb = getSupabase();
  if (sb) {
    try {
      const { error } = await sb.from('products').update({
        name: product.name,
        category: product.category,
        price: product.price,
        emoji: product.emoji || '📦',
        description: product.description || '',
        updated_at: new Date().toISOString(),
      }).eq('id', id);
      if (error) throw error;
      await loadProducts();
      return true;
    } catch (err) {
      console.error('Supabase update product failed:', err);
      throw err;
    }
  }
  const products = loadFromLocalStorage();
  const i = products.findIndex((p) => p.id === id);
  if (i >= 0) {
    products[i] = { ...products[i], ...product, id };
    saveToLocalStorage(products);
    _productsCache = products;
    return true;
  }
  return false;
}

async function deleteProduct(id) {
  const sb = getSupabase();
  if (sb) {
    try {
      const { error } = await sb.from('products').delete().eq('id', id);
      if (error) throw error;
      await loadProducts();
      return true;
    } catch (err) {
      console.error('Supabase delete product failed:', err);
      throw err;
    }
  }
  const products = loadFromLocalStorage().filter((p) => p.id !== id);
  saveToLocalStorage(products);
  _productsCache = products;
  return true;
}

function formatCrc(amount) {
  return '₡' + Number(amount).toLocaleString('es-CR');
}
