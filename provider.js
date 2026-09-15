// const C=window.VIORA_CONFIG||{},$=s=>document.querySelector(s);let session=null,products=[],ads=[],attempts=0,lockUntil=0;
// const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c])),money=v=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:2}).format(Number(v)||0);
// async function hash(t){const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(t));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}
// function valid(){const s=JSON.parse(sessionStorage.getItem("vf_provider")||"null");return s&&s.user===C.provider.username&&s.expires>Date.now()}
// function refresh(){if(!valid()){$("#auth").hidden=false;$("#panel").hidden=true;session=null;return}session=true;$("#auth").hidden=true;$("#panel").hidden=false;$("#providerEmail").textContent="Signed in as "+C.provider.username;load();draw()}
// function load(){products=JSON.parse(localStorage.getItem("vf_products")||"[]");ads=JSON.parse(localStorage.getItem("vf_ads")||"[]")}
// function save(){localStorage.setItem("vf_products",JSON.stringify(products));localStorage.setItem("vf_ads",JSON.stringify(ads))}
// function draw(){$("#pc").textContent=products.length;$("#dc").textContent=products.filter(p=>p.is_deal).length;$("#ac").textContent=ads.length;$("#plist").innerHTML=products.map((p,i)=>`<div class="admin-row">${p.image_url?`<img src="${esc(p.image_url)}" alt="">`:`<div class="mini-placeholder">V</div>`}<div><strong>${esc(p.name)}</strong><span>${esc(p.category)} · ${money(p.price??p.discounted_price)} ${p.is_deal?"· Today's Deal":""}</span></div><div class="row-actions"><button onclick="editProduct(${i})">Edit</button><button onclick="deleteProduct(${i})">Delete</button></div></div>`).join("")||'<p class="muted">No products yet.</p>';$("#alist").innerHTML=ads.map((a,i)=>`<div class="admin-row">${a.image_url?`<img src="${esc(a.image_url)}" alt="">`:`<div class="mini-placeholder">V</div>`}<div><strong>${esc(a.title)}</strong><span>${a.is_active===false?"Hidden":"Published"}</span></div><div class="row-actions"><button onclick="editAd(${i})">Edit</button><button onclick="deleteAd(${i})">Delete</button></div></div>`).join("")||'<p class="muted">No campaigns yet.</p>'}
// function notice(t,ok=false){$("#authMsg").textContent=t;$("#authMsg").className="form-message "+(ok?"ok":"")}
// $("#login").onclick=async()=>{if(Date.now()<lockUntil)return notice("Temporarily locked. Try again later.");const u=$("#email").value.trim(),p=$("#password").value;if(!u||!p)return notice("Enter both username and password.");const good=u===C.provider.username&&(await hash(p))===C.provider.passwordHash;if(!good){attempts++;if(attempts>=C.provider.maxAttempts){attempts=0;lockUntil=Date.now()+C.provider.lockMinutes*60000;return notice("Too many attempts. Locked for "+C.provider.lockMinutes+" minutes.")}return notice("Incorrect credentials. "+(C.provider.maxAttempts-attempts)+" attempt(s) remaining.")}attempts=0;sessionStorage.setItem("vf_provider",JSON.stringify({user:u,expires:Date.now()+C.provider.sessionMinutes*60000}));$("#password").value="";notice("Access granted.",true);refresh()}
// $("#logout").onclick=()=>{sessionStorage.removeItem("vf_provider");refresh()};
// const read=f=>new Promise(r=>{if(!f)return r("");const x=new FileReader();x.onload=()=>r(x.result);x.readAsDataURL(f)});
// async function saveProduct(e){e.preventDefault();const image=await read($("#pi").files[0]),id=$("#productId").value,p={id:id||crypto.randomUUID(),name:$("#pn").value,category:$("#pcat").value,description:$("#pd").value,old_price:+$("#po").value||0,price:+$("#pp").value,is_deal:$("#deal").checked,is_active:$("#activeProduct").checked,image_url:image||""};if(id){const i=products.findIndex(x=>String(x.id)===id);p.image_url=image||products[i].image_url||"";products[i]=p}else products.unshift(p);save();clearProduct();refresh()}
// async function saveAd(e){e.preventDefault();const image=await read($("#ai").files[0]),id=$("#adId").value,a={id:id||crypto.randomUUID(),title:$("#at").value,text:$("#ax").value,button_text:$("#ab").value,is_active:$("#activeAd").checked,image_url:image||""};if(id){const i=ads.findIndex(x=>String(x.id)===id);a.image_url=image||ads[i].image_url||"";ads[i]=a}else ads.unshift(a);save();clearAd();refresh()}
// function editProduct(i){const p=products[i];$("#productId").value=p.id;$("#pn").value=p.name;$("#pcat").value=p.category;$("#po").value=p.old_price||"";$("#pp").value=p.price;$("#pd").value=p.description||"";$("#deal").checked=!!p.is_deal;$("#activeProduct").checked=p.is_active!==false;$("#productFormTitle").textContent="Edit product";scrollTo({top:180,behavior:"smooth"})}
// function editAd(i){const a=ads[i];$("#adId").value=a.id;$("#at").value=a.title;$("#ax").value=a.text||"";$("#ab").value=a.button_text||"Shop now";$("#activeAd").checked=a.is_active!==false;$("#adFormTitle").textContent="Edit campaign";scrollTo({top:650,behavior:"smooth"})}
// function deleteProduct(i){if(confirm("Delete this product?")){products.splice(i,1);save();refresh()}}function deleteAd(i){if(confirm("Delete this advertisement?")){ads.splice(i,1);save();refresh()}}
// function clearProduct(){$("#productForm").reset();$("#productId").value="";$("#productFormTitle").textContent="Add a product";$("#activeProduct").checked=true}
// function clearAd(){$("#adForm").reset();$("#adId").value="";$("#adFormTitle").textContent="Create a campaign";$("#activeAd").checked=true}
// $("#productForm").onsubmit=saveProduct;$("#adForm").onsubmit=saveAd;$("#cancelProduct").onclick=clearProduct;$("#cancelAd").onclick=clearAd;setInterval(()=>{if(session&&!valid())refresh()},30000);refresh();
// window.addEventListener("load",()=>{document.querySelectorAll(".section,.ad-section,.about,.product-card").forEach(el=>el.classList.add("vf-visible"));document.body.classList.remove("vf-lock");});
// window.addEventListener("resize",()=>document.querySelectorAll(".section,.ad-section,.about,.product-card").forEach(el=>el.classList.add("vf-visible")));

// /* ===== FINAL RUNTIME SAFETY ===== */
// (function(){
//   function restorePage(){
//     document.documentElement.style.overflowY = "auto";
//     document.body.style.overflowX = "hidden";
//     if (!document.querySelector(".vf-modal.is-open")) {
//       document.body.classList.remove("vf-lock");
//       document.body.style.overflowY = "auto";
//     }
//     document.querySelectorAll(".section,.ad-section,.about").forEach(function(el){
//       el.style.opacity = "1";
//       el.style.visibility = "visible";
//     });
//   }
//   if (document.readyState === "loading") {
//     document.addEventListener("DOMContentLoaded", restorePage);
//   } else restorePage();
//   window.addEventListener("load", restorePage);
// })();
/* =========================================================
   VIORA FINDS — PROVIDER DASHBOARD
   Firebase / Firestore / Storage version
   ========================================================= */

const C = window.VIORA_CONFIG || {};
const $ = (s) => document.querySelector(s);

let session = null;
let products = [];
let ads = [];
let attempts = 0;
let lockUntil = 0;
let editingProductId = "";
let editingAdId = "";


/* =========================================================
   HELPERS
   ========================================================= */

const esc = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[c]));

const money = (v) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(Number(v) || 0);

async function hash(text) {
  const buffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text)
  );

  return [...new Uint8Array(buffer)]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}

function notice(text, ok = false) {
  const el = $("#authMsg");

  if (!el) return;

  el.textContent = text;
  el.className = "form-message " + (ok ? "ok" : "");
}

function dashboardNotice(text) {
  let el = $("#productStatus");

  if (el) {
    el.textContent = text;

    setTimeout(() => {
      if (el.textContent === text) {
        el.textContent = "";
      }
    }, 3500);
  }
}


/* =========================================================
   FIREBASE
   ========================================================= */

async function firebase() {
  const fb = await window.VIORA_FIREBASE_READY;

  if (!fb) {
    throw new Error(
      "Firebase could not connect. Check your Firebase configuration."
    );
  }

  return fb;
}


/* =========================================================
   AUTHENTICATION
   ========================================================= */

function valid() {
  try {
    const s = JSON.parse(
      sessionStorage.getItem("vf_provider") || "null"
    );

    return !!(
      s &&
      s.user === C.provider.username &&
      Number(s.expires) > Date.now()
    );
  } catch {
    return false;
  }
}

async function login() {
  if (Date.now() < lockUntil) {
    notice(
      "Temporarily locked. Try again later."
    );
    return;
  }

  const username = $("#email").value.trim();
  const password = $("#password").value;

  if (!username || !password) {
    notice("Enter both username and password.");
    return;
  }

  try {
    const passwordHash = await hash(password);

    const correct =
      username === C.provider.username &&
      passwordHash === C.provider.passwordHash;

    if (!correct) {
      attempts++;

      if (attempts >= C.provider.maxAttempts) {
        attempts = 0;

        lockUntil =
          Date.now() +
          C.provider.lockMinutes * 60 * 1000;

        notice(
          "Too many attempts. Locked for " +
          C.provider.lockMinutes +
          " minutes."
        );

        return;
      }

      notice(
        "Incorrect credentials. " +
        (C.provider.maxAttempts - attempts) +
        " attempt(s) remaining."
      );

      return;
    }

    attempts = 0;

    sessionStorage.setItem(
      "vf_provider",
      JSON.stringify({
        user: username,
        expires:
          Date.now() +
          C.provider.sessionMinutes * 60 * 1000
      })
    );

    $("#password").value = "";

    notice("Access granted.", true);

    await refresh();

  } catch (error) {
    console.error(error);
    notice("Unable to sign in right now.");
  }
}

function logout() {
  sessionStorage.removeItem("vf_provider");

  session = null;
  products = [];
  ads = [];

  $("#auth").hidden = false;
  $("#panel").hidden = true;
}


/* =========================================================
   FIRESTORE DATA
   ========================================================= */

async function loadProducts() {
  const fb = await firebase();

  const snapshot = await fb.firestore.getDocs(
    fb.firestore.collection(
      fb.db,
      "products"
    )
  );

  products = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));

  products.sort((a, b) => {
    const aTime = a.updatedAt?.seconds || 0;
    const bTime = b.updatedAt?.seconds || 0;

    return bTime - aTime;
  });
}


async function loadAds() {
  const fb = await firebase();

  const snapshot = await fb.firestore.getDocs(
    fb.firestore.collection(
      fb.db,
      "advertisements"
    )
  );

  ads = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));

  ads.sort((a, b) => {
    const aTime = a.updatedAt?.seconds || 0;
    const bTime = b.updatedAt?.seconds || 0;

    return bTime - aTime;
  });
}


async function loadAll() {
  try {
    dashboardNotice("Loading store data...");

    await Promise.all([
      loadProducts(),
      loadAds()
    ]);

    draw();

    dashboardNotice(
      "Store data synced.",
    );

  } catch (error) {
    console.error(
      "Viora Finds: failed to load Firebase data.",
      error
    );

    dashboardNotice(
      "Could not load cloud data."
    );
  }
}


/* =========================================================
   DASHBOARD
   ========================================================= */

async function refresh() {
  if (!valid()) {
    $("#auth").hidden = false;
    $("#panel").hidden = true;

    session = null;

    return;
  }

  session = true;

  $("#auth").hidden = true;
  $("#panel").hidden = false;

  $("#providerEmail").textContent =
    "Signed in as " + C.provider.username;

  await loadAll();
}


/* =========================================================
   IMAGE UPLOAD
   ========================================================= */

async function uploadImage(file, folder) {
  if (!file) return "";

  const fb = await firebase();

  if (!file.type.startsWith("image/")) {
    throw new Error(
      "Please select an image file."
    );
  }

  if (file.size > 8 * 1024 * 1024) {
    throw new Error(
      "Image must be smaller than 8 MB."
    );
  }

  const extension =
    file.name.split(".").pop().toLowerCase() || "jpg";

  const filename =
    crypto.randomUUID() +
    "." +
    extension;

  const path =
    folder +
    "/" +
    filename;

  const storageRef =
    fb.storageApi.ref(
      fb.storage,
      path
    );

  await fb.storageApi.uploadBytes(
    storageRef,
    file,
    {
      contentType: file.type,
      cacheControl: "public,max-age=31536000"
    }
  );

  return await fb.storageApi.getDownloadURL(
    storageRef
  );
}


/* =========================================================
   DRAW DASHBOARD
   ========================================================= */

function draw() {

  $("#pc").textContent =
    products.length;

  $("#dc").textContent =
    products.filter(
      (p) => p.is_deal === true
    ).length;

  $("#ac").textContent =
    ads.length;


  /* ---------------- PRODUCTS ---------------- */

  $("#plist").innerHTML =
    products.map((p) => {

      const price =
        p.price ??
        p.discounted_price ??
        0;

      const oldPrice =
        p.old_price ??
        p.original_price ??
        0;

      return `
        <div class="admin-row">

          ${
            p.image_url
              ? `
                <img
                  src="${esc(p.image_url)}"
                  alt=""
                  loading="lazy"
                >
              `
              : `
                <div class="mini-placeholder">
                  V
                </div>
              `
          }

          <div>
            <strong>
              ${esc(p.name)}
            </strong>

            <span>
              ${esc(p.category || "Uncategorized")}
              ·
              ${money(price)}

              ${
                oldPrice > price
                  ? ` · <del>${money(oldPrice)}</del>`
                  : ""
              }

              ${
                p.is_deal
                  ? " · Today's Deal"
                  : ""
              }

              ${
                p.is_active === false
                  ? " · Hidden"
                  : ""
              }
            </span>
          </div>

          <div class="row-actions">

            <button
              type="button"
              onclick="editProduct('${esc(p.id)}')"
            >
              Edit
            </button>

            <button
              type="button"
              onclick="deleteProduct('${esc(p.id)}')"
            >
              Delete
            </button>

          </div>

        </div>
      `;

    }).join("") ||
    '<p class="muted">No products yet.</p>';


  /* ---------------- ADVERTISEMENTS ---------------- */

  $("#alist").innerHTML =
    ads.map((a) => {

      return `
        <div class="admin-row">

          ${
            a.image_url
              ? `
                <img
                  src="${esc(a.image_url)}"
                  alt=""
                  loading="lazy"
                >
              `
              : `
                <div class="mini-placeholder">
                  V
                </div>
              `
          }

          <div>

            <strong>
              ${esc(a.title)}
            </strong>

            <span>
              ${
                a.is_active === false
                  ? "Hidden"
                  : "Published"
              }
            </span>

          </div>

          <div class="row-actions">

            <button
              type="button"
              onclick="editAd('${esc(a.id)}')"
            >
              Edit
            </button>

            <button
              type="button"
              onclick="deleteAd('${esc(a.id)}')"
            >
              Delete
            </button>

          </div>

        </div>
      `;

    }).join("") ||
    '<p class="muted">No campaigns yet.</p>';
}


/* =========================================================
   SAVE PRODUCT
   ========================================================= */

async function saveProduct(event) {
  event.preventDefault();

  const button =
    $("#productForm").querySelector(
      'button[type="submit"]'
    );

  const originalText =
    button.innerHTML;

  button.disabled = true;
  button.innerHTML =
    "Saving...";

  try {

    const fb = await firebase();

    const name =
      $("#pn").value.trim();

    const category =
      $("#pcat").value.trim();

    const description =
      $("#pd").value.trim();

    const oldPrice =
      Number($("#po").value) || 0;

    const price =
      Number($("#pp").value) || 0;

    if (!name) {
      throw new Error(
        "Enter a product name."
      );
    }

    if (!category) {
      throw new Error(
        "Enter a category."
      );
    }

    if (price <= 0) {
      throw new Error(
        "Enter a valid discounted price."
      );
    }

    if (
      oldPrice > 0 &&
      price > oldPrice
    ) {
      throw new Error(
        "Discounted price cannot be higher than original price."
      );
    }


    /* Upload image only if a new one was selected. */

    let imageUrl = "";

    const imageFile =
      $("#pi").files[0];

    if (imageFile) {

      imageUrl =
        await uploadImage(
          imageFile,
          "products"
        );

    } else if (editingProductId) {

      const existing =
        products.find(
          (p) =>
            String(p.id) ===
            String(editingProductId)
        );

      imageUrl =
        existing?.image_url || "";
    }


    const data = {
      name,
      category,
      description,

      old_price: oldPrice,
      price,

      discounted_price: price,
      original_price: oldPrice,

      is_deal:
        $("#deal").checked,

      is_active:
        $("#activeProduct").checked,

      image_url:
        imageUrl,

      updatedAt:
        fb.firestore.serverTimestamp()
    };


    if (editingProductId) {

      await fb.firestore.updateDoc(
        fb.firestore.doc(
          fb.db,
          "products",
          editingProductId
        ),
        data
      );

    } else {

      await fb.firestore.addDoc(
        fb.firestore.collection(
          fb.db,
          "products"
        ),
        {
          ...data,
          createdAt:
            fb.firestore.serverTimestamp()
        }
      );

    }


    clearProduct();

    await loadProducts();

    draw();

    dashboardNotice(
      editingProductId
        ? "Product updated."
        : "Product published to the store."
    );

    editingProductId = "";

  } catch (error) {

    console.error(error);

    alert(
      error.message ||
      "Could not save product."
    );

  } finally {

    button.disabled = false;
    button.innerHTML =
      originalText;
  }
}


/* =========================================================
   SAVE ADVERTISEMENT
   ========================================================= */

async function saveAd(event) {
  event.preventDefault();

  const button =
    $("#adForm").querySelector(
      'button[type="submit"]'
    );

  const originalText =
    button.innerHTML;

  button.disabled = true;
  button.innerHTML =
    "Saving...";

  try {

    const fb = await firebase();

    const title =
      $("#at").value.trim();

    const text =
      $("#ax").value.trim();

    const buttonText =
      $("#ab").value.trim() ||
      "Shop now";

    if (!title) {
      throw new Error(
        "Enter an advertisement headline."
      );
    }


    let imageUrl = "";

    const imageFile =
      $("#ai").files[0];

    if (imageFile) {

      imageUrl =
        await uploadImage(
          imageFile,
          "advertisements"
        );

    } else if (editingAdId) {

      const existing =
        ads.find(
          (a) =>
            String(a.id) ===
            String(editingAdId)
        );

      imageUrl =
        existing?.image_url || "";
    }


    const data = {
      title,
      text,
      button_text: buttonText,

      is_active:
        $("#activeAd").checked,

      image_url:
        imageUrl,

      updatedAt:
        fb.firestore.serverTimestamp()
    };


    if (editingAdId) {

      await fb.firestore.updateDoc(
        fb.firestore.doc(
          fb.db,
          "advertisements",
          editingAdId
        ),
        data
      );

    } else {

      await fb.firestore.addDoc(
        fb.firestore.collection(
          fb.db,
          "advertisements"
        ),
        {
          ...data,
          createdAt:
            fb.firestore.serverTimestamp()
        }
      );

    }


    clearAd();

    await loadAds();

    draw();

    dashboardNotice(
      editingAdId
        ? "Advertisement updated."
        : "Advertisement published."
    );

    editingAdId = "";

  } catch (error) {

    console.error(error);

    alert(
      error.message ||
      "Could not save advertisement."
    );

  } finally {

    button.disabled = false;
    button.innerHTML =
      originalText;
  }
}


/* =========================================================
   EDIT PRODUCT
   ========================================================= */

function editProduct(id) {

  const product =
    products.find(
      (p) =>
        String(p.id) ===
        String(id)
    );

  if (!product) return;

  editingProductId =
    String(product.id);

  $("#productId").value =
    editingProductId;

  $("#pn").value =
    product.name || "";

  $("#pcat").value =
    product.category || "";

  $("#po").value =
    product.old_price ??
    product.original_price ??
    "";

  $("#pp").value =
    product.price ??
    product.discounted_price ??
    "";

  $("#pd").value =
    product.description || "";

  $("#deal").checked =
    product.is_deal === true;

  $("#activeProduct").checked =
    product.is_active !== false;

  $("#productFormTitle").textContent =
    "Edit product";

  $("#productForm").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}


/* =========================================================
   EDIT ADVERTISEMENT
   ========================================================= */

function editAd(id) {

  const ad =
    ads.find(
      (a) =>
        String(a.id) ===
        String(id)
    );

  if (!ad) return;

  editingAdId =
    String(ad.id);

  $("#adId").value =
    editingAdId;

  $("#at").value =
    ad.title || "";

  $("#ax").value =
    ad.text || "";

  $("#ab").value =
    ad.button_text ||
    "Shop now";

  $("#activeAd").checked =
    ad.is_active !== false;

  $("#adFormTitle").textContent =
    "Edit campaign";

  $("#adForm").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}


/* =========================================================
   DELETE PRODUCT
   ========================================================= */

async function deleteProduct(id) {

  if (
    !confirm(
      "Delete this product permanently?"
    )
  ) {
    return;
  }

  try {

    const fb = await firebase();

    await fb.firestore.deleteDoc(
      fb.firestore.doc(
        fb.db,
        "products",
        String(id)
      )
    );

    products =
      products.filter(
        (p) =>
          String(p.id) !==
          String(id)
      );

    draw();

    dashboardNotice(
      "Product deleted."
    );

  } catch (error) {

    console.error(error);

    alert(
      "Could not delete product."
    );
  }
}


/* =========================================================
   DELETE ADVERTISEMENT
   ========================================================= */

async function deleteAd(id) {

  if (
    !confirm(
      "Delete this advertisement permanently?"
    )
  ) {
    return;
  }

  try {

    const fb = await firebase();

    await fb.firestore.deleteDoc(
      fb.firestore.doc(
        fb.db,
        "advertisements",
        String(id)
      )
    );

    ads =
      ads.filter(
        (a) =>
          String(a.id) !==
          String(id)
      );

    draw();

    dashboardNotice(
      "Advertisement deleted."
    );

  } catch (error) {

    console.error(error);

    alert(
      "Could not delete advertisement."
    );
  }
}


/* =========================================================
   CLEAR FORMS
   ========================================================= */

function clearProduct() {

  $("#productForm").reset();

  $("#productId").value = "";

  $("#productFormTitle").textContent =
    "Add a product";

  $("#activeProduct").checked =
    true;

  editingProductId = "";
}


function clearAd() {

  $("#adForm").reset();

  $("#adId").value = "";

  $("#adFormTitle").textContent =
    "Create a campaign";

  $("#activeAd").checked =
    true;

  $("#ab").value =
    "Shop now";

  editingAdId = "";
}


/* =========================================================
   EVENTS
   ========================================================= */

$("#login").addEventListener(
  "click",
  login
);

$("#logout").addEventListener(
  "click",
  logout
);

$("#productForm").addEventListener(
  "submit",
  saveProduct
);

$("#adForm").addEventListener(
  "submit",
  saveAd
);

$("#cancelProduct").addEventListener(
  "click",
  clearProduct
);

$("#cancelAd").addEventListener(
  "click",
  clearAd
);


/* Enter key on login */

$("#password").addEventListener(
  "keydown",
  (event) => {

    if (event.key === "Enter") {
      login();
    }

  }
);


/* =========================================================
   SESSION CHECK
   ========================================================= */

setInterval(
  () => {

    if (
      session &&
      !valid()
    ) {
      logout();
    }

  },
  30000
);


/* =========================================================
   PAGE SAFETY
   ========================================================= */

function restorePage() {

  document.documentElement.style.overflowY =
    "auto";

  document.body.style.overflowX =
    "hidden";

  document.body.style.overflowY =
    "auto";

  document.body.classList.remove(
    "vf-lock"
  );
}


if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    restorePage
  );

} else {

  restorePage();
}


window.addEventListener(
  "load",
  restorePage
);

window.addEventListener(
  "resize",
  restorePage
);


/* =========================================================
   EXPOSE EDIT / DELETE FUNCTIONS
   ========================================================= */

window.editProduct =
  editProduct;

window.deleteProduct =
  deleteProduct;

window.editAd =
  editAd;

window.deleteAd =
  deleteAd;


/* =========================================================
   START
   ========================================================= */

refresh();
