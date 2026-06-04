import assert from "node:assert";

function validateCheckoutResponseShape(payload) {
	const hasTopLevelUrl =
		typeof payload?.url === "string" &&
		payload.url.startsWith("http");

	assert.ok(
		hasTopLevelUrl,
		"Checkout response must expose top-level url"
	);
}

/* PASS CASE */
validateCheckoutResponseShape({
	success: true,
	url: "https://checkout.stripe.com/test"
});

/* FAIL EXAMPLE
validateCheckoutResponseShape({
	ok: true,
	data: {
		url: "https://checkout.stripe.com/test"
	}
});
*/

console.log("✓ billing response shape valid");