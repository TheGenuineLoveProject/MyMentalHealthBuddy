import { useState } from "react";
import { sendMessage } from "../lib/api";

export default function QuickStart() {
	const [loading, setLoading] = useState(false);
	const [response, setResponse] = useState<any>(null);

	async function handleClick(message: string) {
		setLoading(true);
		try {
			const data = await sendMessage(message);
			setResponse(data.response);
		} catch (err) {
			console.error(err);
		}
		setLoading(false);
	}

	return (
		<div style={{ maxWidth: 500, margin: "0 auto", padding: 20 }}>

			<h1>Feel better in 60 seconds</h1>
			<p>Start with one small reset.</p>

			<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
				<button onClick={() => handleClick("I feel anxious")}>
					Calm Me Down
				</button>

				<button onClick={() => handleClick("I can't stop overthinking")}>
					Help Me Think Clearly
				</button>

				<button onClick={() => handleClick("I feel overwhelmed")}>
					Understand This Feeling
				</button>
			</div>

			{loading && <p>Loading...</p>}

			{response && (
				<div style={{ marginTop: 20 }}>
					<h3>Response</h3>
					<p>{response.reply}</p>

					{response.tool && (
						<div style={{ marginTop: 10 }}>
							<strong>{response.tool.tool.title}</strong>
							<ul>
								{response.tool.exercise.steps.map((step: string, i: number) => (
									<li key={i}>{step}</li>
								))}
							</ul>
						</div>
					)}
				</div>
			)}
		</div>
	);
}