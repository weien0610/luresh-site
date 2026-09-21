/* ===== 露蕾希 商城前端邏輯（購物車存在瀏覽器 localStorage）===== */
const LURESH_API = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
  ? 'http://localhost:8787'
  : 'https://luresh-api.king1234t.workers.dev';

// 價格依 7-11 賣貨便賣場（2026-09-21）：一盒 1,680 / 兩盒 3,250 / 10 盒 15,500 / 日日水 590
const PRODUCTS = [
  {
    id: 'hfbd', name: '露蕾希高纖莓果飲', en: 'High Fiber Berry Drink', eyebrow: 'High Fiber Berry Drink',
    image: 'images/hero-product.jpg',
    gallery: ['images/hero-product.jpg', 'images/lifestyle-bed.jpg', 'images/ingredients-banner.jpg', 'images/poster-ingredients.jpg'],
    tagline: '擺脫囤積感！每日喝出輕盈順暢力',
    desc: '專為外食族、忙碌上班族設計的輕體代謝飲品。結合多重纖維、強效酵素與阻斷澱粉、燃燒代謝專利萃取。每日 2 包，幫你輕鬆找回順暢快感與青春活力。',
    perks: ['低卡負擔，每份僅 34.4 大卡', '蛋奶素可食・專利專屬配方', '台灣製造，通過多項 SGS 認證', '第一次購買免費附搖搖杯'],
    unit: '入', perDay: 2,
    addon: { productId: 'cup', label: '附搖搖杯（第一次購買請勾選，免費；第二次購買可不勾）' },
    variants: [
      { id: 'box1',  name: '一盒',   desc: '30 入 · 15 天份', price: 1680,  was: null, tag: null },
      { id: 'box2',  name: '兩盒',   desc: '60 入 · 30 天份', price: 3250,  was: 3360, tag: '熱銷' },
      { id: 'box10', name: '十盒',   desc: '300 入 · 5 個月份', price: 15500, was: 16800, tag: '最划算' },
    ],
    sections: [
      ['成分', '綜合蔬果酵素、魔芋纖維、大麥萃取物、非洲芒果種子萃取物、藤黃果萃取物、白腎豆萃取物、洋車前子多酚、柑橘類黃酮與瓜拿納複合物（甜橙、血橙、葡萄柚及瓜拿納萃取物）、決明子萃取物。'],
      ['食用方法', '<ul><li>睡前 30 分鐘，使用兩包高纖莓果飲，加入 240cc 的常溫或冷水，搖勻。</li><li>最佳飲用時間為晚上 9–11 點。嚴禁溫熱水。</li><li>蓋上搖杯搖 3–5 秒搖勻，不可放置超過十秒，直接飲用完畢。喝完請勿進食。</li><li>經期可以正常食用。</li></ul>'],
      ['攜帶出國', '粉狀沖泡飲隨身行李不得超過 350g，一條 12.5g，隨身請控制在 28 包（14 天份）以內；託運則無此限制。'],
    ],
  },
  {
    id: 'tea-jasmine', name: '露蕾希日日水・茉莉綠茶機能飲', en: 'Jasmine Green Tea', eyebrow: 'Luresh Daily Tea · Jasmine Green Tea',
    image: 'images/tea-jasmine.jpg',
    gallery: ['images/tea-jasmine.jpg', 'images/tea-black.jpg'],
    tagline: '一杯花香，更輕盈的自己',
    desc: '露蕾希日日水茉莉綠茶機能飲，日常的輕盈陪伴。（產品說明待補）',
    perks: ['每日一杯，隨時沖泡', '台灣製造', '成分與檢驗資料待補'],
    unit: '包', perDay: 1,
    variants: [
      { id: 'box1', name: '一盒', desc: '1 盒（包數待補）', price: 590, was: null, tag: null },
    ],
    sections: [
      ['成分', '待補。'],
      ['沖泡方法', '待補。'],
    ],
  },
  {
    id: 'tea-black', name: '露蕾希日日水・阿薩姆紅茶', en: 'Assam Black Tea', eyebrow: 'Luresh Daily Tea · Assam Black Tea',
    image: 'images/tea-black.jpg',
    gallery: ['images/tea-black.jpg', 'images/tea-jasmine.jpg'],
    tagline: '一杯茶香，更輕盈的自己',
    desc: '露蕾希日日水阿薩姆紅茶，日常的輕盈陪伴。（產品說明待補）',
    perks: ['每日一杯，隨時沖泡', '台灣製造', '成分與檢驗資料待補'],
    unit: '包', perDay: 1,
    variants: [
      { id: 'box1', name: '一盒', desc: '1 盒（包數待補）', price: 590, was: null, tag: null },
    ],
    sections: [
      ['成分', '待補。'],
      ['沖泡方法', '待補。'],
    ],
  },
  {
    // 免費贈品：搖搖杯（不出現在商品列表，由高纖莓果飲商品頁勾選加入）
    id: 'cup', hidden: true, name: '露蕾希搖搖杯', en: 'Shaker Cup', eyebrow: 'Free gift',
    image: 'images/poster-howto.jpg', gallery: ['images/poster-howto.jpg'],
    tagline: '', desc: '首購免費附贈的搖搖杯，沖泡高纖莓果飲使用。', perks: [], unit: '個', perDay: 0,
    variants: [{ id: 'one', name: '搖搖杯', desc: '首購免費附贈', price: 0, was: null, tag: null }],
    sections: [],
  },
];
const VISIBLE_PRODUCTS = PRODUCTS.filter(p => !p.hidden);
const SHIPPING = {
  cvs:  { name: '超商取貨（7-11 / 全家）', fee: 60,  free: 2000 },
  home: { name: '宅配到府（黑貓）',        fee: 100, free: 2000 },
};
const SHIP_SECTION = ['配送與退換貨', '<ul><li>超商取貨運費 NT$60，宅配 NT$100，單筆滿 NT$2,000 免運。</li><li>付款完成後 1–2 個工作天出貨。</li><li>食品類商品拆封後恕不退換；未拆封可於收到 7 天內申請退貨。</li></ul>'];

const money = n => 'NT$ ' + Number(n).toLocaleString('zh-Hant-TW');
const findProduct = id => PRODUCTS.find(p => p.id === id);

/* ---- cart storage（每列 key = 商品id:規格id）---- */
function getCart(){ try { return JSON.parse(localStorage.getItem('luresh_cart') || '[]'); } catch(e){ return []; } }
function saveCart(c){ localStorage.setItem('luresh_cart', JSON.stringify(c)); updateBag(); }
function addToCart(productId, variantId, qty){
  const cart = getCart();
  const row = cart.find(r => r.productId === productId && r.variantId === variantId);
  if (row) row.qty += qty; else cart.push({ productId, variantId, qty });
  saveCart(cart);
}
function setQty(productId, variantId, qty){
  let cart = getCart();
  if (qty <= 0) cart = cart.filter(r => !(r.productId === productId && r.variantId === variantId));
  else { const row = cart.find(r => r.productId === productId && r.variantId === variantId); if (row) row.qty = qty; }
  saveCart(cart);
}
function cartLines(){
  return getCart().map(r => {
    const p = findProduct(r.productId); const v = p && p.variants.find(v => v.id === r.variantId);
    return (p && v) ? { ...r, p, v, amount: v.price * r.qty } : null;
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
