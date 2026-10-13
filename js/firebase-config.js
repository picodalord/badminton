// js/firebase-config.js
(function () {
  const config = window.firebaseConfig;

  if (!config) {
    console.error("Không tìm thấy firebaseConfig! Hãy kiểm tra file js/firebase-env.js");
    return;
  }

  // Khởi tạo Firebase App nếu chưa khởi tạo
  if (typeof firebase !== "undefined") {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
    // Gán đối tượng database ra biến toàn cục nếu cần dùng
    window.db = firebase.database();
  } else {
    console.error("Firebase SDK chưa được tải qua CDN!");
  }
})();