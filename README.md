# 🌿 Satva: AI-Powered Student Wellness Platform

**Balance your energy, elevate your mind.**

Satva is a student-centric mental wellness platform that blends ancient yogic wisdom with modern emotional analytics. It provides a safe, anonymous space for students to log their mood and journal entries, receiving instant, AI-driven feedback on their energetic state through the lens of the seven chakras. The platform also offers tools for educators to understand student well-being at an aggregate level without compromising individual privacy.

*(Image below is a representative mockup of the application's UI)*

---

## ✨ Key Features

- **AI-Powered Chakra Analysis**: Students log their daily mood and journal entries to receive a real-time analysis of their seven chakras, identifying potential blockages or overactivity.  
- **Dynamic & Engaging UI**: Features animated video backgrounds for each chakra, creating a visually rich and immersive experience.  
- **Personalized Recommendations**: The AI provides actionable, supportive recommendations tailored to the user's current energetic state.  
- **Real-time Voice Conversations**: A live chat feature allows students to have spoken conversations with an AI wellness assistant, with real-time transcription.  
- **AI Wellness Chatbot**: A text-based AI assistant, knowledgeable about chakras and mindfulness, provides contextual support based on the user's location within the app.  
- **Mindfulness Tools**: Includes a guided breathing exercise module and a library of AI-generated *Wisdom Shorts* (short audio talks) for quick relief and inspiration.  
- **Anonymous Feedback Portal**: Students can anonymously submit feedback to educators, fostering open communication.  
- **Educator Dashboard**: Provides a high-level, anonymized overview of student well-being trends, helping educators identify patterns and offer collective support.  
- **Ambient Soundscape**: A calming, yogic soundscape plays in the background to create a relaxing environment.  

---

## 🛠️ Tech Stack

### Frontend
- React & TypeScript  
- Tailwind CSS for styling  
- Recharts for data visualization  

### Backend
- Node.js & Express.js  

### Database
- MongoDB (with Mongoose) – Optional for basic functionality, required for data persistence  

### AI & Services
- **Google Gemini API**  
  - `gemini-2.5-flash`: For text generation, function calling, and the core chakra analysis  
  - `gemini-2.5-flash-preview-tts`: For Text-to-Speech generation in the *Wisdom Shorts* feature  
  - `gemini-2.5-flash-native-audio-preview-09-2025`: Powers the real-time voice conversations  

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js and npm**: [Download Node.js](https://nodejs.org/) (npm is included)  
- **Google Gemini API Key**: Get a free key from [Google AI Studio](https://ai.google.dev/)  
- **MongoDB Atlas Account (Optional)**: Create a free account and cluster on [MongoDB Atlas](https://www.mongodb.com/atlas)  

---

## 🚀 Installation & Setup

Follow these steps to get your local development environment running:

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/satva-app.git
cd satva-app

Install Frontend Dependencies
The frontend dependencies are managed by the development environment. No npm install is needed in the root directory.

3. Install Backend Dependencies
Navigate to the backend directory and install the required packages:

bash
cd backend
npm install
4. Configure Backend Environment Variables
This is the most important step. Your API keys and secrets must be configured correctly.

In the backend directory, you will find a file named .env.example. Create a copy of this file and rename it to .env. Open the new .env file and add your secret keys:

env
# backend/.env

# REQUIRED: Your Google Gemini API Key
GEMINI_API_KEY="your_google_gemini_api_key_here"

# OPTIONAL: Your MongoDB Atlas connection string
# The server will run without this, but won't save data.
MONGO_URI="your_mongodb_atlas_connection_string_here"
⚠️ Security Note: The .env file contains sensitive information. It is already included in .gitignore to prevent accidental commits.

▶️ Running the Application
The Satva application consists of two parts: the frontend and the backend. You will need to run them in two separate terminals.

Terminal 1: Start the Backend Server
bash
cd backend
npm start
You should see:

Code
Backend server is running on http://localhost:5001
Leave this terminal running.

Terminal 2: Run the Frontend
Open a new terminal and navigate to the project’s root directory (satva-app). The frontend development server should start automatically. If it doesn’t, refresh the browser page.

🌐 Accessing the Application
Once both servers are running, open your browser and log in. You can use the mood tracker to get a live chakra analysis powered by the backend.

📜 License
This project is licensed under the MIT License – see the LICENSE file for details.

💡 Future Enhancements
Integration with wearable devices for biometric data

Expanded educator dashboard with predictive analytics

Gamified wellness challenges for students

🙏 Acknowledgements
Inspired by yogic philosophy and chakra systems
Designed to support student well-being with privacy-first principles
