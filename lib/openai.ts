import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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

Please provide a detailed response in the following JSON format:

{
  "motivationalMessage": "A personalized motivational message for the user",
  "workoutPlan": {
    "overview": "Brief overview of the workout plan",
    "weeklySchedule": [
      {
        "day": "Monday",
        "focus": "Chest and Triceps",
        "exercises": [
          {
            "name": "Barbell Bench Press",
            "sets": 4,
            "reps": "8-12",
            "rest": "90 seconds",
            "notes": "Focus on controlled movement"
          }
        ]
      }
    ],
    "tips": ["Tip 1", "Tip 2"]
  },
  "dietPlan": {
    "overview": "Brief overview of the diet plan",
    "dailyCalories": 2200,
    "macros": {
      "protein": "30%",
      "carbs": "40%",
      "fats": "30%"
    },
    "meals": [
      {
        "type": "Breakfast",
        "time": "7:00 AM",
        "items": [
          {
            "name": "Oatmeal with Berries",
            "calories": 350,
            "protein": "12g",
            "description": "Steel-cut oats with mixed berries and honey"
          }
        ]
      }
    ],
    "hydration": "Drink at least 3-4 liters of water daily",
    "supplements": ["Whey Protein", "Multivitamin"]
  },
  "lifestyleTips": [
    "Get 7-8 hours of sleep",
    "Manage stress through meditation"
  ],
  "progressTracking": {
    "weeklyGoals": ["Goal 1", "Goal 2"],
    "measurements": ["Weight", "Body Fat %", "Muscle Mass"]
  }
}

Make sure the plan is realistic, achievable, and tailored to their specific needs and goals.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content:
            "You are an expert fitness coach and nutritionist who creates personalized, evidence-based workout and diet plans. Always respond with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response || "{}");
  } catch (error) {
    console.error("Error generating fitness plan:", error);
    throw new Error("Failed to generate fitness plan");
  }
}

export async function generateMotivationalQuote() {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a motivational fitness coach. Generate an inspiring, short motivational quote about fitness, health, or personal growth.",
        },
        {
          role: "user",
          content: "Give me a motivational quote for today.",
        },
      ],
      temperature: 0.8,
      max_tokens: 100,
    });

    return completion.choices[0].message.content?.trim() || "";
  } catch (error) {
    console.error("Error generating quote:", error);
    return "Every workout brings you one step closer to your goal!";
  }
}

export async function generateExerciseImage(exerciseName: string) {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `A realistic, professional photograph of a person performing ${exerciseName} exercise in a gym setting. High quality, proper form demonstration, motivational lighting.`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    return response.data[0].url;
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate exercise image");
  }
}

export async function generateMealImage(mealName: string) {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `A professional, appetizing photograph of ${mealName}. High quality food photography, well-plated, vibrant colors, natural lighting.`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    return response.data[0].url;
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate meal image");
  }
}

export default openai;