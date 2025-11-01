// utils/openai.ts
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!, // Ensure your .env file has this key
});

export interface UserData {
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  fitnessGoal: string;
  fitnessLevel: string;
  workoutLocation: string;
  dietaryPreference: string;
  medicalHistory?: string;
  stressLevel?: string;
}

export async function generateFitnessPlan(userData: UserData) {
  const prompt = `You are an expert fitness coach and nutritionist. Create a comprehensive, personalized fitness and diet plan based on the following user information:

Name: ${userData.name}
Age: ${userData.age}
Gender: ${userData.gender}
Height: ${userData.height} cm
Weight: ${userData.weight} kg
Fitness Goal: ${userData.fitnessGoal}
Current Fitness Level: ${userData.fitnessLevel}
Workout Location: ${userData.workoutLocation}
Dietary Preference: ${userData.dietaryPreference}
${userData.medicalHistory ? `Medical History: ${userData.medicalHistory}` : ""}
${userData.stressLevel ? `Stress Level: ${userData.stressLevel}` : ""}

Provide a structured JSON with:
{
  "motivationalMessage": "",
  "workoutPlan": {
    "overview": "",
    "weeklySchedule": [],
    "tips": []
  },
  "dietPlan": {
    "overview": "",
    "dailyCalories": 0,
    "macros": {},
    "meals": [],
    "hydration": "",
    "supplements": []
  },
  "lifestyleTips": [],
  "progressTracking": {}
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content:
            "You are an expert AI fitness coach and nutritionist. Always return valid JSON format as response.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0].message?.content || "{}";
    return JSON.parse(responseText);
  } catch (error: any) {
    console.error("Error generating fitness plan:", error);
    throw new Error("Failed to generate fitness plan");
  }
}

export async function generateMotivationalQuote() {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content:
            "You are a motivational fitness coach. Generate a short inspiring quote about health and personal growth.",
        },
        { role: "user", content: "Give me a motivational quote for today." },
      ],
      temperature: 0.8,
      max_tokens: 50,
    });

    return completion.choices[0].message?.content?.trim() || "Stay strong and consistent!";
  } catch (error) {
    console.error("Error generating motivational quote:", error);
    return "Consistency is the key to transformation!";
  }
}

export async function generateExerciseImage(exerciseName: string) {
  try {
    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt: `High-quality, realistic image of a person performing ${exerciseName} in a gym setting. Proper form, professional lighting.`,
      size: "1024x1024",
    });
    return response.data[0].url;
  } catch (error) {
    console.error("Error generating exercise image:", error);
    return null;
  }
}

export async function generateMealImage(mealName: string) {
  try {
    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt: `Professional, appetizing photograph of ${mealName}. Bright lighting, clean background, vibrant presentation.`,
      size: "1024x1024",
    });
    return response.data[0].url;
  } catch (error) {
    console.error("Error generating meal image:", error);
    return null;
  }
}

export default openai;
