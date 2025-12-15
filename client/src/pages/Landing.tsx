export default function Landing() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-ivory text-charcoal px-6 text-center">
      <img
        src="/brand/logo.png"
        alt="The Genuine Love Project"
        className="h-32 mb-8"
      />

      <h1 className="font-playfair text-4xl md:text-5xl mb-4">
        Live in Genuine Love
      </h1>

      <p className="max-w-xl text-lg font-inter mb-8">
        A healing platform designed to help you reconnect with yourself,
        grow with compassion, and live in alignment.
      </p>

      <button className="bg-sage text-white px-8 py-3 rounded-full text-lg hover:bg-teal transition">
        Begin Your Journey
      </button>
    </section>
  );
}