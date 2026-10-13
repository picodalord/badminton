// js/firebase-config.js
const firebaseConfig = window.firebaseConfig;

if (!firebaseConfig) {
  console.error("Không tìm thấy firebaseConfig! Hãy kiểm tra file firebase-env.js");
} else {
  // Khởi tạo Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
}