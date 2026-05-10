// Simple keyword-based sentiment
colorMode = {
	'happy|great|thanks|amazing': 'yellow',
	'breathe|calm|relax|okay': 'blue',
	'sad|worried|anxious|scared': 'purple',
	'grateful|thankful|appreciate': 'pink',
	'excited|wow|awesome|curious': 'orange',
}[detectedSentiment] || 'default';

pose = aiState === 'typing' ? 'thinking' : aiState === 'celebrating' ? 'celebrating' : 'listening';
