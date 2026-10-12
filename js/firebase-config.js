if (!firebase.apps.length) {
  firebase.initializeApp(window.firebaseConfig || firebaseConfig);
}