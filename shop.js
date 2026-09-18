/* ===== 露蕾希 商城前端邏輯（購物車存在瀏覽器 localStorage）===== */
const LURESH_API = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
  ? 'http://localhost:8787'
  : 'https://luresh-api.king1234t.workers.dev';

// ※ 價格與內容量為示意值，待確認後更新
const PRODUCT = {
  id: 'hfbd',
  name: '露蕾希高纖莓果飲',
  en: 'High Fiber Berry Drink',
  image: 'images/hero-product.jpg',
  variants: [
    { id: 'box1', name: '單盒', desc: '30 條 · 15 天份', price: 1280, was: null,  tag: null },
    { id: 'box2', name: '兩盒組', desc: '60 條 · 30 天份', price: 2400, was: 2560, tag: '熱銷' },
    { id: 'box3', name: '三盒組', desc: '90 條 · 45 天份', price: 3480, was: 3840, tag: '最划算' },
  ],
};
const SHIPPING = {
  cvs:  { name: '超商取貨（7-11 / 全家）', fee: 60,  free: 2000 },
  home: { name: '宅配到府（黑貓）',        fee: 100, free: 2000 },
};

const money = n => 'NT$ ' + Number(n).toLocaleString('zh-Hant-TW');

/* ---- cart storage ---- */
function getCart(){ try { return JSON.parse(localStorage.getItem('luresh_cart') || '[]'); } catch(e){ return []; } }
function saveCart(c){ localStorage.setItem('luresh_cart', JSON.stringify(c)); updateBag(); }
function addToCart(variantId, qty){
  const cart = getCart();
  const row = cart.find(r => r.variantId === variantId);
  if (row) row.qty += qty; else cart.push({ variantId, qty });
  saveCart(cart);
}
function setQty(variantId, qty){
  let cart = getCart();
  if (qty <= 0) cart = cart.filter(r => r.variantId !== variantId);
  else { const row = cart.find(r => r.variantId === variantId); if (row) row.qty = qty; }
  saveCart(cart);
}
function cartLines(){
  return getCart().map(r => {
    const v = PRODUCT.variants.find(v => v.id === r.variantId);
    return v ? { ...r, v, amount: v.price * r.qty } : null;
  }).filter(Boolean);
}
function cartSubtotal(){ return cartLines().reduce((s, l) => s + l.amount, 0); }
function shippingFee(method){
  const s = SHIPPING[method] || SHIPPING.cvs;
  return cartSubtotal() >= s.free ? 0 : s.fee;
}
function updateBag(){
  const n = getCart().reduce((s, r) => s + r.qty, 0);
  document.querySelectorAll('.bag .cnt').forEach(el => { el.textContent = n; el.classList.toggle('on', n > 0); });
}
document.addEventListener('DOMContentLoaded', updateBag);

/* ---- shared header helpers ---- */
function toggleMenu(btn){ const m = document.getElementById('mobileMenu'); const o = m.classList.toggle('open'); btn.setAttribute('aria-expanded', o); }
