import type React from 'react';
import { Activity, Atom, Award, Bot, Brain, Camera, ChefHat, FlaskConical, GitFork, Globe, Mic, PartyPopper, Receipt, ShieldAlert, Thermometer, Trophy, Users, Wallet } from 'lucide-react';

export interface ToolItem {
  group: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  onSelect?: () => void;
  highlight?: boolean;
}

export type ToolHandlers = Record<
  | 'agent' | 'voice' | 'graph' | 'taste' | 'memory' | 'neuro' | 'personas' | 'challenge' | 'ironChef' | 'substitutes'
  | 'plating' | 'plate' | 'catering' | 'dinnerForEveryone' | 'nutrition' | 'safety' | 'sensors' | 'carbon' | 'budget'
  | 'financials' | 'receipt',
  () => void
>;

// Every secondary feature lives in the tools sheet so navigation keeps only the core destinations
export const buildTools = (h: ToolHandlers): ToolItem[] => [
  { group: 'AI agents', label: 'Culinary OS', description: 'Autonomous meal planning agent', icon: Bot, onSelect: h.agent, highlight: true },
  { group: 'AI agents', label: 'Voice kitchen', description: 'Talk to your kitchen assistant hands-free', icon: Mic, onSelect: h.voice },
  { group: 'AI agents', label: 'Knowledge graph', description: 'Flavour compounds and recipe connections', icon: GitFork, onSelect: h.graph },
  { group: 'AI agents', label: 'Taste model', description: 'Learns your taste preferences over time', icon: Brain, onSelect: h.taste },
  { group: 'AI agents', label: 'Household memory', description: 'What your household likes and avoids', icon: Users, onSelect: h.memory },
  { group: 'AI agents', label: 'Neuro-gastronomy', description: 'Mood-based dishes and a food time machine', icon: Atom, onSelect: h.neuro },
  { group: 'Cook & create', label: 'Chef personas', description: 'Recipes in 10 master chef styles', icon: ChefHat, onSelect: h.personas },
  { group: 'Cook & create', label: 'Pantry challenge', description: 'Cook with only what you have', icon: Trophy, onSelect: h.challenge },
  { group: 'Cook & create', label: 'Iron Chef', description: 'Mystery box cooking game', icon: Award, onSelect: h.ironChef },
  { group: 'Cook & create', label: 'Substitutes', description: 'Swap any ingredient intelligently', icon: FlaskConical, onSelect: h.substitutes },
  { group: 'Cook & create', label: 'AR plating', description: 'Restaurant-style plating guide', icon: Award, onSelect: h.plating },
  { group: 'Cook & create', label: 'Plate vision', description: 'Score a photo of your plated dish', icon: Camera, onSelect: h.plate },
  { group: 'Cook & create', label: 'Event catering', description: 'Plan menus for guests and parties', icon: PartyPopper, onSelect: h.catering },
  { group: 'Cook & create', label: 'Dinner for everyone', description: 'One meal for every household diet', icon: Users, onSelect: h.dinnerForEveryone },
  { group: 'Health & safety', label: 'Nutrition', description: 'Personal macro and nutrient tracking', icon: Activity, onSelect: h.nutrition },
  { group: 'Health & safety', label: 'Food safety', description: 'Safe-storage windows and spoilage risk', icon: ShieldAlert, onSelect: h.safety },
  { group: 'Health & safety', label: 'Fridge sensors', description: 'Temperature, humidity and door', icon: Thermometer, onSelect: h.sensors },
  { group: 'Health & safety', label: 'Carbon calculator', description: 'Food waste carbon and water impact', icon: Globe, onSelect: h.carbon },
  { group: 'Money & pantry', label: 'Budget mode', description: 'Grocery price intelligence', icon: Wallet, onSelect: h.budget },
  { group: 'Money & pantry', label: 'Pantry financials', description: 'Where your food money goes', icon: Wallet, onSelect: h.financials },
  { group: 'Money & pantry', label: 'Receipt to pantry', description: 'Scan a receipt into your fridge', icon: Receipt, onSelect: h.receipt },
];
