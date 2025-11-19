
import { GoogleGenAI, Type, Modality } from "@google/genai";

// Helper to get AI client (lazy initialization)
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// NOTE: analyzeMoodAndChakras has been moved to the backend in `backend/routes/moods.js` for security.

// Schema for educator dashboard data
const educatorDataSchema = {
    type: Type.OBJECT,
    properties: {
        chakraStatusData: {
            type: Type.ARRAY,
            description: "An array of 7 objects, one for each chakra, showing aggregated student status counts.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    Blocked: { type: Type.INTEGER },
                    Balanced: { type: Type.INTEGER },
                    Overactive: { type: Type.INTEGER },
                },
                required: ['name', 'Blocked', 'Balanced', 'Overactive'],
            },
        },
        highStressStudents: {
            type: Type.ARRAY,
            description: "An array of 3-5 students identified as having high stress levels.",
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    avgMood: { type: Type.INTEGER },
                    flaggedEntries: { type: Type.INTEGER },
                },
                required: ['id', 'name', 'avgMood', 'flaggedEntries'],
            },
        },
    },
    required: ['chakraStatusData', 'highStressStudents'],
};

export const getEducatorDashboardData = async (): Promise<{ chakraStatusData: any[], highStressStudents: any[] }> => {
  const prompt = `
    You are a data simulator for a student wellness dashboard called "Satva". 
    Generate a realistic but fictional dataset for an educator's view.
    The data should reflect a student population of about 20-30 students.
    
    Provide the data in the specified JSON format.
    
    1.  **chakraStatusData**: Create an array for all 7 chakras (Root, Sacral, Solar Plexus, Heart, Throat, Third Eye, Crown). For each chakra, provide the number of students whose status is 'Blocked', 'Balanced', or 'Overactive'. The sum of these three statuses for each chakra should be around 20-30.
    2.  **highStressStudents**: Create a list of 4 fictional students who are showing signs of high stress. Give them an anonymized ID, a realistic fictional name, a low average mood score (between 15 and 45), and a number of 'flagged entries' (between 1 and 8).
  `;

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: educatorDataSchema,
      },
    });

    const resultText = response.text?.trim();
    if (!resultText) {
      throw new Error("Received empty response from Gemini API for educator data");
    }
    
    const data = JSON.parse(resultText);
    return data;

  } catch (error) {
    console.error("Error fetching educator dashboard data from Gemini API:", error);
    return { chakraStatusData: [], highStressStudents: [] };
  }
};

export const submitFeedback = async (feedback: string): Promise<void> => {
    const prompt = `
        A student has submitted the following anonymous feedback through the Satva wellness platform for educators.
        Analyze it for key themes, sentiment, and urgency. 
        This analysis will be stored for later review by an educator.

        Feedback: "${feedback}"
    `;
    
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        console.log("Feedback analysis complete:", response.text);
    } catch (error) {
        console.error("Error submitting feedback for analysis:", error);
    }
};

export const generateSpeech = async (text: string, voiceName: string = 'Kore'): Promise<string> => {
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: voiceName },
                    },
                },
            },
        });
        
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error("No audio data received from API");
        }
        return base64Audio;
    } catch (error) {
        console.error("Error generating speech:", error);
        throw error;
    }
};
