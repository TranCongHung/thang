import { GoogleGenAI, Modality, Type } from "@google/genai";
import { PeriodContent, QuizQuestion } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to decode Base64 to ArrayBuffer
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export const generatePeriodContent = async (periodTitle: string, periodYears: string): Promise<PeriodContent> => {
  try {
    const prompt = `
      Bạn là một chuyên gia lịch sử quân sự Việt Nam. Hãy viết nội dung chi tiết về lịch sử Sư đoàn 324 (Đoàn Ngự Bình) trong giai đoạn: "${periodTitle}" (${periodYears}).
      
      Yêu cầu:
      1. Viết một bài thuyết minh hào hùng, chi tiết khoảng 300 từ.
      2. Liệt kê 3-5 sự kiện hoặc chiến công tiêu biểu nhất dưới dạng danh sách ngắn gọn.
      
      Trả về định dạng JSON:
      {
        "fullText": "Nội dung bài thuyết minh...",
        "keyEvents": ["Sự kiện 1", "Sự kiện 2", "Sự kiện 3"]
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fullText: { type: Type.STRING },
            keyEvents: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as PeriodContent;
    }
    throw new Error("No content generated");
  } catch (error) {
    console.error("Error generating history content:", error);
    return {
      fullText: "Hiện tại chưa thể tải dữ liệu lịch sử. Vui lòng thử lại sau.",
      keyEvents: []
    };
  }
};

export const generateQuiz = async (periodTitle: string): Promise<QuizQuestion[]> => {
  try {
    const prompt = `
      Tạo 5 câu hỏi trắc nghiệm kiến thức lịch sử về Sư đoàn 324 trong giai đoạn "${periodTitle}".
      Mỗi câu hỏi có 4 đáp án, 1 đáp án đúng.
      
      Trả về JSON array:
      [
        {
          "question": "Câu hỏi...",
          "options": ["A", "B", "C", "D"],
          "correctAnswer": 0, // index của đáp án đúng (0-3)
          "explanation": "Giải thích ngắn gọn"
        }
      ]
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              correctAnswer: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as QuizQuestion[];
    }
    return [];
  } catch (error) {
    console.error("Error generating quiz:", error);
    return [];
  }
};

export const synthesizeSpeech = async (text: string): Promise<AudioBuffer | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Aoede' }, // Aoede is often good for narration
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) return null;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    
    // Decode manual using the prompt's provided helper style logic if needed, 
    // but AudioContext.decodeAudioData usually requires a complete file format (wav/mp3) OR 
    // for raw PCM we need to handle it manually. 
    // However, Gemini TTS usually returns raw PCM.
    
    // Manual PCM Decoding:
    const audioData = decode(base64Audio);
    const dataInt16 = new Int16Array(audioData.buffer);
    const numChannels = 1;
    const sampleRate = 24000;
    
    const frameCount = dataInt16.length / numChannels;
    const buffer = audioContext.createBuffer(numChannels, frameCount, sampleRate);
    
    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            // Convert Int16 to Float32 [-1.0, 1.0]
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }

    return buffer;

  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};