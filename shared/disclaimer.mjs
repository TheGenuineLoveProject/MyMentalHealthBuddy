import { MIRROR_DISCLAIMER } from "../../shared/disclaimer.mjs"; 
// adjust ../ path as needed depending on file location
import { JOURNALING_DISCLAIMER } from "../shared/disclaimer.mjs"; 
// ^ adjust path if your folder layout is slightly different

app.post("/api/mirror", async (req, res) => {
  // ...your existing logic...

  return res.status(200).json({
    ok: true,
    title: "Gentle Mirror",
    note: JOURNALING_DISCLAIMER, // ✅ REQUIRED
    // ...rest of your payload...
  });
});
return res.status(200).json({
  ok: true,
  // ...your existing fields
  disclaimer: MIRROR_DISCLAIMER,
});

return res.status(400).json({
  ok: false,
  error: "Please write a little more (at least ~10 characters).",
  code: "validation",
  title: "Gentle Mirror",
  disclaimer: MIRROR_DISCLAIMER,
});
// =====================================================
// FILE: shared/disclaimer.mjs
// =====================================================
export const DISCLAIMER_TEXT = "Some disclaimer text...";

export function getDisclaimerText() {
  return DISCLAIMER_TEXT;
}
