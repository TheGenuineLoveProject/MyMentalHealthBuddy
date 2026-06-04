export default function PrimaryButton({
	children,
	href,
	onClick,
	type = "button",
}) {
	const styles =
		"inline-flex items-center justify-center rounded-2xl px-5 py-3 font-medium transition-all duration-200 bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg hover:scale-[1.02] active:scale-[0.98]";

	if (href) {
		return (
			<a href={href} className={styles}>
				{children}
			</a>
		);
	}

	return (
		<button type={type} onClick={onClick} className={styles}>
			{children}
		</button>
	);
}