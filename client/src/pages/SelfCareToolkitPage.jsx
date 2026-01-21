import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Sparkles, Heart, Sun, Moon, Droplets, Utensils, Move, Users, Palette, BookOpen, Music, CheckCircle2 } from "lucide-react";

const toolkitCategories = [
  {
    id: "physical",
    name: "Physical Care",
    icon: Move,
    color: "from-emerald-400 to-teal-500",
    description: "Nurture your body with movement, rest, and nourishment",
    activities: [
      { name: "Take a gentle walk outside", time: "15-30 min", benefit: "Boosts mood and energy" },
      { name: "Stretch your body slowly", time: "5-10 min", benefit: "Releases tension" },
      { name: "Take a warm bath or shower", time: "15-20 min", benefit: "Relaxes muscles and mind" },
      { name: "Get 7-9 hours of sleep", time: "Overnight", benefit: "Restores body and brain" },
      { name: "Dance to your favorite song", time: "3-5 min", benefit: "Releases endorphins" },
      { name: "Practice yoga or tai chi", time: "20-30 min", benefit: "Balances body and mind" }
    ]
  },
  {
    id: "emotional",
    name: "Emotional Care",
    icon: Heart,
    color: "from-rose-400 to-pink-500",
    description: "Honor your feelings and cultivate emotional wellness",
    activities: [
      { name: "Journal your thoughts and feelings", time: "10-15 min", benefit: "Processes emotions" },
      { name: "Have a good cry if needed", time: "As needed", benefit: "Releases emotional tension" },
      { name: "Practice self-compassion phrases", time: "5 min", benefit: "Soothes inner critic" },
      { name: "Set a boundary that protects your peace", time: "Varies", benefit: "Builds self-respect" },
      { name: "Watch something that makes you laugh", time: "20-60 min", benefit: "Lifts mood naturally" },
      { name: "Validate your own feelings out loud", time: "2 min", benefit: "Builds emotional intelligence" }
    ]
  },
  {
    id: "social",
    name: "Social Care",
    icon: Users,
    color: "from-sky-400 to-blue-500",
    description: "Connect with others and nurture meaningful relationships",
    activities: [
      { name: "Call or text someone you care about", time: "5-30 min", benefit: "Strengthens bonds" },
      { name: "Schedule quality time with a friend", time: "1-2 hrs", benefit: "Deepens connection" },
      { name: "Join an online or local community group", time: "Varies", benefit: "Creates belonging" },
      { name: "Practice active listening with someone", time: "10-20 min", benefit: "Improves relationships" },
      { name: "Send a gratitude message to someone", time: "5 min", benefit: "Spreads positivity" },
      { name: "Set healthy relationship boundaries", time: "Varies", benefit: "Protects your energy" }
    ]
  },
  {
    id: "mental",
    name: "Mental Care",
    icon: BookOpen,
    color: "from-indigo-400 to-purple-500",
    description: "Stimulate and rest your mind in healthy ways",
    activities: [
      { name: "Read something inspiring", time: "15-30 min", benefit: "Expands perspective" },
      { name: "Learn something new and fun", time: "20-60 min", benefit: "Builds confidence" },
      { name: "Take a complete break from screens", time: "1-2 hrs", benefit: "Reduces mental fatigue" },
      { name: "Do a puzzle or brain game", time: "15-30 min", benefit: "Sharpens focus" },
      { name: "Practice mindfulness meditation", time: "5-15 min", benefit: "Calms racing thoughts" },
      { name: "Organize one small area of your space", time: "15-30 min", benefit: "Creates mental clarity" }
    ]
  },
  {
    id: "spiritual",
    name: "Spiritual Care",
    icon: Sparkles,
    color: "from-amber-400 to-orange-500",
    description: "Connect with meaning, purpose, and something greater",
    activities: [
      { name: "Spend time in nature", time: "20-60 min", benefit: "Grounds and inspires" },
      { name: "Practice gratitude reflection", time: "5-10 min", benefit: "Shifts perspective" },
      { name: "Meditate or pray", time: "10-20 min", benefit: "Connects to inner peace" },
      { name: "Reflect on your values and purpose", time: "15-30 min", benefit: "Clarifies direction" },
      { name: "Do something creative without judgment", time: "20-60 min", benefit: "Expresses soul" },
      { name: "Practice forgiveness (self or others)", time: "Varies", benefit: "Releases heavy energy" }
    ]
  },
  {
    id: "sensory",
    name: "Sensory Care",
    icon: Music,
    color: "from-violet-400 to-purple-500",
    description: "Soothe your senses with pleasant experiences",
    activities: [
      { name: "Listen to calming or uplifting music", time: "15-30 min", benefit: "Regulates nervous system" },
      { name: "Light a scented candle or use aromatherapy", time: "Ongoing", benefit: "Creates calm atmosphere" },
      { name: "Enjoy a favorite healthy snack mindfully", time: "10 min", benefit: "Grounds in pleasure" },
      { name: "Wrap yourself in a soft blanket", time: "As needed", benefit: "Provides comfort" },
      { name: "Look at beautiful art or nature photos", time: "5-15 min", benefit: "Inspires and soothes" },
      { name: "Give yourself a hand or foot massage", time: "5-10 min", benefit: "Releases tension" }
    ]
  }
];

const quickSelfCare = [
  { name: "Take 5 deep breaths", icon: Droplets, time: "1 min" },
  { name: "Drink a glass of water", icon: Droplets, time: "1 min" },
  { name: "Step outside briefly", icon: Sun, time: "2 min" },
  { name: "Stretch your neck and shoulders", icon: Move, time: "2 min" },
  { name: "Say one kind thing to yourself", icon: Heart, time: "30 sec" },
  { name: "Look at something beautiful", icon: Palette, time: "1 min" }
];

function ActivityCard({ activity, onToggle, isCompleted }) {
  return (
    <button
      onClick={onToggle}
      className={`w-full text-left p-4 rounded-xl transition-all ${
        isCompleted 
          ? "bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-500" 
          : "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700"
      }`}
      data-testid={`button-activity-${activity.name.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
          isCompleted ? "bg-emerald-500 text-white" : "border-2 border-slate-300 dark:border-slate-600"
        }`}>
          {isCompleted && <CheckCircle2 className="h-4 w-4" />}
        </div>
        <div className="flex-1">
          <h4 className={`font-medium ${isCompleted ? "text-emerald-700 dark:text-emerald-300" : "text-slate-900 dark:text-white"}`}>
            {activity.name}
          </h4>
          <div className="flex items-center gap-4 mt-1 text-sm text-slate-500 dark:text-slate-400">
            <span>{activity.time}</span>
            <span>•</span>
            <span>{activity.benefit}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

export default function SelfCareToolkitPage() {
  const [selectedCategory, setSelectedCategory] = useState(toolkitCategories[0]);
  const [completedActivities, setCompletedActivities] = useState([]);

  const toggleActivity = (activityName) => {
    setCompletedActivities(prev =>
      prev.includes(activityName) 
        ? prev.filter(a => a !== activityName) 
        : [...prev, activityName]
    );
  };

  const categoryCompleted = selectedCategory.activities.filter(a => 
    completedActivities.includes(a.name)
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white dark:from-slate-900 dark:to-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-8" data-testid="link-back-home">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white mb-6">
            <Sparkles className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Self-Care Toolkit</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Holistic self-care activities for your whole being—body, mind, heart, and soul.
            Choose activities that resonate with you today.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-12">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Self-Care (Under 5 Minutes)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickSelfCare.map((item, idx) => (
              <button
                key={idx}
                onClick={() => toggleActivity(item.name)}
                className={`p-4 rounded-xl text-center transition-all ${
                  completedActivities.includes(item.name)
                    ? "bg-emerald-100 dark:bg-emerald-900/50 border-2 border-emerald-500"
                    : "bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
                data-testid={`button-quick-${idx}`}
              >
                <item.icon className={`h-6 w-6 mx-auto mb-2 ${
                  completedActivities.includes(item.name) ? "text-emerald-500" : "text-slate-400"
                }`} />
                <p className={`text-sm ${
                  completedActivities.includes(item.name) 
                    ? "text-emerald-700 dark:text-emerald-300" 
                    : "text-slate-600 dark:text-slate-400"
                }`}>{item.name}</p>
                <p className="text-xs text-slate-400 mt-1">{item.time}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {toolkitCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat)}
              className={`p-4 rounded-xl text-center transition-all ${
                selectedCategory.id === cat.id
                  ? `bg-gradient-to-br ${cat.color} text-white shadow-lg scale-105`
                  : "bg-white dark:bg-slate-800 hover:shadow-md"
              }`}
              data-testid={`button-category-${cat.id}`}
            >
              <cat.icon className={`h-8 w-8 mx-auto mb-2 ${selectedCategory.id === cat.id ? "text-white" : "text-slate-400"}`} />
              <span className={`text-sm font-medium ${selectedCategory.id === cat.id ? "text-white" : "text-slate-600 dark:text-slate-300"}`}>
                {cat.name}
              </span>
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${selectedCategory.color} text-white`}>
                <selectedCategory.icon className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedCategory.name}</h2>
                <p className="text-slate-600 dark:text-slate-400">{selectedCategory.description}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-emerald-500">{categoryCompleted}</span>
              <span className="text-slate-400">/{selectedCategory.activities.length}</span>
              <p className="text-sm text-slate-500">completed</p>
            </div>
          </div>

          <div className="space-y-3">
            {selectedCategory.activities.map((activity, idx) => (
              <ActivityCard
                key={idx}
                activity={activity}
                isCompleted={completedActivities.includes(activity.name)}
                onToggle={() => toggleActivity(activity.name)}
              />
            ))}
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 rounded-2xl p-8 text-center">
          <Heart className="h-10 w-10 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Remember</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Self-care isn't selfish—it's essential. Start with one small act of kindness toward yourself today.
            You deserve the same care you give to others.
          </p>
        </div>

        <div className="mt-12 text-center py-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Self-care supports but does not replace professional mental health treatment.
            If you're struggling, please reach out to a healthcare provider.
          </p>
        </div>
      </div>
    </div>
  );
}
