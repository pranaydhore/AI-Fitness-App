"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Calendar,
  Ruler,
  Weight,
  Target,
  TrendingUp,
  MapPin,
  Salad,
  Activity,
  Sparkles,
  RefreshCw,
  History,
  Trash2,
} from "lucide-react";
import Header from "@/components/Header";
import AnimatedSelect from "@/components/AnimatedSelect";
import PlanView from "@/components/PlanView";
import { useFitnessStore } from "@/lib/store";
import { cn, calculateBMI, getBMICategory } from "@/lib/utils";

export default function Home() {
  const { currentPlan, setCurrentPlan, savedPlans, deletePlan } = useFitnessStore();
  const [showSavedPlans, setShowSavedPlans] = useState(false);
  const [dailyQuote, setDailyQuote] = useState("");
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    fitnessGoal: "",
    fitnessLevel: "",
    workoutLocation: "",
    dietaryPreference: "",
    medicalHistory: "",
    stressLevel: "",
  });

  useEffect(() => {
    fetchDailyQuote();
  }, []);

  const fetchDailyQuote = async () => {
    setLoadingQuote(true);
    try {
      const response = await fetch("/api/generate-quote");
      const data = await response.json();
      if (data.success) {
        setDailyQuote(data.quote);
      }
    } catch (error) {
      console.error("Error fetching quote:", error);
      setDailyQuote("Every workout is progress. Keep pushing forward! 💪");
    } finally {
      setLoadingQuote(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age),
          height: parseInt(formData.height),
          weight: parseInt(formData.weight),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCurrentPlan({ userData: formData, plan: data.plan });
      } else {
        alert("Failed to generate plan: " + data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const bmi = formData.height && formData.weight 
    ? calculateBMI(parseInt(formData.weight), parseInt(formData.height))
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Daily Quote Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 gradient-primary text-white rounded-2xl shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Daily Motivation
              </h2>
              <motion.button
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
                onClick={fetchDailyQuote}
                disabled={loadingQuote}
                className="p-2 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50"
              >
                <RefreshCw className={cn("w-5 h-5", loadingQuote && "animate-spin")} />
              </motion.button>
            </div>
            <p className="text-lg font-medium">
              {loadingQuote ? "Loading inspiration..." : dailyQuote}
            </p>
          </div>
        </motion.div>

        {/* Saved Plans Button */}
        {savedPlans.length > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowSavedPlans(!showSavedPlans)}
            className="mb-6 flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
          >
            <History className="w-4 h-4" />
            Saved Plans ({savedPlans.length})
          </motion.button>
        )}

        {/* Saved Plans List */}
        <AnimatePresence>
          {showSavedPlans && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 space-y-3"
            >
              {savedPlans.map((plan) => (
                <motion.div
                  key={plan.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="p-4 bg-card border-2 border-border rounded-xl flex items-center justify-between hover:border-primary/50 transition-colors"
                >
                  <div>
                    <p className="font-semibold">{plan.userData.name}'s Plan</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(plan.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPlan({ userData: plan.userData, plan: plan.plan })}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      View
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (confirm("Delete this plan?")) {
                          deletePlan(plan.id);
                        }
                      }}
                      className="p-2 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl shadow-xl p-8 border-2 border-border"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your AI Fitness Journey
            </h1>
            <p className="text-muted-foreground text-lg">
              Get a personalized workout and diet plan tailored just for you
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <User className="w-6 h-6 text-primary" />
                Basic Information
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <User className="w-4 h-4 text-primary" />
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    placeholder="Enter your name"
                    className="w-full rounded-lg border-2 border-input bg-background px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-2"
                >
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Calendar className="w-4 h-4 text-primary" />
                    Age <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    required
                    min="10"
                    max="100"
                    placeholder="Your age"
                    className="w-full rounded-lg border-2 border-input bg-background px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </motion.div>
              </div>

              <AnimatedSelect
                label="Gender"
                value={formData.gender}
                onChange={(value) => handleInputChange("gender", value)}
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
                ]}
                required
                icon={<User className="w-4 h-4 text-primary" />}
              />
            </div>

            {/* Body Metrics */}
            <div className="space-y-4 pt-6 border-t">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Activity className="w-6 h-6 text-primary" />
                Body Metrics
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Ruler className="w-4 h-4 text-primary" />
                    Height (cm) <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => handleInputChange("height", e.target.value)}
                    required
                    min="100"
                    max="250"
                    placeholder="Height in cm"
                    className="w-full rounded-lg border-2 border-input bg-background px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-2"
                >
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Weight className="w-4 h-4 text-primary" />
                    Weight (kg) <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                    required
                    min="30"
                    max="300"
                    placeholder="Weight in kg"
                    className="w-full rounded-lg border-2 border-input bg-background px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </motion.div>
              </div>

              {bmi && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-primary/10 rounded-lg border-2 border-primary/20"
                >
                  <p className="text-sm font-medium">
                    Your BMI: <span className="text-primary text-lg">{bmi}</span> - {getBMICategory(bmi)}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Fitness Goals */}
            <div className="space-y-4 pt-6 border-t">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Target className="w-6 h-6 text-primary" />
                Fitness Goals & Preferences
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <AnimatedSelect
                  label="Fitness Goal"
                  value={formData.fitnessGoal}
                  onChange={(value) => handleInputChange("fitnessGoal", value)}
                  options={[
                    { value: "weight_loss", label: "Weight Loss" },
                    { value: "muscle_gain", label: "Muscle Gain" },
                    { value: "maintain", label: "Maintain Fitness" },
                    { value: "endurance", label: "Build Endurance" },
                    { value: "flexibility", label: "Improve Flexibility" },
                  ]}
                  required
                  icon={<Target className="w-4 h-4 text-primary" />}
                />

                <AnimatedSelect
                  label="Fitness Level"
                  value={formData.fitnessLevel}
                  onChange={(value) => handleInputChange("fitnessLevel", value)}
                  options={[
                    { value: "beginner", label: "Beginner" },
                    { value: "intermediate", label: "Intermediate" },
                    { value: "advanced", label: "Advanced" },
                  ]}
                  required
                  icon={<TrendingUp className="w-4 h-4 text-primary" />}
                />

                <AnimatedSelect
                  label="Workout Location"
                  value={formData.workoutLocation}
                  onChange={(value) => handleInputChange("workoutLocation", value)}
                  options={[
                    { value: "home", label: "Home" },
                    { value: "gym", label: "Gym" },
                    { value: "outdoor", label: "Outdoor" },
                    { value: "mixed", label: "Mixed" },
                  ]}
                  required
                  icon={<MapPin className="w-4 h-4 text-primary" />}
                />

                <AnimatedSelect
                  label="Dietary Preference"
                  value={formData.dietaryPreference}
                  onChange={(value) => handleInputChange("dietaryPreference", value)}
                  options={[
                    { value: "vegetarian", label: "Vegetarian" },
                    { value: "non_vegetarian", label: "Non-Vegetarian" },
                    { value: "vegan", label: "Vegan" },
                    { value: "keto", label: "Keto" },
                    { value: "paleo", label: "Paleo" },
                  ]}
                  required
                  icon={<Salad className="w-4 h-4 text-primary" />}
                />
              </div>
            </div>

            {/* Optional Information */}
            <div className="space-y-4 pt-6 border-t">
              <h2 className="text-2xl font-semibold">Additional Information (Optional)</h2>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <label className="text-sm font-medium">Medical History / Injuries</label>
                <textarea
                  value={formData.medicalHistory}
                  onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
                  placeholder="Any medical conditions, injuries, or limitations we should know about..."
                  rows={3}
                  className="w-full rounded-lg border-2 border-input bg-background px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                />
              </motion.div>

              <AnimatedSelect
                label="Stress Level"
                value={formData.stressLevel}
                onChange={(value) => handleInputChange("stressLevel", value)}
                options={[
                  { value: "low", label: "Low" },
                  { value: "moderate", label: "Moderate" },
                  { value: "high", label: "High" },
                ]}
              />
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating Your Plan...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate My Personalized Plan
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center text-muted-foreground text-sm"
        >
          <p
    className="para"
    style={{
      color: 'var(--text)', // ✅ Uses the CSS variable that changes with theme
      transition: 'color 0.3s ease',
    }}
  >
    © 2025 AI Fitness Coach. Powered by AI to transform your fitness journey.
  </p>
        </motion.footer>
      </main>

      {/* Plan View Modal */}
      <AnimatePresence>
        {currentPlan && (
          <PlanView
            plan={currentPlan.plan}
            userData={currentPlan.userData}
            onClose={() => setCurrentPlan(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}