import OpenAI from "openai";
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export async function generateImage(prompt: string) {
  const response = await openai.images.generate({
    model: "gpt-image-1",
    prompt,
    size: "1024x1024",
  });
  const base64 =
    response.data?.[0]?.b64_json ?? "";
  return base64;
}
export async function editImage(
  prompt: string,
  image: File,
) {
  const response = await openai.images.edit({
    model: "gpt-image-1",
    prompt,
    image,
  });
  const imageBase64 =
    response.data?.[0]?.b64_json ?? "";
  return imageBase64;
}