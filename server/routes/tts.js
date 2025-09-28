import { Router } from 'express';
import { OpenAI } from '../lib/openai-mock';
import { z } from 'zod';
import { optionalAuthenticateToken } from '../auth/jwt';
import { asyncHandler, ValidationError } from '../middleware/errorHandler';
const router = Router();
// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
}) : null;
// Request validation schema
const ttsRequestSchema = z.object({
    text: z.string().min(1).max(4096),
    voice: z.enum(['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']).optional().default('alloy'),
    speed: z.number().min(0.25).max(4.0).optional().default(1.0),
    model: z.enum(['tts-1', 'tts-1-hd']).optional().default('tts-1')
});
// Generate TTS audio
router.post('/generate', optionalAuthenticateToken, asyncHandler(async (req, res) => {
    const validation = ttsRequestSchema.safeParse(req.body);
    if (!validation.success) {
        throw new ValidationError(validation.error.issues.map((e) => e.message).join(', '));
    }
    const { text, voice, speed, model } = validation.data;
    if (!openai) {
        throw new ValidationError('TTS service is not configured. Please configure OpenAI API key.');
    }
    try {
        // Generate speech using OpenAI TTS
        const mp3 = await openai.audio.speech.create({
            model: model,
            voice: voice,
            input: text,
            speed: speed
        });
        // Convert response to buffer
        const buffer = Buffer.from(await mp3.arrayBuffer());
        // Set appropriate headers for audio response
        res.set({
            'Content-Type': 'audio/mpeg',
            'Content-Length': buffer.length.toString(),
            'Cache-Control': 'no-cache'
        });
        res.send(buffer);
    }
    catch (error) {
        console.error('TTS generation error:', error);
        if (error.response?.status === 401) {
            throw new ValidationError('Invalid OpenAI API key');
        }
        else if (error.response?.status === 429) {
            throw new ValidationError('Rate limit exceeded. Please try again later.');
        }
        else {
            throw new ValidationError('Failed to generate speech. Please try again.');
        }
    }
}));
// Stream TTS audio for real-time playback
router.post('/stream', optionalAuthenticateToken, asyncHandler(async (req, res) => {
    const validation = ttsRequestSchema.safeParse(req.body);
    if (!validation.success) {
        throw new ValidationError(validation.error.issues.map((e) => e.message).join(', '));
    }
    const { text, voice, speed, model } = validation.data;
    if (!openai) {
        throw new ValidationError('TTS service is not configured. Please configure OpenAI API key.');
    }
    try {
        // Generate speech using OpenAI TTS with streaming
        const mp3Stream = await openai.audio.speech.create({
            model: model,
            voice: voice,
            input: text,
            speed: speed,
            response_format: 'mp3'
        });
        // Set headers for streaming audio
        res.set({
            'Content-Type': 'audio/mpeg',
            'Transfer-Encoding': 'chunked',
            'Cache-Control': 'no-cache',
            'X-Content-Type-Options': 'nosniff'
        });
        // Get the readable stream from the response
        const stream = mp3Stream.body;
        if (!stream) {
            throw new Error('Failed to get stream');
        }
        // Pipe the stream directly to the response
        const nodeStream = stream;
        nodeStream.pipe(res);
    }
    catch (error) {
        console.error('TTS streaming error:', error);
        if (error.response?.status === 401) {
            throw new ValidationError('Invalid OpenAI API key');
        }
        else if (error.response?.status === 429) {
            throw new ValidationError('Rate limit exceeded. Please try again later.');
        }
        else {
            throw new ValidationError('Failed to stream speech. Please try again.');
        }
    }
}));
// Get available voices
router.get('/voices', (req, res) => {
    res.json({
        success: true,
        voices: [
            { id: 'alloy', name: 'Alloy', description: 'Neutral and balanced' },
            { id: 'echo', name: 'Echo', description: 'Warm and conversational' },
            { id: 'fable', name: 'Fable', description: 'Expressive and dynamic' },
            { id: 'onyx', name: 'Onyx', description: 'Deep and authoritative' },
            { id: 'nova', name: 'Nova', description: 'Energetic and bright' },
            { id: 'shimmer', name: 'Shimmer', description: 'Soft and gentle' }
        ]
    });
});
// Preview a voice with sample text
router.post('/preview', asyncHandler(async (req, res) => {
    const { voice = 'alloy' } = req.body;
    const sampleText = "Hello! This is how I sound. I'm here to help you with your mental health journey.";
    if (!openai) {
        throw new ValidationError('TTS service is not configured');
    }
    try {
        const mp3 = await openai.audio.speech.create({
            model: 'tts-1',
            voice: voice,
            input: sampleText,
            speed: 1.0
        });
        const buffer = Buffer.from(await mp3.arrayBuffer());
        res.set({
            'Content-Type': 'audio/mpeg',
            'Content-Length': buffer.length.toString(),
            'Cache-Control': 'max-age=3600'
        });
        res.send(buffer);
    }
    catch (error) {
        console.error('TTS preview error:', error);
        throw new ValidationError('Failed to generate preview');
    }
}));
// Legacy route for compatibility
router.post('/tts', asyncHandler(async (req, res) => {
    const { text } = req.body;
    if (!text) {
        throw new ValidationError('Text is required');
    }
    if (!openai) {
        throw new ValidationError('TTS service is not configured');
    }
    try {
        const mp3 = await openai.audio.speech.create({
            model: 'tts-1',
            voice: 'alloy',
            input: text
        });
        const buffer = Buffer.from(await mp3.arrayBuffer());
        res.set({
            'Content-Type': 'audio/mpeg',
            'Content-Length': buffer.length.toString()
        });
        res.send(buffer);
    }
    catch (error) {
        console.error('TTS error:', error);
        res.status(500).send('TTS failed');
    }
}));
export default router;
