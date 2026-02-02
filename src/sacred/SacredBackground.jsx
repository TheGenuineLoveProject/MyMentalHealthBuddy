export default function SacredBackground({ mood }) {
  const moodMap = {
    Calm: "from-blue-100 to-blue-300",
    Joy: "from-yellow-200 to-pink-300",
    Sad: "from-gray-300 to-gray-500",
    Anxious: "from-purple-200 to-indigo-400",
    Grateful: "from-green-100 to-green-300",
    Default: "from-softWhite to-sageGreen",
  };

  const gradient = moodMap[mood] || moodMap.Default;

  return (
    <div
      className={`fixed inset-0 z-0 bg-gradient-to-br ${gradient} animate-fadeIn`}
    />
  );
}