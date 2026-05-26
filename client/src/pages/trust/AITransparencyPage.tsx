export default function AITransparencyPage() {
	return (
		<main className="min-h-screen bg-[#F7F4EE] p-8">
			<div className="max-w-4xl mx-auto space-y-8">

				<h1 className="text-5xl font-bold">
					AI Transparency
				</h1>

				<p className="text-lg leading-relaxed">
					We believe conscious technology must remain understandable,
					visible, ethical, and accountable.
				</p>

				<div className="space-y-4">
					<h2 className="text-2xl font-semibold">
						How AI Is Used
					</h2>

					<ul className="list-disc pl-6 space-y-2">
						<li>Conversation assistance</li>
						<li>Reflection prompts</li>
						<li>Emotional awareness support</li>
						<li>Journaling guidance</li>
					</ul>
				</div>

				<div className="space-y-4">
					<h2 className="text-2xl font-semibold">
						What AI Cannot Do
					</h2>

					<ul className="list-disc pl-6 space-y-2">
						<li>Diagnose conditions</li>
						<li>Provide medical advice</li>
						<li>Replace therapists</li>
						<li>Make emergency decisions</li>
					</ul>
				</div>

			</div>
		</main>
	);
}