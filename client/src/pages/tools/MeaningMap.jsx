import { useState } from "react";
import { Link } from "wouter";
import { Map, ArrowLeft, Plus, X, Save, Check } from "lucide-react";
import SEO from "../../components/SEO";
import SafetyFooter from "../../components/ui/SafetyFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx";
import { Button } from "@/components/ui/Button.jsx";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";

const MEANING_PROMPTS = [
  { category: "Purpose", question: "What activities make you lose track of time?" },
  { category: "Connection", question: "Who do you feel most yourself around?" },
  { category: "Growth", question: "What challenge are you proud of overcoming?" },
  { category: "Contribution", question: "How do you help others feel better?" },
  { category: "Legacy", question: "What do you want to be remembered for?" }
];

export default function MeaningMap() {
  const [answers, setAnswers] = useState({});
  const [coreValues, setCoreValues] = useState([]);
  const [newValue, setNewValue] = useState("");
  const [meaningStatement, setMeaningStatement] = useState("");
  const [saved, setSaved] = useState(false);

  const addValue = () => {
    if (newValue.trim() && coreValues.length < 5) {
      setCoreValues([...coreValues, newValue.trim()]);
      setNewValue("");
      setSaved(false);
    }
  };

  const removeValue = (index) => {
    setCoreValues(coreValues.filter((_, i) => i !== index));
    setSaved(false);
  };

  const updateAnswer = (category, value) => {
    setAnswers({ ...answers, [category]: value });
    setSaved(false);
  };

  const handleSave = () => {
    const map = { answers, coreValues, meaningStatement, savedAt: new Date().toISOString() };
    localStorage.setItem("glp_meaning_map", JSON.stringify(map));
    setSaved(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-background dark:from-amber-900/10 dark:to-background">
      <SEO 
        title="Meaning Map — The Genuine Love Project"
        description="Explore what gives your life meaning and purpose."
      />
      
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <Link href="/tools">
          <Button variant="ghost" size="sm" className="mb-6" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tools
          </Button>
        </Link>

        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm mb-4">
            <Map className="w-4 h-4" />
            <span>Purpose Tool</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Meaning Map
          </h1>
          <p className="text-muted-foreground">
            Explore the sources of meaning in your life.
          </p>
        </header>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Core Values (up to 5)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {coreValues.map((value, i) => (
                <span 
                  key={i}
                  className="px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 flex items-center gap-2"
                >
                  {value}
                  <button onClick={() => removeValue(i)} className="hover:text-amber-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a core value..."
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addValue()}
                disabled={coreValues.length >= 5}
                data-testid="input-value"
              />
              <Button 
                variant="outline" 
                onClick={addValue}
                disabled={coreValues.length >= 5 || !newValue.trim()}
                data-testid="button-add-value"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Explore What Matters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {MEANING_PROMPTS.map(prompt => (
              <div key={prompt.category}>
                <label className="text-sm font-medium mb-1 block">
                  <span className="text-amber-600 dark:text-amber-400">{prompt.category}:</span> {prompt.question}
                </label>
                <Textarea
                  value={answers[prompt.category] || ""}
                  onChange={(e) => updateAnswer(prompt.category, e.target.value)}
                  rows={2}
                  placeholder="Take your time..."
                  data-testid={`answer-${prompt.category.toLowerCase()}`}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Your Meaning Statement</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Based on your reflections, write a brief statement about what gives your life meaning.
            </p>
            <Textarea
              placeholder="My life is meaningful because..."
              value={meaningStatement}
              onChange={(e) => { setMeaningStatement(e.target.value); setSaved(false); }}
              rows={3}
              data-testid="textarea-statement"
            />
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <div>
            {saved && (
              <span className="text-green-600 dark:text-green-400 flex items-center gap-1 text-sm">
                <Check className="w-4 h-4" />
                Saved to device
              </span>
            )}
          </div>
          <Button onClick={handleSave} data-testid="button-save">
            <Save className="w-4 h-4 mr-2" />
            Save My Map
          </Button>
        </div>
      </main>

      <SafetyFooter />
    </div>
  );
}
