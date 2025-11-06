/**
 * Service Worker Registration
 * Register the service worker for offline support and PWA features
 */
export function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                console.log('Service Worker registered successfully:', registration.scope);
                // Check for updates every hour
                setInterval(() => {
                    registration.update();
                }, 60 * 60 * 1000);
                // Listen for service worker updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                console.log('New Service Worker available - refresh to update');
                                // Optionally show update notification to user
                            }
                        });
                    }
                });
            })
                .catch((error) => {
                console.error('Service Worker registration failed:', error);
            });
            // Listen for messages from service worker
            navigator.serviceWorker.addEventListener('message', async (event) => {
                if (event.data && event.data.type === 'SYNC_QUEUE') {
                    console.log('Service Worker: Sync queue message received');
                    // Trigger offline queue sync
                    try {
                        const { offlineManager } = await import('./lib/offlineManager');
                        await offlineManager.syncQueue();
                    }
                    catch (error) {
                        console.error('Failed to sync offline queue:', error);
                    }
                }
            });
        });
    }
}
/**
 * Unregister service worker (for development)
 */
export async function unregisterServiceWorker() {
    if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
            await registration.unregister();
        }
        console.log('Service Worker unregistered');
    }
}
/**
 * Check if app is running as PWA
 */
export function isPWA() {
    return window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;
}
/**
 * Prompt user to install PWA
 */
export function setupInstallPrompt() {
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later
        deferredPrompt = e;
        // Show custom install button/banner
        const installButton = document.querySelector('[data-install-button]');
        if (installButton) {
            installButton.classList.remove('hidden');
            installButton.addEventListener('click', () => {
                // Hide the button
                installButton.classList.add('hidden');
                // Show the install prompt
                deferredPrompt.prompt();
                // Wait for the user to respond to the prompt
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                    }
                    else {
                        console.log('User dismissed the install prompt');
                    }
                    deferredPrompt = null;
                });
            });
        }
    });
    // Track if app was installed
    window.addEventListener('appinstalled', () => {
        console.log('PWA installed successfully');
        deferredPrompt = null;
    });
}
