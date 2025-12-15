export default function Auth() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <img src="/brand/logo.png" className="h-16 mx-auto mb-6" />

        <h1 className="font-playfair text-2xl text-center mb-4">
          Welcome Back
        </h1>

        <input
          placeholder="Email"
          className="w-full mb-3 p-3 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 border rounded"
        />

        <button className="w-full bg-sage text-white py-3 rounded-full">
          Continue
        </button>

        <p className="text-sm text-center mt-4 text-charcoal">
          By continuing, you agree to live in genuine love.
        </p>
      </div>
    </div>
  );
}