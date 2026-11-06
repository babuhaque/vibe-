// Solovvo Service Worker & Push Notification Manager
import { ScheduledDonation } from '../types/solovvo';

export interface ServiceWorkerStatus {
  isSupported: boolean;
  isRegistered: boolean;
  isActive: boolean;
  scope?: string;
  permission: NotificationPermission;
}

let swRegistration: ServiceWorkerRegistration | null = null;
let notificationClickListeners: ((appointmentId?: string) => void)[] = [];

/**
 * Register the Service Worker (/sw.js)
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.warn('Service Worker is not supported in this browser environment.');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    swRegistration = registration;
    console.log('[Solovvo SW] Service Worker registered with scope:', registration.scope);

    // Wait until the service worker is active
    if (registration.installing) {
      console.log('[Solovvo SW] Installing...');
    } else if (registration.waiting) {
      console.log('[Solovvo SW] Installed & Waiting');
    } else if (registration.active) {
      console.log('[Solovvo SW] Active');
    }

    // Listen for messages posted from Service Worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data?.type === 'NOTIFICATION_CLICKED') {
        const appointmentId = event.data.appointmentId;
        console.log('[Solovvo SW] Notification clicked for appointment:', appointmentId);
        notificationClickListeners.forEach((fn) => fn(appointmentId));
      }
    });

    return registration;
  } catch (error) {
    console.error('[Solovvo SW] Service Worker registration failed:', error);
    return null;
  }
}

/**
 * Get current Service Worker and Notification status
 */
export async function getServiceWorkerStatus(): Promise<ServiceWorkerStatus> {
  const isSupported = typeof window !== 'undefined' && 'serviceWorker' in navigator;
  const permission = typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default';

  if (!isSupported) {
    return {
      isSupported: false,
      isRegistered: false,
      isActive: false,
      permission,
    };
  }

  try {
    const reg = await navigator.serviceWorker.getRegistration();
    return {
      isSupported: true,
      isRegistered: !!reg,
      isActive: !!reg?.active,
      scope: reg?.scope,
      permission,
    };
  } catch (err) {
    return {
      isSupported: true,
      isRegistered: false,
      isActive: false,
      permission,
    };
  }
}

/**
 * Trigger local browser push notification through the Service Worker
 */
export async function showServiceWorkerNotification(
  title: string,
  options: {
    body: string;
    appointmentId?: string;
    tag?: string;
    icon?: string;
    badge?: string;
    data?: any;
  }
): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  // Request permission if not already granted
  if ('Notification' in window && Notification.permission !== 'granted') {
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') {
      console.warn('[Solovvo SW] Notification permission denied');
      return false;
    }
  }

  try {
    // 1. Try active Service Worker registration first (standard modern PWA method)
    let reg: ServiceWorkerRegistration | undefined = swRegistration || (await navigator.serviceWorker.ready);
    if (!reg) {
      reg = await navigator.serviceWorker.getRegistration();
    }

    if (reg && 'showNotification' in reg) {
      await reg.showNotification(title, {
        body: options.body,
        icon: options.icon || '/icon.svg',
        badge: options.badge || '/icon.svg',
        tag: options.tag || `solovvo-${options.appointmentId || Date.now()}`,
        data: options.data || { appointmentId: options.appointmentId, url: '/?tab=account' },
        actions: [
          { action: 'view', title: '🏥 View Center' },
          { action: 'dismiss', title: 'Dismiss' },
        ],
        vibrate: [200, 100, 200, 100, 200],
        requireInteraction: true,
      } as any);

      console.log('[Solovvo SW] Notification displayed via Service Worker registration');
      return true;
    }

    // 2. Fallback: postMessage to active worker
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SHOW_NOTIFICATION',
        payload: {
          title,
          ...options,
        },
      });
      return true;
    }

    // 3. Fallback: direct window Notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: options.body,
        icon: options.icon || '/icon.svg',
      });
      return true;
    }

    return false;
  } catch (error) {
    console.error('[Solovvo SW] Failed to show notification:', error);
    // Graceful fallback to window.Notification
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, { body: options.body, icon: '/icon.svg' });
        return true;
      } catch (_) {}
    }
    return false;
  }
}

/**
 * Check approaching scheduled appointments and request Service Worker to notify user
 */
export async function checkApproachingAppointments(appointments: ScheduledDonation[]) {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  try {
    const reg = swRegistration || (await navigator.serviceWorker.ready);

    // Send payload to active Service Worker controller
    if (reg?.active) {
      reg.active.postMessage({
        type: 'CHECK_APPROACHING_APPOINTMENTS',
        payload: {
          appointments,
        },
      });
      console.log('[Solovvo SW] Checked approaching appointments with Service Worker');
    }
  } catch (error) {
    console.warn('[Solovvo SW] Error checking approaching appointments:', error);
  }
}

/**
 * Subscribe to notification clicks
 */
export function onServiceWorkerNotificationClick(callback: (appointmentId?: string) => void) {
  notificationClickListeners.push(callback);
  return () => {
    notificationClickListeners = notificationClickListeners.filter((fn) => fn !== callback);
  };
}
