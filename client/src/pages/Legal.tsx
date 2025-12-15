export default function Legal() {
  return (
    <div className="min-h-screen bg-ivory px-6 py-12 max-w-3xl mx-auto">
      <h1 className="font-playfair text-3xl mb-6">Legal & Care Notice</h1>

      <p className="mb-4 font-inter">
        The Genuine Love Project provides supportive, educational,
        and reflective tools. It does not replace professional
        medical or mental health care.
      </p>

      <p className="mb-4 font-inter">
        If you are in crisis or need immediate support,
        please contact local emergency services or a licensed professional.
      </p>

      <p className="text-sm text-charcoal">
        © {new Date().getFullYear()} The Genuine Love Project.
        All rights reserved.
      </p>
    </div>
  );
}