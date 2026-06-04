import * as React from "react";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className = "", ...props }: DivProps) {
	return (
		<div
			className={`rounded-2xl border bg-white shadow-sm ${className}`}
			{...props}
		/>
	);
}

export function CardHeader({ className = "", ...props }: DivProps) {
	return (
		<div
			className={`flex flex-col space-y-1.5 p-6 ${className}`}
			{...props}
		/>
	);
}

export function CardTitle({ className = "", ...props }: DivProps) {
	return (
		<h3
			className={`text-lg font-semibold leading-none tracking-tight ${className}`}
			{...props}
		/>
	);
}

export function CardDescription({ className = "", ...props }: DivProps) {
	return (
		<p
			className={`text-sm text-gray-500 ${className}`}
			{...props}
		/>
	);
}

export function CardContent({ className = "", ...props }: DivProps) {
	return (
		<div className={`p-6 pt-0 ${className}`} {...props} />
	);
}

export function CardFooter({ className = "", ...props }: DivProps) {
	return (
		<div
			className={`flex items-center p-6 pt-0 ${className}`}
			{...props}
		/>
	);
}

export function CardGrid({
	className = "",
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${className}`}
			{...props}
		/>
	);
}

export function CardWrapper({
	className = "",
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={`max-w-2xl mx-auto ${className}`}
			{...props}
		/>
	);
}
