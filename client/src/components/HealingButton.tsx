// HealingButton.tsx

export function HealingButton() {
  const handleClick = () => {
    fetch("/api/heal", { method: "POST" })
      .then((res) => res.json())
      .then((data) => alert("Healing activated: " + data.status))
      .catch((err) => alert("Error activating healing"));
  };

  return (
    <button
      className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md shadow-md transition"
      onClick={handleClick}
    >
      💚 Activate Healing Now
    </button>
  );
}