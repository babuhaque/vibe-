// Solovvo Blood Donation Platform - Service Worker
// Handles background lifecycle, offline caching, and local browser push notifications for scheduled donations

const CACHE_NAME = 'solovvo-cache-v1';
const PRECACHE_URLS = ['/', '/index.html', '/icon.svg'];

// Install Event
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch((err) => {
        console.warn('Precache partial fallback', err);
      });
    })
  );
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_NAME) {
              return caches.delete(name);
            }
          })
        );
      }),
    ])
  );
});

// Message Event: Receive notification triggers and appointment checks from frontend
self.addEventListener('message', (event) => {
  if (!event.data) return;

  const { type, payload } = event.data;

  // 1. Direct Show Notification request
  if (type === 'SHOW_NOTIFICATION') {
    const title = payload.title || 'Solovvo Blood Donation Reminder 🩸';
    const options = {
      body: payload.body || 'You have an upcoming blood donation appointment.',
      icon: payload.icon || '/icon.svg',
      badge: payload.badge || '/icon.svg',
      tag: payload.tag || `solovvo-${payload.appointmentId || Date.now()}`,
      data: payload.data || { url: '/?tab=account' },
      actions: [
        { action: 'view', title: '🏥 View Center' },
        { action: 'dismiss', title: 'Dismiss' },
      ],
      vibrate: [200, 100, 200, 100, 200],
      requireInteraction: true,
      renotify: true,
    };

    event.waitUntil(self.registration.showNotification(title, options));
  }

  // 2. Check Approaching Appointments
  if (type === 'CHECK_APPROACHING_APPOINTMENTS') {
    const appointments = payload.appointments || [];
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    appointments.forEach((apt) => {
      if (apt.status !== 'upcoming') return;

      const aptDate = new Date(apt.scheduledDate);
      const diffTime = aptDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // If scheduled for today or within 3 days
      if (apt.scheduledDate === todayStr || (diffDays >= 0 && diffDays <= 3)) {
        const isToday = apt.scheduledDate === todayStr;
        const title = isToday
          ? `🩸 Donation Today: ${apt.hospitalOrCenter}`
          : `⏳ Approaching Donation in ${diffDays} Day${diffDays > 1 ? 's' : ''}!`;

        const body = isToday
          ? `Your appointment is today at ${apt.scheduledTime}. Remember to drink at least 500ml water before heading to ${apt.hospitalOrCenter}.`
          : `Scheduled on ${apt.scheduledDate} at ${apt.scheduledTime} (${apt.hospitalOrCenter}). Prepare well by staying hydrated!`;

        self.registration.showNotification(title, {
          body,
          icon: '/icon.svg',
          badge: '/icon.svg',
          tag: `solovvo-approaching-${apt.id}`,
          data: { appointmentId: apt.id, url: '/?tab=account' },
          actions: [
            { action: 'view', title: '🏥 View Details' },
            { action: 'dismiss', title: 'Dismiss' },
          ],
          vibrate: [250, 150, 250],
          requireInteraction: true,
        });
      }
    });
  }
});

// Push Event: Handles incoming Web Push notifications (if paired with WebPush / VAPID server)
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { body: event.data.text() };
    }
  }

  const title = data.title || 'Solovvo Emergency Blood Notification';
  const options = {
    body: data.body || 'A critical emergency blood request needs your attention.',
    icon: data.icon || '/icon.svg',
    badge: data.badge || '/icon.svg',
    tag: data.tag || 'solovvo-push',
    data: data.data || { url: '/?tab=activity' },
    actions: [
      { action: 'view', title: 'Open App' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
    vibrate: [300, 100, 300],
    requireInteraction: true,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification Click Event: Focus or open window when user interacts with notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const targetUrl = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if client window is already open
      for (const client of clientList) {
        if ('focus' in client) {
          client.postMessage({
            type: 'NOTIFICATION_CLICKED',
            appointmentId: event.notification.data?.appointmentId,
            action: event.action,
          });
          return client.focus();
        }
      }
      // If not open, open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

// Fetch Event with network-first fallback to cache
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  // Ignore chrome-extension or external analytics
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/index.html');
          }
        });
      })
  );
});
