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
    apiKey: "AIzaSyC_xfdMVFTFTYJxY61BVoQAQNCcY5EKmL7Xc",
    authDomain: "viora-finds.firebaseapp.com",
    projectId: "viora-finds",
    messagingSenderId: "864497068638",
    appId: "1:864497068638:web:a069b5415a2fb96fe7e2cf"
  },

  cloudinary: {
    cloudName: "YOUR_CLOUDINARY_CLOUD_NAME",
    uploadPreset: "YOUR_UNSIGNED_UPLOAD_PRESET"
  }
};
