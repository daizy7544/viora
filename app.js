const C = window.VIORA_CONFIG || {};
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

let products = [];
let ads = [];
let cart = JSON.parse(localStorage.getItem("vf_bag") || "[]");
let category = "All";
let selectedProduct = null;
let selectedQty = 1;

const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
}[c]));

const money = v => new Intl.NumberFormat("en-IN", {
  style:"currency",
  currency:C.currency || "INR",
  maximumFractionDigits:0
}).format(Number(v) || 0);

function loadLocal(){
  try { products = JSON.parse(localStorage.getItem("vf_products") || "[]"); } catch { products=[]; }
  try { ads = JSON.parse(localStorage.getItem("vf_ads") || "[]"); } catch { ads=[]; }
  products = products.filter(p => p.is_active !== false);
  ads = ads.filter(a => a.active !== false && a.is_active !== false);
}

function priceOf(p){ return Number(p.discounted_price ?? p.price) || 0; }
function oldPriceOf(p){ return Number(p.original_price ?? p.old_price) || 0; }
function discountOf(p){
  const old = oldPriceOf(p), now = priceOf(p);
  return old > now ? Math.round((1-now/old)*100) : 0;
}

function productCard(p){
  const off = discountOf(p);
  const price = priceOf(p);
  const old = oldPriceOf(p);
  return `
    <article class="product-card" data-product="${esc(p.id)}" tabindex="0" role="button" aria-label="View ${esc(p.name)}">
      <div class="product-image">
        ${p.image_url
          ? `<img src="${esc(p.image_url)}" alt="${esc(p.name)}" loading="lazy">`
          : `<div class="image-placeholder"><span>V</span></div>`}
        ${off ? `<span class="sale-badge">${off}% OFF</span>` : ""}
      </div>
      <div class="product-info">
        <div class="category">${esc(p.category || "FIND")}</div>
        <h3>${esc(p.name || "Untitled product")}</h3>
        <div class="price">
          <strong>${money(price)}</strong>
          ${old > price ? `<del>${money(old)}</del>` : ""}
        </div>
      </div>
    </article>`;
}

function render(){
  loadLocal();

  const q = ($("#searchInput")?.value || "").trim().toLowerCase();
  const cats = ["All", ...new Set(products.map(p=>p.category).filter(Boolean))];

  const shown = products.filter(p =>
    (category === "All" || p.category === category) &&
    (!q || `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(q))
  );

  const cat = $("#categoryList");
  if(cat) cat.innerHTML = cats.map(c =>
    `<button type="button" class="${c===category?"active":""}" data-cat="${esc(c)}">${esc(c)}</button>`
  ).join("");

  const grid = $("#productGrid");
  if(grid) grid.innerHTML = shown.map(productCard).join("");

  const dealGrid = $("#dealGrid");
  if(dealGrid){
    const deals = products.filter(p=>p.is_deal).slice(0,6);
    dealGrid.innerHTML = deals.map(productCard).join("");
    $("#deals").hidden = deals.length === 0;
  }

  const empty = $("#emptyState");
  if(empty) empty.hidden = shown.length !== 0;

  const advertising = $("#advertising");
  if(advertising){
    advertising.innerHTML = ads.map(a => `
      <div class="ad-banner">
        ${a.image_url ? `<img src="${esc(a.image_url)}" alt="" loading="lazy">` : ""}
        <div class="ad-copy">
          <p class="eyebrow">VIORA FINDS</p>
          <h2>${esc(a.title || "")}</h2>
          <p>${esc(a.text || "")}</p>
          <a class="primary-button" href="#shop">${esc(a.button_text || "Shop now")} <span>↗</span></a>
        </div>
      </div>`).join("");
    advertising.hidden = ads.length === 0;
  }

  $$(".product-card").forEach(card=>{
    card.addEventListener("click", ()=>openProduct(card.dataset.product));
    card.addEventListener("keydown", e=>{
      if(e.key==="Enter" || e.key===" ") {
        e.preventDefault();
        openProduct(card.dataset.product);
      }
    });
  });

  $$("[data-cat]").forEach(b=>{
    b.addEventListener("click", ()=>{
      category = b.dataset.cat;
      render();
      document.querySelector("#shop")?.scrollIntoView({behavior:"smooth"});
    });
  });
}

function updateCart(){
  try { cart = JSON.parse(localStorage.getItem("vf_bag") || "[]"); } catch { cart=[]; }

  const count = cart.reduce((s,p)=>s+(Number(p.qty)||1),0);
  if($("#cartCount")) $("#cartCount").textContent = count;
  if($("#vfBagCount")) $("#vfBagCount").textContent = count;

  const box=$("#cartItems");
  if(!box) return;

  box.innerHTML = cart.length ? cart.map((p,i)=>`
    <div class="cart-row">
      ${p.image_url ? `<img src="${esc(p.image_url)}" alt="">` : `<div class="mini-placeholder">V</div>`}
      <div class="cart-row-copy">
        <h4>${esc(p.name)}</h4>
        <p>${money(priceOf(p))} × ${p.qty||1}</p>
      </div>
      <button class="remove" type="button" data-remove="${i}" aria-label="Remove ${esc(p.name)}">×</button>
    </div>`).join("") : `
      <div class="empty-state">
        <h3>Your bag is empty.</h3>
        <p>Add a few finds and send your order straight to WhatsApp.</p>
      </div>`;

  $$("[data-remove]", box).forEach(b=>b.addEventListener("click",()=>{
    cart.splice(Number(b.dataset.remove),1);
    localStorage.setItem("vf_bag",JSON.stringify(cart));
    updateCart();
  }));
}

function addToBag(p, qty=1){
  const id=String(p.id);
  const existing=cart.find(x=>String(x.id)===id);
  if(existing) existing.qty=(Number(existing.qty)||1)+qty;
  else cart.push({...p,qty});
  localStorage.setItem("vf_bag",JSON.stringify(cart));
  updateCart();
}

function openCart(){
  $("#cartDrawer")?.classList.add("open");
  $("#cartDrawer")?.setAttribute("aria-hidden","false");
  document.body.classList.add("vf-lock");
}

function closeCart(){
  $("#cartDrawer")?.classList.remove("open");
  $("#cartDrawer")?.setAttribute("aria-hidden","true");
  if(!$(".vf-modal.is-open")) document.body.classList.remove("vf-lock");
}

function openProduct(id){
  selectedProduct = products.find(p=>String(p.id)===String(id));
  if(!selectedProduct) return;
  selectedQty=1;

  const p=selectedProduct, off=discountOf(p), price=priceOf(p), old=oldPriceOf(p);

  $("#modalProduct").innerHTML=`
    <div class="vf-detail-grid">
      <div class="vf-detail-media">
        ${p.image_url ? `<img src="${esc(p.image_url)}" alt="${esc(p.name)}">` : `<div class="vf-detail-placeholder">V</div>`}
        ${off ? `<span class="vf-big-badge">${off}% OFF</span>` : ""}
      </div>
      <div class="vf-detail-copy">
        <div class="vf-kicker">${esc(p.category || "VIORA FIND")}</div>
        <h2>${esc(p.name)}</h2>
        <p>${esc(p.description || "A curated Viora Find.")}</p>
        <div class="vf-detail-price">
          <strong>${money(price)}</strong>
          ${old>price ? `<del>${money(old)}</del><span>Save ${off}%</span>` : ""}
        </div>
        ${p.is_deal ? `<div class="vf-deal-line">Today's deal · limited-time pricing</div>` : ""}
        <div class="vf-quantity">
          <span>Quantity</span>
          <div>
            <button type="button" id="qtyMinus" aria-label="Decrease quantity">−</button>
            <strong id="qtyValue">1</strong>
            <button type="button" id="qtyPlus" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div class="vf-detail-actions">
          <button type="button" class="primary-button full" id="detailAdd">Add to Bag <span>+</span></button>
          <button type="button" class="vf-whatsapp-button" id="detailOrder">Order Now on WhatsApp <span>↗</span></button>
        </div>
        <div class="vf-microcopy">Choose a quantity, add it to your bag, or order this item directly.</div>
      </div>
    </div>`;

  $("#qtyMinus").onclick=()=>{selectedQty=Math.max(1,selectedQty-1);$("#qtyValue").textContent=selectedQty};
  $("#qtyPlus").onclick=()=>{selectedQty=Math.min(99,selectedQty+1);$("#qtyValue").textContent=selectedQty};
  $("#detailAdd").onclick=()=>{
    addToBag(selectedProduct,selectedQty);
    closeProduct();
    openCart();
  };
  $("#detailOrder").onclick=()=>{
    startCheckout([{...selectedProduct,qty:selectedQty}]);
  };

  $("#productModal")?.classList.add("is-open");
  $("#productModal")?.setAttribute("aria-hidden","false");
  document.body.classList.add("vf-lock");
}

function closeProduct(){
  $("#productModal")?.classList.remove("is-open");
  $("#productModal")?.setAttribute("aria-hidden","true");
  if(!$("#cartDrawer")?.classList.contains("open")) document.body.classList.remove("vf-lock");
}

function startCheckout(items=cart){
  if(!items.length){ alert("Add a product first."); return; }
  $("#vfCheckoutSummary").innerHTML=`
    <div><strong>${items.reduce((s,p)=>s+(Number(p.qty)||1),0)} item(s)</strong><strong>${money(items.reduce((s,p)=>s+priceOf(p)*(Number(p.qty)||1),0))}</strong></div>
    <small>${items.map(p=>`${esc(p.name)} × ${Number(p.qty)||1}`).join(" · ")}</small>`;
  $("#checkoutModal")?.classList.add("is-open");
  $("#checkoutModal")?.setAttribute("aria-hidden","false");
  document.body.classList.add("vf-lock");
}

function closeCheckout(){
  $("#checkoutModal")?.classList.remove("is-open");
  $("#checkoutModal")?.setAttribute("aria-hidden","true");
  if(!$("#productModal")?.classList.contains("is-open") && !$("#cartDrawer")?.classList.contains("open"))
    document.body.classList.remove("vf-lock");
}

function checkoutItems(){
  return cart;
}

function whatsappNumber(){
  return String(C.whatsappNumber || "").replace(/\D/g,"");
}

$("#searchInput")?.addEventListener("input",render);
$("#cartButton")?.addEventListener("click",openCart);
$("#vfMobileBag")?.addEventListener("click",openCart);
$("#closeCart")?.addEventListener("click",closeCart);
$("#drawerBackdrop")?.addEventListener("click",closeCart);

$("#whatsappButton")?.addEventListener("click",()=>startCheckout(checkoutItems()));

$$("[data-close-product]").forEach(el=>el.addEventListener("click",closeProduct));
$$("[data-close-checkout]").forEach(el=>el.addEventListener("click",closeCheckout));

$("#vfCheckout")?.addEventListener("submit",e=>{
  e.preventDefault();

  const num=whatsappNumber();
  if(!num){
    alert("Please set your WhatsApp number in config.js first.");
    return;
  }

  const name=$("#vfName").value.trim();
  const phone=$("#vfPhone").value.trim();
  const house=$("#vfHouse").value.trim();
  const area=$("#vfArea").value.trim();
  const city=$("#vfCity").value.trim();
  const state=$("#vfState").value.trim();
  const pin=$("#vfPin").value.trim();
  const note=$("#vfNote").value.trim();

  const items=checkoutItems();
  if(!items.length && selectedProduct){
    items=[{...selectedProduct,qty:selectedQty}];
  }

  const total=items.reduce((s,p)=>s+priceOf(p)*(Number(p.qty)||1),0);

  const text=[
    "Hello Viora Finds! I'd like to place an order.",
    "",
    "PRODUCTS:",
    ...items.map((p,i)=>`${i+1}. ${p.name} × ${Number(p.qty)||1} — ${money(priceOf(p)*(Number(p.qty)||1))}`),
    "",
    `Estimated total: ${money(total)}`,
    "",
    "DELIVERY DETAILS:",
    `Name: ${name}`,
    `Mobile: ${phone}`,
    `Address: ${house}, ${area}, ${city}, ${state} - ${pin}`,
    note ? `Note: ${note}` : ""
  ].filter(Boolean).join("\n");

  window.open(`https://wa.me/${num}?text=${encodeURIComponent(text)}`,"_blank","noopener");
});

document.addEventListener("keydown",e=>{
  if(e.key!=="Escape") return;
  if($("#checkoutModal")?.classList.contains("is-open")) closeCheckout();
  else if($("#productModal")?.classList.contains("is-open")) closeProduct();
  else if($("#cartDrawer")?.classList.contains("open")) closeCart();
});

/* Active mobile navigation */
const mobileLinks=$$(".vf-mobile-nav a");
const sections=mobileLinks.map(a=>document.querySelector(a.getAttribute("href"))).filter(Boolean);
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting) return;
    mobileLinks.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+entry.target.id));
  });
},{rootMargin:"-35% 0px -55% 0px",threshold:0});
sections.forEach(s=>observer.observe(s));

/* Scroll progress */
function progress(){
  const doc=document.documentElement;
  const max=doc.scrollHeight-doc.clientHeight;
  const pct=max>0 ? (doc.scrollTop/max)*100 : 0;
  const bar=$(".vf-progress i");
  if(bar) bar.style.width=pct+"%";
}
window.addEventListener("scroll",progress,{passive:true});
progress();

/* Small parallax, disabled on touch devices */
if(matchMedia("(pointer:fine)").matches){
  document.addEventListener("pointermove",e=>{
    const glow=$(".vf-cursor-glow");
    if(glow){
      glow.style.left=e.clientX+"px";
      glow.style.top=e.clientY+"px";
    }
  });
  window.addEventListener("scroll",()=>{
    const hero=document.querySelector(".hero-orbit");
    if(hero) hero.style.setProperty("--vf-shift",Math.min(40,scrollY*.04)+"px");
  },{passive:true});
}

loadLocal();
render();
updateCart();
