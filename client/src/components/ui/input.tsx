import * as React from "react";

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className = "", type = "text", ...props }, ref) => {
		return (
			<input
				type={type}
				className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ${className}`}
				ref={ref}
				{...props}
			/>
		);
	}
);

Input.displayName = "Input";
