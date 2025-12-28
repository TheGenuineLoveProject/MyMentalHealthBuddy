export const stateDimensions = {
  energy: {
    label: "Energy",
    description: "How much physical and mental fuel you have available right now, without judging whether that level is good or bad.",
    options: [
      { value: 1, label: "Depleted" },
      { value: 2, label: "Low" },
      { value: 3, label: "Neutral" },
      { value: 4, label: "Steady" },
      { value: 5, label: "Wired" },
    ],
  },
  clarity: {
    label: "Clarity",
    description: "How easily your thoughts are forming and connecting, ranging from difficulty concentrating to heightened focus.",
    options: [
      { value: 1, label: "Foggy" },
      { value: 2, label: "Scattered" },
      { value: 3, label: "Mixed" },
      { value: 4, label: "Clear" },
      { value: 5, label: "Sharp" },
    ],
  },
  openness: {
    label: "Openness",
    description: "Your current willingness to take in new information, perspectives, or interactions with others.",
    options: [
      { value: 1, label: "Closed" },
      { value: 2, label: "Guarded" },
      { value: 3, label: "Selective" },
      { value: 4, label: "Receptive" },
      { value: 5, label: "Expansive" },
    ],
  },
  regulation: {
    label: "Regulation",
    description: "How well your nervous system is managing stimuli—whether you feel easily triggered or settled.",
    options: [
      { value: 1, label: "Reactive" },
      { value: 2, label: "Unstable" },
      { value: 3, label: "Variable" },
      { value: 4, label: "Stable" },
      { value: 5, label: "Grounded" },
    ],
  },
  presence: {
    label: "Presence",
    description: "How connected you feel to the current moment versus pulled toward past or future concerns.",
    options: [
      { value: 1, label: "Distant" },
      { value: 2, label: "Distracted" },
      { value: 3, label: "Partial" },
      { value: 4, label: "Engaged" },
      { value: 5, label: "Absorbed" },
    ],
  },
  pace: {
    label: "Pace",
    description: "The internal tempo you're experiencing—whether time feels compressed or spacious.",
    options: [
      { value: 1, label: "Rushed" },
      { value: 2, label: "Hurried" },
      { value: 3, label: "Moderate" },
      { value: 4, label: "Unhurried" },
      { value: 5, label: "Still" },
    ],
  },
};

export const dimensionOrder = ["energy", "clarity", "openness", "regulation", "presence", "pace"];

export default stateDimensions;
