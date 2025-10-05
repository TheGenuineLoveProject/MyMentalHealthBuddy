import { Router } from "express"
import { z } from "zod"
import { asyncHandler } from "../middleware/errorHandler.js"
import {
  generateCompassionateFallback,
  generateHealingResponse
} from "../openai.js"
import { storage } from "../storage.js"

const router = Router()

// Schema for chat request
const chatSchema = z.object({
  message: z.string().min(1).max(1000),
  sessionId: z.string().optional()
})

// Main chat endpoint
router.post(
  "/chat",
  asyncHandler(async (req, res) => {
    try {
      const validation = chatSchema.safeParse(req.body)
      if (!validation.success) {
        return res.status(400).json({
          error: "Invalid message",
          details: validation.error.errors
        })
      }

      const { message, sessionId } = validation.data
      const userId = req.session?.user?.id || "anonymous"
      const chatSessionId = sessionId || "session-${Date.now()}"

      // Get previous messages for context (if session exists)
      let previousMessages = []
      if (sessionId) {
        try {
          previousMessages = await storage.getHealingMessagesBySessionId(
            sessionId,
            userId
          )
        } catch (error) {
          console.log("Could not fetch previous messages:", error)
        }
      }

      // Generate AI response
      let aiResponse
      try {
        if (!process.env.OPENAI_API_KEY) {
          // Use fallback if OpenAI is not configured
          console.log("OpenAI not configured, using fallback response")
          aiResponse = generateCompassionateFallback(message)
        } else {
          // Build conversation history for context
          const conversationHistory = previousMessages.map((msg) => ({
            role: msg.userMessage ? "user" : "assistant",
            content: msg.userMessage || msg.aiResponse
          }))

          aiResponse = await generateHealingResponse(
            message,
            conversationHistory
          )
        }
      } catch (error) {
        console.error("Error generating AI response:", error)
        aiResponse = generateCompassionateFallback(message)
      }

      // Store the conversation
      try {
        await storage.createHealingMessage({
          userId,
          sessionId: chatSessionId,
          userMessage: message,
          aiResponse: aiResponse,
          emotion: null, // Could be analyzed from message
          sentiment: null,
          tokensUsed: null,
          isHelpful: null,
          tags: []
        })
      } catch (error) {
        console.error("Failed to store message:", error)
        // Continue even if storage fails
      }

      res.json({
        success: true,
        response: aiResponse,
        sessionId: chatSessionId,
        timestamp: new Date().toISOString()
      })
    } catch (error: any) {
      console.error("Chat endpoint error:", error)
      const fallbackResponse = generateCompassionateFallback(
        req.body.message || "
      )
      res.json({
        success: true,
        response: fallbackResponse,
        sessionId: "session-${Date.now()}",
        timestamp: new Date().toISOString()
      })
    }
  })
)

// Get chat history
router.get(
  "/history",
  asyncHandler(async (req, res) => {
    const userId = req.session?.user?.id

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" })
    }

    try {
      const messages = await storage.getHealingMessagesByUserId(userId)
      res.json({
        success: true,
        messages: messages.map((msg) => ({
          id: msg.id,
          sessionId: msg.sessionId,
          userMessage: msg.userMessage,
          aiResponse: msg.aiResponse,
          timestamp: msg.timestamp,
          emotion: msg.emotion,
          isHelpful: msg.isHelpful
        }))
      })
    } catch (error) {
      console.error("Error fetching chat history:", error)
      res.json({ success: true, messages: [] })
    }
  })
)

// Update message feedback
router.post(
  "/feedback/:messageId",
  asyncHandler(async (req, res) => {
    const userId = req.session?.user?.id
    const { messageId } = req.params
    const { isHelpful, feedback } = req.body

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" })
    }

    try {
      await storage.updateHealingMessageFeedback(
        messageId,
        userId,
        isHelpful,
        feedback
      )
      res.json({ success: true, message: "Feedback recorded" })
    } catch (error) {
      console.error("Error recording feedback:", error)
      res.status(500).json({ error: "Failed to record feedback" })
    }
  })
)

// Get available prompts/suggestions
router.get(
  "/prompts",
  asyncHandler(async (req, res) => {
    const prompts = [
      "I'm feeling anxious today",
      "I'm having trouble sleeping",
      "I feel overwhelmed with work",
      "I'm struggling with relationships",
      "I need motivation",
      "I'm feeling sad",
      "I want to talk about stress",
      "I need coping strategies",
      "I'm dealing with change",
      "I want to improve my mood"
    ]

    res.json({
      success: true,
      prompts
    })
  })
)

// Crisis resources endpoint
router.get(
  "/crisis-resources",
  asyncHandler(async (req, res) => {
    res.json({
      success: true,
      resources: [
        {
          name: "988 Suicide & Crisis Lifeline",
          phone: "988",
          description: "24/7 crisis support",
          url: "https://988lifeline.org/"
        },
        {
          name: "Crisis Text Line",
          text: "Text HOME to 741741",
          description: "24/7 text support",
          url: "https://www.crisistextline.org/"
        },
        {
          name: "SAMHSA National Helpline",
          phone: "1-800-662-4357",
          description: "Treatment referral and information",
          url: "https://www.samhsa.gov/find-help/national-helpline"
        },
        {
          name: "National Alliance on Mental Illness (NAMI)",
          phone: "1-800-950-6264",
          description: "Information and support",
          url: "https://www.nami.org/help"
        }
      ]
    })
  })
)

export default router
