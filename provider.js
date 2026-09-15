const C=window.VIORA_CONFIG||{},$=s=>document.querySelector(s);let session=null,products=[],ads=[],attempts=0,lockUntil=0;
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c])),money=v=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:2}).format(Number(v)||0);
async function hash(t){const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(t));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}
function valid(){const s=JSON.parse(sessionStorage.getItem("vf_provider")||"null");return s&&s.user===C.provider.username&&s.expires>Date.now()}
function refresh(){if(!valid()){$("#auth").hidden=false;$("#panel").hidden=true;session=null;return}session=true;$("#auth").hidden=true;$("#panel").hidden=false;$("#providerEmail").textContent="Signed in as "+C.provider.username;load();draw()}
function load(){products=JSON.parse(localStorage.getItem("vf_products")||"[]");ads=JSON.parse(localStorage.getItem("vf_ads")||"[]")}
function save(){localStorage.setItem("vf_products",JSON.stringify(products));localStorage.setItem("vf_ads",JSON.stringify(ads))}
function draw(){$("#pc").textContent=products.length;$("#dc").textContent=products.filter(p=>p.is_deal).length;$("#ac").textContent=ads.length;$("#plist").innerHTML=products.map((p,i)=>`<div class="admin-row">${p.image_url?`<img src="${esc(p.image_url)}" alt="">`:`<div class="mini-placeholder">V</div>`}<div><strong>${esc(p.name)}</strong><span>${esc(p.category)} · ${money(p.price??p.discounted_price)} ${p.is_deal?"· Today's Deal":""}</span></div><div class="row-actions"><button onclick="editProduct(${i})">Edit</button><button onclick="deleteProduct(${i})">Delete</button></div></div>`).join("")||'<p class="muted">No products yet.</p>';$("#alist").innerHTML=ads.map((a,i)=>`<div class="admin-row">${a.image_url?`<img src="${esc(a.image_url)}" alt="">`:`<div class="mini-placeholder">V</div>`}<div><strong>${esc(a.title)}</strong><span>${a.is_active===false?"Hidden":"Published"}</span></div><div class="row-actions"><button onclick="editAd(${i})">Edit</button><button onclick="deleteAd(${i})">Delete</button></div></div>`).join("")||'<p class="muted">No campaigns yet.</p>'}
function notice(t,ok=false){$("#authMsg").textContent=t;$("#authMsg").className="form-message "+(ok?"ok":"")}
$("#login").onclick=async()=>{if(Date.now()<lockUntil)return notice("Temporarily locked. Try again later.");const u=$("#email").value.trim(),p=$("#password").value;if(!u||!p)return notice("Enter both username and password.");const good=u===C.provider.username&&(await hash(p))===C.provider.passwordHash;if(!good){attempts++;if(attempts>=C.provider.maxAttempts){attempts=0;lockUntil=Date.now()+C.provider.lockMinutes*60000;return notice("Too many attempts. Locked for "+C.provider.lockMinutes+" minutes.")}return notice("Incorrect credentials. "+(C.provider.maxAttempts-attempts)+" attempt(s) remaining.")}attempts=0;sessionStorage.setItem("vf_provider",JSON.stringify({user:u,expires:Date.now()+C.provider.sessionMinutes*60000}));$("#password").value="";notice("Access granted.",true);refresh()}
$("#logout").onclick=()=>{sessionStorage.removeItem("vf_provider");refresh()};
const read=f=>new Promise(r=>{if(!f)return r("");const x=new FileReader();x.onload=()=>r(x.result);x.readAsDataURL(f)});
async function saveProduct(e){e.preventDefault();const image=await read($("#pi").files[0]),id=$("#productId").value,p={id:id||crypto.randomUUID(),name:$("#pn").value,category:$("#pcat").value,description:$("#pd").value,old_price:+$("#po").value||0,price:+$("#pp").value,is_deal:$("#deal").checked,is_active:$("#activeProduct").checked,image_url:image||""};if(id){const i=products.findIndex(x=>String(x.id)===id);p.image_url=image||products[i].image_url||"";products[i]=p}else products.unshift(p);save();clearProduct();refresh()}
async function saveAd(e){e.preventDefault();const image=await read($("#ai").files[0]),id=$("#adId").value,a={id:id||crypto.randomUUID(),title:$("#at").value,text:$("#ax").value,button_text:$("#ab").value,is_active:$("#activeAd").checked,image_url:image||""};if(id){const i=ads.findIndex(x=>String(x.id)===id);a.image_url=image||ads[i].image_url||"";ads[i]=a}else ads.unshift(a);save();clearAd();refresh()}
function editProduct(i){const p=products[i];$("#productId").value=p.id;$("#pn").value=p.name;$("#pcat").value=p.category;$("#po").value=p.old_price||"";$("#pp").value=p.price;$("#pd").value=p.description||"";$("#deal").checked=!!p.is_deal;$("#activeProduct").checked=p.is_active!==false;$("#productFormTitle").textContent="Edit product";scrollTo({top:180,behavior:"smooth"})}
function editAd(i){const a=ads[i];$("#adId").value=a.id;$("#at").value=a.title;$("#ax").value=a.text||"";$("#ab").value=a.button_text||"Shop now";$("#activeAd").checked=a.is_active!==false;$("#adFormTitle").textContent="Edit campaign";scrollTo({top:650,behavior:"smooth"})}
function deleteProduct(i){if(confirm("Delete this product?")){products.splice(i,1);save();refresh()}}function deleteAd(i){if(confirm("Delete this advertisement?")){ads.splice(i,1);save();refresh()}}
function clearProduct(){$("#productForm").reset();$("#productId").value="";$("#productFormTitle").textContent="Add a product";$("#activeProduct").checked=true}
function clearAd(){$("#adForm").reset();$("#adId").value="";$("#adFormTitle").textContent="Create a campaign";$("#activeAd").checked=true}
$("#productForm").onsubmit=saveProduct;$("#adForm").onsubmit=saveAd;$("#cancelProduct").onclick=clearProduct;$("#cancelAd").onclick=clearAd;setInterval(()=>{if(session&&!valid())refresh()},30000);refresh();
window.addEventListener("load",()=>{document.querySelectorAll(".section,.ad-section,.about,.product-card").forEach(el=>el.classList.add("vf-visible"));document.body.classList.remove("vf-lock");});
window.addEventListener("resize",()=>document.querySelectorAll(".section,.ad-section,.about,.product-card").forEach(el=>el.classList.add("vf-visible")));

/* ===== FINAL RUNTIME SAFETY ===== */
(function(){
  function restorePage(){
    document.documentElement.style.overflowY = "auto";
    document.body.style.overflowX = "hidden";
    if (!document.querySelector(".vf-modal.is-open")) {
      document.body.classList.remove("vf-lock");
      document.body.style.overflowY = "auto";
    }
    document.querySelectorAll(".section,.ad-section,.about").forEach(function(el){
      el.style.opacity = "1";
      el.style.visibility = "visible";
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", restorePage);
  } else restorePage();
  window.addEventListener("load", restorePage);
})();
