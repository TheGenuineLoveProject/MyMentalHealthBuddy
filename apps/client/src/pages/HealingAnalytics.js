import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
export default function HealingAnalytics() {
    const [data, setData] = useState(null);
    useEffect(() => { fetch("/analytics/metrics.json", { cache: "no-store" }).then(r => r.json()).then(setData).catch(() => setData(null)); }, []);
    return (_jsxs("div", { style: { padding: 24, maxWidth: 980, margin: "0 auto", fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,sans-serif" }, children: [_jsx("h1", { children: "\uD83D\uDC9A Healing Analytics" }), !data && _jsx("p", { children: "Loading\u2026" }), data && _jsxs(_Fragment, { children: [_jsxs("section", { style: { border: "1px solid #eee", borderRadius: 12, padding: 16, margin: "12px 0" }, children: [_jsx("h3", { children: "Summary" }), _jsx("pre", { style: { whiteSpace: "pre-wrap" }, children: JSON.stringify(data.summary, null, 2) })] }), _jsxs("section", { style: { border: "1px solid #eee", borderRadius: 12, padding: 16, margin: "12px 0" }, children: [_jsx("h3", { children: "Health (last 14 days)" }), _jsx("canvas", { id: "healing-chart", height: 120 })] }), _jsxs("section", { style: { border: "1px solid #eee", borderRadius: 12, padding: 16, margin: "12px 0" }, children: [_jsx("h3", { children: "Insights" }), _jsx("ul", { children: (data.insights || []).map((i, idx) => _jsx("li", { children: i }, idx)) })] })] })] }));
}
function ensureChartScript() {
    return new Promise((res, rej) => {
        if (window.Chart)
            return res();
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/npm/chart.js";
        s.onload = () => res();
        s.onerror = () => rej();
        document.head.appendChild(s);
    });
}
function drawChart(points) {
    const el = document.getElementById("healing-chart");
    if (!el || !window.Chart)
        return;
    const labels = points.map(p => new Date(p.t).toLocaleString());
    const vals = points.map(p => p.health);
    // @ts-ignore
    new window.Chart(el, { type: "line", data: { labels, datasets: [{ label: "System Health", data: vals, fill: false, tension: .2 }] }, options: { scales: { y: { min: 0, max: 100 } } } });
}
if (typeof window !== "undefined") {
    (async () => {
        await ensureChartScript();
        fetch("/analytics/metrics.json", { cache: "no-store" }).then(r => r.json()).then((d) => drawChart(d.series || [])).catch(() => { });
    })();
}
