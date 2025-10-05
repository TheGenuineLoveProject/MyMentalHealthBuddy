export const runHealing = async (req, res) => {
  try {
    console.log("🩺 Healing initiated...");
    // Simulate healing;
    setTimeout(() => {
      console.log("✅ Platform healing complete!")
    }, 2000);
    return res.json({ success: true })
  } catch (err) {
    return res.status(500).json({ success: false, message: "Healing failed." })
  }
};
