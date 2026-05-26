export default function TrustCenterPage() {
	return (
		<main className="min-h-screen bg-[#F7F4EE] text-[#1F2937] p-8">
			<div className="max-w-4xl mx-auto space-y-8">

				<header className="space-y-4">
					<h1 className="text-5xl font-bold">
						Trust Center
					</h1>

					<p className="text-xl leading-relaxed text-gray-700">
						MyMentalHealthBuddy exists to support emotional awareness,
						reflection, calm, and conscious growth — not manipulation,
						addiction, coercion, or emotional exploitation.
					</p>
				</header>

				<section className="space-y-4">
					<h2 className="text-3xl font-semibold">
						What Lumi Is
					</h2>

					<ul className="list-disc pl-6 space-y-2">
						<li>A reflective AI wellness companion</li>
						<li>A journaling and emotional-awareness assistant</li>
						<li>A calming and supportive conversational system</li>
						<li>A transparency-first AI interface</li>
					</ul>
				</section>

				<section className="space-y-4">
					<h2 className="text-3xl font-semibold">
						What Lumi Is NOT
					</h2>

					<ul className="list-disc pl-6 space-y-2">
						<li>Not a therapist</li>
						<li>Not a doctor</li>
						<li>Not emergency support</li>
						<li>Not a replacement for licensed care</li>
						<li>Not designed to manipulate emotions for engagement</li>
					</ul>
				</section>

				<section className="space-y-4">
					<h2 className="text-3xl font-semibold">
						Our Commitments
					</h2>

					<ul className="list-disc pl-6 space-y-2">
						<li>No emotional-state monetization</li>
						<li>No dark patterns</li>
						<li>No shame-based retention</li>
						<li>No hidden AI manipulation</li>
						<li>No vulnerability targeting</li>
					</ul>
				</section>

			</div>
		</main>
	);
}