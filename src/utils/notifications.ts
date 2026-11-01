import { CalculatedItem } from '../types/consumable';
import { formatDateDisplay } from './dateCalc';

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!isNotificationSupported()) return 'unsupported';
  try {
    return await Notification.requestPermission();
  } catch (e) {
    console.error('Error requesting notification permission:', e);
    return 'denied';
  }
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }
  try {
    const reg = await navigator.serviceWorker.register('/sw.js');
    return reg;
  } catch (e) {
    console.error('Service Worker registration failed:', e);
    return null;
  }
}

export async function sendBrowserNotification(title: string, options?: NotificationOptions): Promise<boolean> {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }

  const defaultOptions: NotificationOptions = {
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'replenish-notification-pt',
    ...options
  };

  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready;
      if (reg && reg.showNotification) {
        await reg.showNotification(title, defaultOptions);
        return true;
      }
    }
    new Notification(title, defaultOptions);
    return true;
  } catch (e) {
    console.error('Failed to show notification:', e);
    return false;
  }
}

export async function sendTestNotification(): Promise<boolean> {
  return sendBrowserNotification('Replenish (Casa) - Notificações Ativas', {
    body: 'As notificações foram configuradas com sucesso! Receberá avisos atempados sobre a substituição de consumíveis.',
    tag: 'replenish-test-notification-pt'
  });
}

export async function checkAndNotifyUrgentItems(items: CalculatedItem[]): Promise<void> {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return;
  }

  const overdue = items.filter((i) => i.status === 'overdue');
  const today = items.filter((i) => i.status === 'today');
  const buySoon = items.filter((i) => i.status === 'buy_soon');

  const totalUrgent = overdue.length + today.length + buySoon.length;
  if (totalUrgent === 0) return;

  const lastNotified = localStorage.getItem('replenish_last_notification_date_pt');
  const todayStr = new Date().toISOString().slice(0, 10);
  if (lastNotified === todayStr) return;

  let title = '';
  let body = '';

  if (overdue.length > 0) {
    title = `⚠️ Replenish: ${overdue.length} consumível(eis) em atraso`;
    const names = overdue.slice(0, 2).map((i) => i.name).join(', ');
    body = `Substituição necessária: ${names}${overdue.length > 2 ? ' e outros' : ''}.`;
  } else if (today.length > 0) {
    title = `🔔 Replenish: ${today.length} consumível(eis) a vencer hoje`;
    const names = today.slice(0, 2).map((i) => i.name).join(', ');
    body = `Planeie a troca hoje: ${names}${today.length > 2 ? ' e outros' : ''}.`;
  } else if (buySoon.length > 0) {
    title = `🛒 Replenish: ${buySoon.length} consumível(eis) para comprar`;
    const names = buySoon.slice(0, 2).map((i) => i.name).join(', ');
    body = `Prepare a reposição: ${names}${buySoon.length > 2 ? ' e outros' : ''}.`;
  }

  const success = await sendBrowserNotification(title, {
    body,
    tag: 'replenish-daily-reminder-pt'
  });

  if (success) {
    localStorage.setItem('replenish_last_notification_date_pt', todayStr);
  }
}
