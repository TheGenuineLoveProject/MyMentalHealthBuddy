// UpsellModal.jsx — The ONLY confirmed missing component
// Place at: client/src/components/UpsellModal.jsx

import { useState, useEffect } from 'react';

const BENEFITS = [
	'Deeper therapeutic tools',
	'Personalized insights & analytics',
	'Unlimited tool history',
	'Advanced breathing patterns',
	'Priority AI companion responses',
];

export default function UpsellModal({ isOpen, onClose, toolName }) {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (isOpen) { setTimeout(() => setVisible(true), 50); }
		else { setVisible(false); }
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(44,53,49,0.5)', backdropFilter: 'blur(8px)' }}>
			<div className={`bg-[#faf9f7] rounded-2xl max-w-md w-full p-8 shadow-xl transition-all duration-300 ${visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} style={{ border: '1px solid #e4f0e8' }}>

				{/* Header */}
				<div className="text-center mb-6">
					<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#8FBF9F] to-[#D4AF37] flex items-center justify-center">
						<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
							<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
						</svg>
					</div>
					<h2 className="font-serif text-2xl font-medium text-[#3a3a3a] mb-2">Unlock your full potential</h2>
					<p className="text-[#6B7B6E] text-sm">You've completed <strong>{toolName}</strong>. Ready for more?</p>
				</div>

				{/* Benefits */}
				<ul className="space-y-3 mb-6">
					{BENEFITS.map(b => (
						<li key={b} className="flex items-center gap-3 text-sm text-[#3a3a3a]">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8FBF9F" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg>
							{b}
						</li>
					))}
				</ul>

				{/* Pricing */}
				<div className="bg-[#f4f9f6] rounded-xl p-4 mb-6 text-center" style={{ border: '1px solid #c9e1d1' }}>
					<span className="font-serif text-3xl font-medium text-[#2f5d5d]">$9.99</span>
					<span className="text-[#6B7B6E] text-sm ml-2">one-time</span>
					<p className="text-xs text-[#9CA5A0] mt-1">No subscription. No hidden fees.</p>
				</div>

				{/* CTAs */}
				<button className="w-full py-3 rounded-lg font-medium text-white transition-all hover:brightness-105 mb-3" style={{ background: 'linear-gradient(135deg, #2f5d5d, #5a8585)' }}>
					Upgrade to Pro
				</button>
				<button onClick={onClose} className="w-full py-3 rounded-lg text-sm text-[#6B7B6E] hover:text-[#3a3a3a] transition-colors">
					Continue with free tools
				</button>

				{/* Trust */}
				<p className="text-center text-xs text-[#9CA5A0] mt-4">100% of proceeds support free mental health access.</p>
			</div>
		</div>
	);
}
