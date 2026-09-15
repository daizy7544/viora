// window.VIORA_CONFIG={
//   currency:"INR",
//   whatsappNumber:"9463190860",
//   provider:{
//     username:"Daizy",
//     passwordHash:"bb6ec69f6cf3eb15da6223097249fdea58313c8a6f5f09345446e6e07cea7543",
//     sessionMinutes:120,
//     maxAttempts:5,
//     lockMinutes:10
//   }
// };
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
/* Viora Finds — Firebase + store configuration */

window.VIORA_CONFIG = {
  currency: "INR",
  whatsappNumber: "9463190860",

  provider: {
    username: "Daizy",
    passwordHash:
      "bb6ec69f6cf3eb15da6223097249fdea58313c8a6f5f09345446e6e07cea7543",
    sessionMinutes: 120,
    maxAttempts: 5,
    lockMinutes: 10
  },

  firebase: {
    apiKey: "AIzaSyC_xfdMVFTYJxY61BVoQAQNCcY5EKmL7Xc",
    authDomain: "viora-finds.firebaseapp.com",
    projectId: "viora-finds",
    storageBucket: "viora-finds.firebasestorage.app",
    messagingSenderId: "864497068638",
    appId: "1:864497068638:web:a069b5415a2fb96fe7e2cf",
    measurementId: "G-1T9X3NGS2S"
  }
};


/* =========================================================
   FIREBASE INITIALIZATION
   ========================================================= */

window.VIORA_FIREBASE_READY = (async function () {
  try {
    const [
      appModule,
      firestoreModule,
      storageModule
    ] = await Promise.all([
      import(
        "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js"
      ),
      import(
        "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js"
      ),
      import(
        "https://www.gstatic.com/firebasejs/12.19.0/firebase-storage.js"
      )
    ]);

    const app = appModule.initializeApp(
      window.VIORA_CONFIG.firebase
    );

    const db = firestoreModule.getFirestore(app);
    const storage = storageModule.getStorage(app);

    window.VIORA_FIREBASE = {
      app: app,
      db: db,
      storage: storage,
      firestore: firestoreModule,
      storageApi: storageModule
    };

    console.log("Viora Finds: Firebase connected.");

    return window.VIORA_FIREBASE;

  } catch (error) {

    console.error(
      "Viora Finds: Firebase initialization failed.",
      error
    );

    window.VIORA_FIREBASE = null;

    return null;
  }
})();


/* =========================================================
   PAGE / SCROLL SAFETY
   ========================================================= */

function vioraRestoreScroll() {

  document.documentElement.style.overflowY = "auto";

  document.body.style.overflowX = "hidden";

  if (!document.querySelector(".vf-modal.is-open")) {
    document.body.classList.remove("vf-lock");
    document.body.style.overflowY = "auto";
  }

  document
    .querySelectorAll(
      ".section,.ad-section,.about,.product-card"
    )
    .forEach(function (el) {

      el.classList.add("vf-visible");

      el.style.opacity = "1";

      el.style.visibility = "visible";
    });
}


if (document.readyState === "loading") {

  document.addEventListener(
    "DOMContentLoaded",
    vioraRestoreScroll
  );

} else {

  vioraRestoreScroll();
}


window.addEventListener(
  "load",
  vioraRestoreScroll
);

window.addEventListener(
  "resize",
  vioraRestoreScroll
);
