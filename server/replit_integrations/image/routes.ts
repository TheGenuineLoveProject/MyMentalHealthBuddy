import type {
  Express,
  Request,
  Response,
} from "express";

import { openai } from "./client";

export function registerImageRoutes(
  app: Express,
): void {

  app.post(
    "/api/images/generate",
    async (
      req: Request,
      res: Response,
    ) => {
      try {
        const { prompt } = req.body;

        if (!prompt) {
          return res.status(400).json({
            error: "Prompt is required",
          });
        }

        const response =
          await openai.images.generate({
            model: "gpt-image-1",
            prompt,
            size: "1024x1024",
          });

        const imageData =
          response.data?.[0];

        if (!imageData?.b64_json) {
          return res.status(500).json({
            error:
              "No image returned from OpenAI",
          });
        }

        res.json({
          image: imageData.b64_json,
        });

      } catch (error) {

        console.error(
          "Image generation error:",
          error,
        );

        res.status(500).json({
          error:
            "Failed to generate image",
        });
      }
    },
  );
}