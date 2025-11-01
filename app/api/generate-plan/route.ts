import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("API route hit");
    
    const userData = await request.json();
    console.log("Received data:", userData);

    // Validate required fields
    const requiredFields = ['name', 'age', 'height', 'weight', 'gender', 'fitnessGoal', 'fitnessLevel', 'workoutLocation', 'dietaryPreference'];
    const missingFields = requiredFields.filter(field => !userData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Generate structured plan
    const plan = generateStructuredPlan(userData);
    
    console.log("Plan generated successfully");
    return NextResponse.json({ success: true, plan });
    
  } catch (error: any) {
    console.error("API Error:", error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error.message || "Failed to generate plan",
      },
      { status: 500 }
    );
  }
}

// Generate structured plan that matches PlanView expectations
function generateStructuredPlan(userData: any) {
  const calorieTarget = userData.fitnessGoal === 'weight_loss' ? '1800-2000' : 
                        userData.fitnessGoal === 'muscle_gain' ? '2800-3000' : '2200-2400';

  return {
    overview: {
      name: userData.name,
      age: userData.age,
      height: userData.height,
      weight: userData.weight,
      goal: userData.fitnessGoal,
      level: userData.fitnessLevel,
      bmi: calculateBMI(userData.weight, userData.height),
      calorieTarget: calorieTarget,
      summary: `This personalized plan is designed for your ${userData.fitnessLevel} fitness level to help you achieve your ${userData.fitnessGoal} goal.`
    },
    
    workoutPlan: {
      monday: {
        focus: "Upper Body - Chest & Triceps",
        exercises: [
          { name: "Bench Press", sets: 4, reps: "8-10", rest: "90s" },
          { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", rest: "60s" },
          { name: "Tricep Dips", sets: 3, reps: "12-15", rest: "60s" },
          { name: "Cable Flyes", sets: 3, reps: "12-15", rest: "60s" },
          { name: "Tricep Pushdowns", sets: 3, reps: "15-20", rest: "45s" }
        ]
      },
      tuesday: {
        focus: "Lower Body - Legs & Glutes",
        exercises: [
          { name: "Squats", sets: 4, reps: "10-12", rest: "90s" },
          { name: "Romanian Deadlifts", sets: 4, reps: "10-12", rest: "90s" },
          { name: "Leg Press", sets: 3, reps: "12-15", rest: "60s" },
          { name: "Walking Lunges", sets: 3, reps: "12 per leg", rest: "60s" },
          { name: "Calf Raises", sets: 4, reps: "15-20", rest: "45s" }
        ]
      },
      wednesday: {
        focus: "Cardio & Core",
        exercises: [
          { name: "Running/Cycling", sets: 1, reps: "30 minutes", rest: "-" },
          { name: "Plank", sets: 3, reps: "60 seconds", rest: "60s" },
          { name: "Russian Twists", sets: 3, reps: "20 per side", rest: "45s" },
          { name: "Leg Raises", sets: 3, reps: "15-20", rest: "45s" },
          { name: "Mountain Climbers", sets: 3, reps: "30 seconds", rest: "45s" }
        ]
      },
      thursday: {
        focus: "Upper Body - Back & Biceps",
        exercises: [
          { name: "Pull-ups", sets: 4, reps: "8-10", rest: "90s" },
          { name: "Barbell Rows", sets: 4, reps: "8-10", rest: "90s" },
          { name: "Lat Pulldowns", sets: 3, reps: "12-15", rest: "60s" },
          { name: "Dumbbell Curls", sets: 3, reps: "12-15", rest: "60s" },
          { name: "Hammer Curls", sets: 3, reps: "12-15", rest: "45s" }
        ]
      },
      friday: {
        focus: "Shoulders & Abs",
        exercises: [
          { name: "Military Press", sets: 4, reps: "8-10", rest: "90s" },
          { name: "Lateral Raises", sets: 3, reps: "12-15", rest: "60s" },
          { name: "Front Raises", sets: 3, reps: "12-15", rest: "60s" },
          { name: "Face Pulls", sets: 3, reps: "15-20", rest: "45s" },
          { name: "Cable Crunches", sets: 4, reps: "15-20", rest: "45s" }
        ]
      },
      saturday: {
        focus: "HIIT / Active Recovery",
        exercises: [
          { name: "HIIT Cardio", sets: 1, reps: "20 minutes", rest: "-" },
          { name: "Burpees", sets: 3, reps: "15", rest: "60s" },
          { name: "Jump Squats", sets: 3, reps: "15", rest: "60s" },
          { name: "Stretching", sets: 1, reps: "15 minutes", rest: "-" }
        ]
      },
      sunday: {
        focus: "Rest Day",
        exercises: [
          { name: "Light Walking", sets: 1, reps: "20-30 minutes", rest: "-" },
          { name: "Mobility Work", sets: 1, reps: "15 minutes", rest: "-" },
          { name: "Foam Rolling", sets: 1, reps: "10 minutes", rest: "-" }
        ]
      }
    },

    dietPlan: {
      breakfast: getDietMeal("breakfast", userData.dietaryPreference),
      midMorningSnack: getDietMeal("snack", userData.dietaryPreference),
      lunch: getDietMeal("lunch", userData.dietaryPreference),
      afternoonSnack: getDietMeal("snack", userData.dietaryPreference),
      dinner: getDietMeal("dinner", userData.dietaryPreference),
      eveningSnack: getDietMeal("evening", userData.dietaryPreference),
      hydration: "Drink 3-4 liters of water daily. Increase during workouts.",
      supplements: [
        "Whey Protein (post-workout)",
        "Multivitamin (morning)",
        "Omega-3 Fish Oil (with meals)",
        "Creatine Monohydrate (5g daily)"
      ]
    },

    tips: [
      "Get 7-8 hours of quality sleep every night",
      "Stretch for 10-15 minutes after each workout",
      "Progressive overload: gradually increase weights",
      "Track your workouts and progress weekly",
      userData.stressLevel === 'high' ? "Practice stress management techniques like meditation" : "Stay consistent with your routine",
      "Listen to your body and take extra rest if needed",
      "Meal prep on weekends to stay on track",
      "Take progress photos every 2 weeks"
    ],

    notes: `This plan is customized for your ${userData.workoutLocation} workouts. ${userData.medicalHistory ? `Note: ${userData.medicalHistory}` : ''}`
  };
}

function getDietMeal(mealType: string, preference: string) {
  const meals: any = {
    breakfast: {
      vegetarian: {
        name: "Veggie Power Breakfast",
        items: ["Oatmeal with berries and nuts", "Scrambled eggs (2 whole)", "Greek yogurt", "Green tea"],
        calories: "450-500",
        protein: "25g"
      },
      vegan: {
        name: "Plant Power Morning",
        items: ["Smoothie bowl with plant protein", "Banana and chia seeds", "Almond butter toast", "Green tea"],
        calories: "450-500",
        protein: "20g"
      },
      non_vegetarian: {
        name: "Protein Packed Breakfast",
        items: ["Scrambled eggs (3 eggs)", "Whole grain toast", "Turkey bacon", "Fruit salad", "Coffee"],
        calories: "500-550",
        protein: "30g"
      }
    },
    lunch: {
      vegetarian: {
        name: "Veggie Bowl",
        items: ["Quinoa bowl with chickpeas", "Mixed vegetables", "Tahini dressing", "Side salad"],
        calories: "600-650",
        protein: "25g"
      },
      vegan: {
        name: "Plant-Based Power Bowl",
        items: ["Lentil curry with brown rice", "Steamed vegetables", "Mixed nuts", "Green salad"],
        calories: "600-650",
        protein: "22g"
      },
      non_vegetarian: {
        name: "Lean Protein Lunch",
        items: ["Grilled chicken breast (200g)", "Sweet potato", "Broccoli and carrots", "Mixed greens"],
        calories: "650-700",
        protein: "40g"
      }
    },
    dinner: {
      vegetarian: {
        name: "Balanced Veggie Dinner",
        items: ["Paneer tikka", "Quinoa", "Roasted vegetables", "Cucumber salad"],
        calories: "550-600",
        protein: "28g"
      },
      vegan: {
        name: "Plant-Based Dinner",
        items: ["Tofu stir-fry", "Brown rice", "Mixed vegetables", "Side salad"],
        calories: "550-600",
        protein: "25g"
      },
      non_vegetarian: {
        name: "Protein Rich Dinner",
        items: ["Grilled salmon (180g)", "Quinoa", "Asparagus", "Mixed vegetables"],
        calories: "600-650",
        protein: "45g"
      }
    },
    snack: {
      vegetarian: { name: "Healthy Snack", items: ["Mixed nuts", "Apple", "Protein shake"], calories: "200-250", protein: "15g" },
      vegan: { name: "Plant Snack", items: ["Almonds", "Banana", "Plant protein shake"], calories: "200-250", protein: "12g" },
      non_vegetarian: { name: "Protein Snack", items: ["Greek yogurt", "Berries", "Protein bar"], calories: "200-250", protein: "20g" }
    },
    evening: {
      vegetarian: { name: "Light Evening", items: ["Cottage cheese", "Berries"], calories: "150-200", protein: "12g" },
      vegan: { name: "Plant Evening", items: ["Protein shake", "Handful of nuts"], calories: "150-200", protein: "10g" },
      non_vegetarian: { name: "Casein Shake", items: ["Casein protein shake", "Almonds"], calories: "200-250", protein: "25g" }
    }
  };

  return meals[mealType][preference] || meals[mealType]['non_vegetarian'];
}

function calculateBMI(weight: number, height: number): string {
  const bmi = weight / Math.pow(height / 100, 2);
  return bmi.toFixed(1);
}