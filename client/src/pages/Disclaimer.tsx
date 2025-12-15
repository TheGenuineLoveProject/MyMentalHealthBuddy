export default function Disclaimer() {
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-3xl font-heading">Disclaimer</h1>

      <p>
        The Genuine Love Project (“TGLP”) provides self-reflection tools, journaling features,
        mood tracking, and supportive, non-clinical guidance. It is intended for informational
        and educational purposes only.
      </p>

      <h2 className="text-xl font-heading pt-4">Not Medical Advice</h2>
      <p>
        TGLP does not provide medical advice, diagnosis, or treatment. Your use of the app does
        not create a therapist-client, doctor-patient, or other professional relationship.
      </p>

      <h2 className="text-xl font-heading pt-4">Crisis & Emergency</h2>
      <p>
        If you are in immediate danger, call your local emergency number right now.
        If you are thinking about self-harm, seek immediate help from emergency services or a
        crisis hotline in your country.
      </p>

      <h2 className="text-xl font-heading pt-4">AI Limitations</h2>
      <p>
        AI-generated responses may be inaccurate, incomplete, or inappropriate for your situation.
        Do not rely on AI outputs for urgent, medical, legal, or safety-critical decisions.
      </p>

      <p className="text-sm opacity-80 pt-6">
        By using TGLP, you agree to these limitations and accept responsibility for your choices.
      </p>
    </main>
  );
}