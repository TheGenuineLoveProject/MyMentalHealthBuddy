/**
 * client/src/services/billingClient.js
 * Canonical billing client for checkout + portal
 */

const PRICE_IDS = {
  monthly: 'price_1San16RtwDw9mKhak1ibDurJ',
  annual: 'price_1San2IRtwDw9mKhaH1bCV0Vv',
};

export async function createCheckoutSession(priceId) {
  try {
    const res = await fetch('/api/billing/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ priceId }),
    });

    if (res.status === 401) {
      const returnTo = encodeURIComponent(window.location.pathname);
      window.location.href = `/login?returnTo=${returnTo}`;
      return null;
    }

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
      return data;
    }

    throw new Error(data.error?.message || data.message || 'Unable to start checkout');
  } catch (err) {
    throw err;
  }
}

export async function openBillingPortal() {
  try {
    const res = await fetch('/api/billing/portal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (res.status === 401) {
      const returnTo = encodeURIComponent(window.location.pathname);
      window.location.href = `/login?returnTo=${returnTo}`;
      return null;
    }

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
      return data;
    }

    throw new Error(data.error?.message || data.message || 'Unable to open billing portal');
  } catch (err) {
    throw err;
  }
}

export { PRICE_IDS };
