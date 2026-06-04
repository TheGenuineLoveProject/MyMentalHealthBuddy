export default function ContentCredit({
	title,
	author,
	source,
	url,
}) {
	if (!title && !author) return null;

	return (
		<div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-zinc-400">
			<div className="font-medium text-zinc-300">
				Educational Attribution
			</div>

			<div className="mt-2">
				{title && <div>Source: {title}</div>}
				{author && <div>Author: {author}</div>}
				{source && <div>Publisher: {source}</div>}

				{url && (
					<a
						href={url}
						target="_blank"
						rel="noopener noreferrer"
						className="mt-2 inline-block text-sky-400 underline"
					>
						View Original Source
					</a>
				)}
			</div>
		</div>
	);
}