
const express = require('express');
const router = express.Router();
const { GoogleGenAI, Type } = require('@google/genai');
const MoodLog = require('../models/MoodLog'); // Mongoose model

// --- Gemini API Logic (Now on the Backend) ---

const chakraAnalysisSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        status: { type: Type.STRING },
        recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ['name', 'status', 'recommendations'],
    },
};

const analyzeOnBackend = async (moodLog) => {
  const { mood, journal } = moodLog;
  const prompt = `Analyze the following user mood log to determine the state of their seven chakras. The user's mood is on a scale of 0-100 (0=very unwell, 100=very well). A journal entry is also provided. Based on this input, evaluate each of the seven main chakras (Root, Sacral, Solar Plexus, Heart, Throat, Third Eye, Crown). Determine if its status is 'Balanced', 'Blocked', or 'Overactive'. Provide 2-3 brief, actionable recommendations for any unbalanced chakra, and one reassuring recommendation for balanced ones. Return the analysis for all seven chakras in the specified JSON format.`;
  const fullPrompt = `${prompt}\n\nMood: ${mood}\nJournal Entry: "${journal}"`;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: chakraAnalysisSchema,
      },
    });
    
    const resultText = response.text?.trim();
    if (!resultText) throw new Error("Received empty response from Gemini API");
    
    return JSON.parse(resultText);
  } catch (error) {
    console.error("Error in analyzeOnBackend:", error);
    throw new Error("Failed to get analysis from Gemini API.");
  }
};


// @route   POST /api/moods/analyze
// @desc    Get chakra analysis for a mood log
router.post('/analyze', async (req, res) => {
    try {
        const { mood, journal } = req.body;
        
        // 1. Get analysis from Gemini
        const analysis = await analyzeOnBackend({ mood, journal });

        // 2. (Future Step) Save to database
        // When you have MongoDB connected, you can uncomment this:
        /*
        const newMoodLog = new MoodLog({
            mood,
            journal,
            chakraAnalysis: analysis,
            // user: req.user.id // If you add authentication
        });
        await newMoodLog.save();
        */
        
        // 3. Send the analysis back to the frontend
        res.status(200).json(analysis);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
