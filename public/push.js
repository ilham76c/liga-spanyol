var webPush = require('web-push');

const vapidKeys = {
   "publicKey": "BIvxlGO5K8mTM1F1BK9JGyACcO5kqonnkI6wHEEYvMYByBDVhgyP_R5vWIcHrxRV7CYxvFyCsdybFbGHKgo4JZ4",
   "privateKey": "gGOqFiiep0qI6GVJDmMyhDeG4k_CyNz3ROsBfLfW8sQ"
};


webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
var pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/ecCPENOpyWQ:APA91bFHSK4NFjMVBPQ2ak-W7AP0WDNy1EV8XKZNIDkE7G0a79dOJ8bywZ7Y_K_HeI2s4DoYT58SZgeOHMkovkcv6MLA5fj0GUgpoNsoszfzWqaXgRmrGX9BpVGPyGZbTP0oY15UxvuU",
   "keys": {
       "p256dh": "BOuTKTRWLUKfYkM7BU7NQ0bzTuZzM2gElOnOZA+OxiEEUZND3XM5AwJ9emWL27keHilYVaaz18yP0qTb42frD6I=",
       "auth": "llHeHHAlWAntmApmTqvY8Q=="
   }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';

var options = {
   gcmAPIKey: '437612368310',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
);