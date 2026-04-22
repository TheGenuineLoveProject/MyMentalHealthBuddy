// server/utils/asyncLock.mjs
//
// Simple per-key in-process async mutex.
// Serializes async work scoped by a string key (e.g. userId) so that
// read-modify-write sequences across awaits cannot interleave.
//
// In-process only — does NOT protect against multiple Node instances.
// For single-process workloads (which this app is) it's sufficient.

const locks = new Map();

export async function withLock(key, fn) {
        const k = String(key || "default");
        const prev = locks.get(k) || Promise.resolve();

        let release;
        // The "tail" promise becomes the new lock — anyone arriving after us
        // will await `prev` (our completion) before their fn runs.
        const current = prev.then(
                () =>
                        new Promise((resolve) => {
                                release = resolve;
                        }),
        );
        locks.set(k, current);

        await prev;
        try {
                return await fn();
        } finally {
                release();
                // GC: if no one chained behind us, free the slot.
                if (locks.get(k) === current) {
                        locks.delete(k);
                }
        }
}
