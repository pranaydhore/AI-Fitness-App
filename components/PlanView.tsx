import { X, Dumbbell, Utensils, Lightbulb, Save, Download, User } from "lucide-react";
import "./PlanView.css";

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
}

interface DayPlan {
  focus: string;
  exercises: Exercise[];
}

interface Meal {
  name: string;
  items: string[];
  calories: string;
  protein: string;
}

interface Plan {
  overview: {
    name: string;
    age: number;
    height: number;
    weight: number;
    goal: string;
    level: string;
    bmi: string;
    calorieTarget: string;
    summary: string;
  };
  workoutPlan: {
    monday: DayPlan;
    tuesday: DayPlan;
    wednesday: DayPlan;
    thursday: DayPlan;
    friday: DayPlan;
    saturday: DayPlan;
    sunday: DayPlan;
  };
  dietPlan: {
    breakfast: Meal;
    midMorningSnack: Meal;
    lunch: Meal;
    afternoonSnack: Meal;
    dinner: Meal;
    eveningSnack: Meal;
    hydration: string;
    supplements: string[];
  };
  tips: string[];
  notes: string;
}

interface PlanViewProps {
  plan: Plan;
  userData: any;
  onClose: () => void;
}

export default function PlanView({ plan, userData, onClose }: PlanViewProps) {
  if (!plan || !plan.overview) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Error</h2>
            <button onClick={onClose} className="modal-close-btn">
              <X size={24} />
            </button>
          </div>
          <div className="modal-body">
            <p>Unable to load plan. Please try generating again.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleSavePlan = () => {
    // You can implement saving to localStorage or your backend here
    console.log("Saving plan...", plan);
    alert("Plan saved successfully!");
  };

  const handleDownloadPlan = () => {
    const planText = `
FITNESS PLAN FOR ${plan.overview.name}
=====================================

OVERVIEW
--------
Age: ${plan.overview.age}
Height: ${plan.overview.height}cm
Weight: ${plan.overview.weight}kg
BMI: ${plan.overview.bmi}
Goal: ${plan.overview.goal}
Level: ${plan.overview.level}
Daily Calories: ${plan.overview.calorieTarget}

${plan.overview.summary}

WORKOUT PLAN
------------
${Object.entries(plan.workoutPlan).map(([day, dayPlan]) => `
${day.toUpperCase()}
${dayPlan.focus}
${dayPlan.exercises.map(ex => `- ${ex.name}: ${ex.sets} sets x ${ex.reps} reps (Rest: ${ex.rest})`).join('\n')}
`).join('\n')}

DIET PLAN
---------
Breakfast: ${plan.dietPlan.breakfast.name}
${plan.dietPlan.breakfast.items.map(item => `- ${item}`).join('\n')}
Calories: ${plan.dietPlan.breakfast.calories} | Protein: ${plan.dietPlan.breakfast.protein}

Lunch: ${plan.dietPlan.lunch.name}
${plan.dietPlan.lunch.items.map(item => `- ${item}`).join('\n')}
Calories: ${plan.dietPlan.lunch.calories} | Protein: ${plan.dietPlan.lunch.protein}

Dinner: ${plan.dietPlan.dinner.name}
${plan.dietPlan.dinner.items.map(item => `- ${item}`).join('\n')}
Calories: ${plan.dietPlan.dinner.calories} | Protein: ${plan.dietPlan.dinner.protein}

HYDRATION
${plan.dietPlan.hydration}

SUPPLEMENTS
${plan.dietPlan.supplements.map(sup => `- ${sup}`).join('\n')}

TIPS
----
${plan.tips.map((tip, i) => `${i + 1}. ${tip}`).join('\n')}

NOTES
-----
${plan.notes}
    `;

    const blob = new Blob([planText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fitness-plan-${plan.overview.name.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Your Personalized Fitness Plan</h2>
            <p style={{ fontSize: '0.9rem', opacity: 0.9, marginTop: '0.5rem' }}>
              Created for {plan.overview.name}
            </p>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Overview Section */}
          <div className="plan-section">
            <h3 className="plan-section-title">
              <User size={24} />
              Profile Overview
            </h3>
            <div className="plan-content">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="stat-card">
                  <div className="stat-label">Age</div>
                  <div className="stat-value">{plan.overview.age} years</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Height</div>
                  <div className="stat-value">{plan.overview.height} cm</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Weight</div>
                  <div className="stat-value">{plan.overview.weight} kg</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">BMI</div>
                  <div className="stat-value">{plan.overview.bmi}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div className="stat-card">
                  <div className="stat-label">Goal</div>
                  <div className="stat-value" style={{ fontSize: '1rem' }}>
                    {plan.overview.goal.replace(/_/g, ' ')}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Level</div>
                  <div className="stat-value" style={{ fontSize: '1rem' }}>
                    {plan.overview.level}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Daily Calories</div>
                  <div className="stat-value" style={{ fontSize: '1rem' }}>
                    {plan.overview.calorieTarget}
                  </div>
                </div>
              </div>
              <div className="summary-box">
                <p>{plan.overview.summary}</p>
              </div>
            </div>
          </div>

          {/* Workout Plan */}
          <div className="plan-section">
            <h3 className="plan-section-title">
              <Dumbbell size={24} />
              Weekly Workout Plan
            </h3>
            <div className="plan-content">
              {days.map((day) => {
                const dayPlan = plan.workoutPlan[day as keyof typeof plan.workoutPlan];
                return (
                  <div key={day} className="day-plan">
                    <div className="day-header">
                      <h4 className="day-title">{day.charAt(0).toUpperCase() + day.slice(1)}</h4>
                      <span className="day-focus">{dayPlan.focus}</span>
                    </div>
                    <div className="exercise-list">
                      {dayPlan.exercises.map((exercise, idx) => (
                        <div key={idx} className="exercise-item">
                          <div className="exercise-name">{exercise.name}</div>
                          <div className="exercise-details">
                            {exercise.sets} sets × {exercise.reps} reps
                            {exercise.rest !== '-' && <span> · Rest: {exercise.rest}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Diet Plan */}
          <div className="plan-section">
            <h3 className="plan-section-title">
              <Utensils size={24} />
              Nutrition Plan
            </h3>
            <div className="plan-content">
              {/* Meals */}
              {[
                { key: 'breakfast', label: 'Breakfast', time: '7:00 AM' },
                { key: 'midMorningSnack', label: 'Mid-Morning Snack', time: '10:00 AM' },
                { key: 'lunch', label: 'Lunch', time: '1:00 PM' },
                { key: 'afternoonSnack', label: 'Afternoon Snack', time: '4:00 PM' },
                { key: 'dinner', label: 'Dinner', time: '7:00 PM' },
                { key: 'eveningSnack', label: 'Evening Snack', time: '9:00 PM' }
              ].map(({ key, label, time }) => {
                const meal = plan.dietPlan[key as keyof typeof plan.dietPlan] as Meal;
                return (
                  <div key={key} className="meal-card">
                    <div className="meal-header">
                      <h4 className="meal-title">{label}</h4>
                      <span className="meal-time">{time}</span>
                    </div>
                    <div className="meal-name">{meal.name}</div>
                    <ul className="meal-items">
                      {meal.items.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                    <div className="meal-macros">
                      <span className="macro-badge">📊 {meal.calories} cal</span>
                      <span className="macro-badge">💪 {meal.protein} protein</span>
                    </div>
                  </div>
                );
              })}

              {/* Hydration & Supplements */}
              <div className="info-box" style={{ marginTop: '1.5rem' }}>
                <h4 style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#667eea' }}>💧 Hydration</h4>
                <p>{plan.dietPlan.hydration}</p>
              </div>

              <div className="info-box" style={{ marginTop: '1rem' }}>
                <h4 style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#667eea' }}>💊 Supplements</h4>
                <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
                  {plan.dietPlan.supplements.map((supplement, idx) => (
                    <li key={idx}>{supplement}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="plan-section">
            <h3 className="plan-section-title">
              <Lightbulb size={24} />
              Tips & Recommendations
            </h3>
            <div className="plan-content">
              <div className="tips-grid">
                {plan.tips.map((tip, idx) => (
                  <div key={idx} className="tip-card">
                    <div className="tip-number">{idx + 1}</div>
                    <div className="tip-text">{tip}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          {plan.notes && (
            <div className="notes-box">
              <strong>📝 Important Notes:</strong> {plan.notes}
            </div>
          )}

          {/* Action Buttons */}
          <div className="action-buttons">
            <button onClick={handleSavePlan} className="action-btn save-btn">
              <Save size={20} />
              Save Plan
            </button>
            <button onClick={handleDownloadPlan} className="action-btn download-btn">
              <Download size={20} />
              Download
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: fadeIn 0.3s ease;
        }

        .modal-content {
          background: white;
          border-radius: 1.5rem;
          max-width: 1100px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s ease;
        }

        .modal-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem;
          border-radius: 1.5rem 1.5rem 0 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .modal-title {
          font-size: 1.75rem;
          font-weight: 700;
          margin: 0;
        }

        .modal-close-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          padding: 0.5rem;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }

        .modal-body {
          padding: 2rem;
        }

        .plan-section {
          margin-bottom: 2.5rem;
        }

        .plan-section-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1.25rem;
          color: #1f2937;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .plan-content {
          background: #f9fafb;
          padding: 1.5rem;
          border-radius: 1rem;
          border: 1px solid #e5e7eb;
        }

        .stat-card {
          background: white;
          padding: 1rem;
          border-radius: 0.75rem;
          text-align: center;
          border: 1px solid #e5e7eb;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #667eea;
        }

        .summary-box {
          background: white;
          padding: 1.25rem;
          border-radius: 0.75rem;
          border-left: 4px solid #667eea;
        }

        .day-plan {
          background: white;
          padding: 1.25rem;
          border-radius: 0.75rem;
          margin-bottom: 1rem;
          border: 1px solid #e5e7eb;
        }

        .day-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #f3f4f6;
        }

        .day-title {
          font-weight: 700;
          color: #667eea;
          margin: 0;
          font-size: 1.125rem;
        }

        .day-focus {
          color: #6b7280;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .exercise-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .exercise-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: #f9fafb;
          border-radius: 0.5rem;
        }

        .exercise-name {
          font-weight: 600;
          color: #1f2937;
        }

        .exercise-details {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .meal-card {
          background: white;
          padding: 1.25rem;
          border-radius: 0.75rem;
          margin-bottom: 1rem;
          border: 1px solid #e5e7eb;
        }

        .meal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .meal-title {
          font-weight: 700;
          color: #1f2937;
          margin: 0;
          font-size: 1.125rem;
        }

        .meal-time {
          color: #667eea;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .meal-name {
          color: #6b7280;
          font-size: 0.9rem;
          margin-bottom: 0.75rem;
          font-weight: 500;
        }

        .meal-items {
          list-style: none;
          padding: 0;
          margin: 0 0 0.75rem 0;
        }

        .meal-items li {
          padding: 0.375rem 0;
          color: #374151;
          font-size: 0.9rem;
        }

        .meal-items li::before {
          content: "✓ ";
          color: #667eea;
          font-weight: bold;
          margin-right: 0.5rem;
        }

        .meal-macros {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .macro-badge {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          color: #667eea;
          padding: 0.375rem 0.875rem;
          border-radius: 9999px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .info-box {
          background: white;
          padding: 1.25rem;
          border-radius: 0.75rem;
          border: 1px solid #e5e7eb;
        }

        .tips-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
        }

        .tip-card {
          background: white;
          padding: 1rem;
          border-radius: 0.75rem;
          display: flex;
          gap: 0.75rem;
          border: 1px solid #e5e7eb;
        }

        .tip-number {
          flex-shrink: 0;
          width: 2rem;
          height: 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.875rem;
        }

        .tip-text {
          color: #374151;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .notes-box {
          background: rgba(102, 126, 234, 0.1);
          border: 2px solid rgba(102, 126, 234, 0.2);
          padding: 1.25rem;
          border-radius: 0.75rem;
          margin-top: 1.5rem;
          color: #374151;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 2px solid #f3f4f6;
        }

        .action-btn {
          flex: 1;
          padding: 1rem 1.5rem;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .save-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .save-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }

        .download-btn {
          background: white;
          color: #667eea;
          border: 2px solid #667eea;
        }

        .download-btn:hover {
          background: #667eea;
          color: white;
          transform: translateY(-2px);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .modal-content {
            margin: 0;
            max-height: 100vh;
            border-radius: 0;
          }

          .modal-header {
            border-radius: 0;
          }

          .modal-body {
            padding: 1.5rem;
          }

          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}