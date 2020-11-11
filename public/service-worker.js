importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox) {
  console.log(`Workbox berhasil dimuat`);
} else {
  console.log(`Workbox gagal dimuat`);
}

let urlsToCache = [
  { url: "/public/index.html", revision: "1" },
  { url: "/public/match.html", revision: "1" },
  { url: "/public/nav.html", revision: "1" },
  { url: "/public/manifest.json", revision: "1" },
  { url: "/public/favicon.ico", revision: "1" },  
  { url: "/public/js/ThirdParty/materialize.min.js", revision: "1" },  
  { url: "/public/js/ThirdParty/idb.js", revision: "1" },  
  { url: "/public/js/api.js", revision: "1" },  
  { url: "/public/js/nav.js", revision: "1" },  
  { url: "/public/js/db.js", revision: "1" },  
  { url: "/public/img/laliga.png", revision: "1" },
  { url: "/public/img/bg2.jpeg", revision: "1" },
  { url: "/public/img/maskable_icon.png", revision: "1" },
  { url: "/public/img/W.png", revision: "1" },
  { url: "/public/img/D.png", revision: "1" },
  { url: "/public/img/L.png", revision: "1" },
  { url: "/public/pages/match.html", revision: "1" },
  { url: "/public/pages/standing.html", revision: "1" },
  { url: "/public/pages/saved.html", revision: "1" },
];

workbox.precaching.precacheAndRoute(
  urlsToCache, {
    ignoreUrlParametersMatching: [/.*/]
  }
);

// Menyimpan cache untuk file font selama 1 tahun
workbox.routing.registerRoute(
  new RegExp('^https:\/\/fonts\.gstatic\.com/'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  new RegExp('^https:\/\/fonts\.googleapis\.com/'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  })
);


// workbox.routing.registerRoute(
//   new RegExp('/public/pages/'),
//   workbox.strategies.staleWhileRevalidate({
//       cacheName: 'pages'
//   })
// );

// workbox.routing.registerRoute(
//   new RegExp('/\.(?:png|gif|jpg|jpeg|svg)$/'),
//   workbox.strategies.cacheFirst({
//     cacheName: "icon"
//   })
// );


workbox.routing.registerRoute(
  new RegExp('https://crests.football-data.org/*'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: "icon",
    plugins: [    
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  new RegExp('/public/css/'),
  // new RegExp('^.*css)*$'),
  workbox.strategies.cacheFirst({
      cacheName: 'styles'
  })
);

// workbox.routing.registerRoute(
//   new RegExp('/js/*.js'),
//   //new RegExp('/\.(?:js)$/'),
//   //workbox.strategies.networkFirst({
//   workbox.strategies.staleWhileRevalidate({
//       cacheName: 'js',
//       networkTimeoutSeconds: 10
//   })
// );

// workbox.routing.registerRoute(
//   'https://api.football-data.org/v2/competitions/2014/matches?status=SCHEDULED',  
//   workbox.strategies.staleWhileRevalidate({
//       networkTimeoutSeconds: 3,
//       cacheName: 'matches'
//   })
// );

workbox.routing.registerRoute(
  ({url}) => url.origin === 'https://api.football-data.org',
  workbox.strategies.staleWhileRevalidate({
    networkTimeoutSeconds: 3,
    cacheName: 'matches'
  })
);

// workbox.routing.registerRoute(
//   new RegExp("id=\*|saved=true"),
//   workbox.strategies.staleWhileRevalidate({
//       networkTimeoutSeconds: 3,
//       cacheName: 'detail'
//   })
// );

// workbox.routing.registerRoute(
//   new RegExp("https://api.football-data.org/v2/matches/*"),
//   workbox.strategies.staleWhileRevalidate({
//       networkTimeoutSeconds: 3,
//       cacheName: 'detail-match'
//   })
// );

// workbox.routing.registerRoute(
//   'https://api.football-data.org/v2/competitions/2014/standings',
//   workbox.strategies.staleWhileRevalidate({
//       networkTimeoutSeconds: 3,
//       cacheName: 'standings'
//   })
// );


self.addEventListener("push", function (event) {
    var body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = "Push message no payload";
    }
    var options = {
        body: body,
        icon: "/public/img/laliga.png",
        vibrate: [100, 50, 100],
        data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
        },
    };
    event.waitUntil(
        self.registration.showNotification("Push Notification", options)
    );
});