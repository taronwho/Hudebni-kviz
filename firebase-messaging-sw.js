importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-messaging-compat.js');

// Okamžitá aktivace nového Service Workeru
self.addEventListener('install', function(event) {
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    event.waitUntil(clients.claim());
});

// Tvé údaje z databáze hudebni-kviz-69646
const firebaseConfig = {
    apiKey: "AIzaSyC8tkUP7PWlV6ll-ivg7KB2eRdPHVemhC4",
    authDomain: "hudebnikviz-69646.firebaseapp.com",
    projectId: "hudebnikviz-69646",
    storageBucket: "hudebnikviz-69646.firebasestorage.app",
    messagingSenderId: "449102218633",
    appId: "1:449102218633:web:71730081806159b0984d58"
};

// Inicializace Firebase běžícího na pozadí
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// --- KLÍČOVÁ ZMĚNA: AKTIVNÍ ZOBRAZENÍ NOTIFIKACE ---
messaging.onBackgroundMessage(function(payload) {
  console.log('Zpráva dorazila na pozadí:', payload);
  
  // Získáme texty z notifikace nebo z dat
  const notificationTitle = payload.notification?.title || payload.data?.title || "Hudební Kvíz 🎵";
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || "Máš novou zprávu ve hře!",
    icon: '/icon-192.png',      
    badge: '/icon-192.png',     
    vibrate: [200, 100, 200],   
    tag: 'music-quiz-msg',      
    renotify: true,             
    requireInteraction: true,   
    data: {
        url: self.location.origin 
    }
  };

  // Příkaz k zobrazení okna v systému
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// --- REAKCE NA KLIKNUTÍ (Otevře hru) ---
self.addEventListener('notificationclick', function(event) {
  event.notification.close(); 
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow('/');
    })
  );
});

// --- PWA POŽADAVEK PRO INSTALACI ---
self.addEventListener('fetch', function(event) {
    event.respondWith(fetch(event.request));
});