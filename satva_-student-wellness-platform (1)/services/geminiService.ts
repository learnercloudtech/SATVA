
// Fix: Replaced mock API service with a real Gemini API implementation for chakra analysis.
import { GoogleGenAI, Type } from "@google/genai";
import { MoodLog, Chakra, ChakraName, ChakraStatus } from '../types';
import { CHAKRAS } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const chakraAnalysisSchema = {
    type: Type.ARRAY,
    description: "An array of 7 chakra analysis objects, one for each chakra.",
    items: {
      type: Type.OBJECT,
      properties: {
        name: {
          type: Type.STRING,
          enum: Object.values(ChakraName),
          description: 'The name of the chakra.'
        },
        status: {
          type: Type.STRING,
          enum: Object.values(ChakraStatus),
          description: 'The current status of the chakra (Balanced, Blocked, or Overactive).'
        },
        recommendations: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
          description: 'A list of 2-3 personalized recommendations to balance this chakra. For balanced chakras, provide one reassuring recommendation.'
        },
      },
      required: ['name', 'status', 'recommendations'],
    },
};


export const analyzeMoodAndChakras = async (moodLog: MoodLog): Promise<Chakra[]> => {
  const { mood, journal } = moodLog;

  const prompt = `
    Analyze the following user mood log to determine the state of their seven chakras.
    The user's mood is on a scale of 0-100, where 0 is very unwell and 100 is very well.
    A journal entry is also provided for more context.
    
    Mood: ${mood}
    Journal Entry: "${journal}"
    
    Based on this input, evaluate each of the seven main chakras: Root, Sacral, Solar Plexus, Heart, Throat, Third Eye, and Crown.
    For each chakra, determine if its status is 'Balanced', 'Blocked', or 'Overactive'.
    Provide 2-3 brief, actionable, and personalized recommendations for any chakra that is not balanced. For balanced chakras, provide one reassuring and positive recommendation.
    
    Return the analysis for all seven chakras in the specified JSON format. Ensure every chakra is included in the response.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: chakraAnalysisSchema,
      },
    });

    const resultText = response.text.trim();
    if (!resultText) {
      throw new Error("Received empty response from Gemini API");
    }
    
    const analysisResults: { name: ChakraName; status: ChakraStatus; recommendations: string[] }[] = JSON.parse(resultText);
    
    if (!Array.isArray(analysisResults) || analysisResults.length === 0) {
        throw new Error("Invalid response format from Gemini API");
    }

    const fullChakraData: Chakra[] = CHAKRAS.map(staticChakra => {
        const analyzedChakra = analysisResults.find(a => a.name === staticChakra.name);
        if (analyzedChakra) {
            return {
                ...staticChakra,
                status: analyzedChakra.status,
                recommendations: analyzedChakra.recommendations,
            };
        }
        return {
            ...staticChakra,
            status: ChakraStatus.Balanced,
            recommendations: ["Analysis could not be completed for this chakra."]
        };
    });

    return fullChakraData;

  } catch (error) {
    console.error("Error analyzing mood with Gemini API:", error);
    const errorState: Chakra[] = CHAKRAS.map(chakra => ({
        ...chakra,
        status: ChakraStatus.Balanced,
        recommendations: ["Sorry, we couldn't analyze your mood right now. Please check your connection and try again."]
    }));
    return errorState;
  }
};


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
                    name: { type: Type.STRING, enum: Object.values(ChakraName) },
                    Blocked: { type: Type.INTEGER, description: "Number of students with a blocked status." },
                    Balanced: { type: Type.INTEGER, description: "Number of students with a balanced status." },
                    Overactive: { type: Type.INTEGER, description: "Number of students with an overactive status." },
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
                    id: { type: Type.STRING, description: "Anonymized student ID, e.g., 'S001'." },
                    name: { type: Type.STRING, description: "A plausible but fictional student name." },
                    avgMood: { type: Type.INTEGER, description: "Average mood score from 0-100, typically below 40 for this list." },
                    flaggedEntries: { type: Type.INTEGER, description: "Number of journal entries flagged for concerning content." },
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
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: educatorDataSchema,
      },
    });

    const resultText = response.text.trim();
    if (!resultText) {
      throw new Error("Received empty response from Gemini API for educator data");
    }
    
    const data = JSON.parse(resultText);
    
    if (!data.chakraStatusData || !data.highStressStudents) {
        throw new Error("Invalid response format from Gemini API for educator data");
    }

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
        // We are not using the response in the UI, but we call the API to simulate a backend process.
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        // Log for debugging purposes
        console.log("Feedback analysis complete:", response.text);
    } catch (error) {
        console.error("Error submitting feedback for analysis:", error);
        // In a real app, we'd have more robust error handling/retry logic.
        // For this simulation, we'll let it fail silently so the user experience isn't interrupted.
    }
};
