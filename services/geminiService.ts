import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { TrainingExample } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates content using the standard Gemini Flash model.
 */
export const generateBaseResponse = async (prompt: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Không có phản hồi từ mô hình.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Đã xảy ra lỗi khi gọi Gemini API. Vui lòng kiểm tra API Key.";
  }
};

/**
 * Simulates a fine-tuned model response by injecting the dataset as "Few-Shot" examples
 * into the system instruction or context window. This mimics the behavior of a tuned model
 * for educational purposes without needing a real tuned model ID.
 */
export const generateTunedSimulationResponse = async (
  prompt: string,
  dataset: TrainingExample[]
): Promise<string> => {
  try {
    // Construct a few-shot prompt strategy
    const systemInstruction = `
      Bạn là một mô hình Gemini đã được tinh chỉnh (fine-tuned) dựa trên dữ liệu mẫu sau đây.
      Hãy bắt chước phong cách, giọng điệu và định dạng của các ví dụ Output dựa trên Input tương ứng.
      
      Dữ liệu huấn luyện:
      ${dataset.map(d => `Input: ${d.text_input}\nOutput: ${d.output}`).join('\n---\n')}
      
      Hãy trả lời Input của người dùng theo đúng phong cách trên.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3, // Lower temperature to force adherence to the "tuned" style
      }
    });

    return response.text || "Không có phản hồi từ mô hình mô phỏng.";
  } catch (error) {
    console.error("Gemini Tuned Simulation Error:", error);
    return "Đã xảy ra lỗi khi gọi mô hình mô phỏng.";
  }
};