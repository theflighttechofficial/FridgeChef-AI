import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Sparkles,
  GitFork,
  Layers,
  Flame,
  CheckCircle2,
  X,
  ChevronRight,
  Info,
  Atom,
  Search,
  Share2
} from 'lucide-react';
import { KnowledgeGraphNode } from '../types';

interface RecipeKnowledgeGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecipeNode?: (recipeTitle: string) => void;
}

const KNOWLEDGE_GRAPH_DATA: KnowledgeGraphNode[] = [
  {
    id: 'node-tomato',
    label: 'Tomato (Solanum lycopersicum)',
    category: 'Ingredient',
    description: 'Vibrant nightshade fruit characterized by high glutamic acid (free umami) and citric/malic acidity.',
    flavorProfile: 'Sweet, acidic, umami-rich, fruity',
    relatedNodes: ['comp-glutamate', 'comp-acidity', 'tech-roasting', 'tech-concasse', 'cuis-mediterranean', 'cuis-indian', 'sub-tamarind']
  },
  {
    id: 'node-chicken',
    label: 'Chicken Breast / Thigh',
    category: 'Ingredient',
    description: 'Lean muscle protein rich in inosine monophosphate (IMP), which acts synergistically with glutamate.',
    flavorProfile: 'Savory, delicate, mild umami',
    relatedNodes: ['comp-glutamate', 'tech-maillard', 'tech-arroser', 'cuis-mediterranean', 'cuis-indian', 'rec-skillet-chicken']
  },
  {
    id: 'node-spinach',
    label: 'Baby Spinach',
    category: 'Ingredient',
    description: 'Tender chlorophyll-dense leafy green rich in oxalates, folate, and subtle iron minerality.',
    flavorProfile: 'Herbaceous, earthy, gentle bitter sweetness',
    relatedNodes: ['comp-chlorophyll', 'tech-flash-sauté', 'cuis-indian', 'rec-skillet-chicken', 'sub-kale']
  },
  {
    id: 'comp-glutamate',
    label: 'Glutamate (Free Amino Acid)',
    category: 'FlavorCompound',
    description: 'Triggers the T1R1/T1R3 tongue receptors, producing deep savory umami mouthfulness.',
    relatedNodes: ['node-tomato', 'node-chicken', 'sub-nutritional-yeast']
  },
  {
    id: 'comp-acidity',
    label: 'Citric & Malic Acidity',
    category: 'FlavorCompound',
    description: 'Lowers pH, stimulating salivary enzymes, cutting heavy fats, and brightening volatile aromatics.',
    relatedNodes: ['node-tomato', 'tech-pan-deglazing', 'sub-tamarind']
  },
  {
    id: 'comp-chlorophyll',
    label: 'Chlorophyll a/b Pigment',
    category: 'FlavorCompound',
    description: 'Vibrant green porphyrin ring that degrades into pheophytin (olive-drab) if overcooked beyond 3 minutes.',
    relatedNodes: ['node-spinach', 'tech-flash-sauté']
  },
  {
    id: 'tech-maillard',
    label: 'Maillard Reaction (140°C–165°C)',
    category: 'CookingTechnique',
    description: 'Chemical reaction between amino acids and reducing sugars producing hundreds of complex flavor pyrazines.',
    relatedNodes: ['node-chicken', 'rec-skillet-chicken']
  },
  {
    id: 'tech-roasting',
    label: 'High-Heat Pan Roasting',
    category: 'CookingTechnique',
    description: 'Concentrates moisture and caramelizes natural fructose in nightshade vegetables.',
    relatedNodes: ['node-tomato', 'cuis-mediterranean']
  },
  {
    id: 'tech-flash-sauté',
    label: '90-Second Flash Sauté',
    category: 'CookingTechnique',
    description: 'Preserves cellular turgor and bright emerald color by halting heat before cell wall collapse.',
    relatedNodes: ['node-spinach', 'rec-skillet-chicken']
  },
  {
    id: 'cuis-mediterranean',
    label: 'Mediterranean Tradition',
    category: 'Cuisine',
    description: 'Emulsifies cold-pressed olive oils with tomato acidity, garlic, and sea salt.',
    relatedNodes: ['node-tomato', 'node-chicken', 'rec-skillet-chicken']
  },
  {
    id: 'cuis-indian',
    label: 'Indian Tadka Archetype',
    category: 'Cuisine',
    description: 'Blooms whole spices in oil to extract lipid-soluble volatile terpenes and flavonoids.',
    relatedNodes: ['node-tomato', 'node-spinach', 'sub-tamarind']
  },
  {
    id: 'sub-tamarind',
    label: 'Tamarind Pulp / Sumac',
    category: 'Substitution',
    description: 'Matches the tart-sweet malic and tartaric acid profile of cooked tomatoes with 92% flavor similarity.',
    relatedNodes: ['node-tomato', 'comp-acidity']
  },
  {
    id: 'rec-skillet-chicken',
    label: 'Garlic Chicken & Spinach Skillet',
    category: 'Recipe',
    description: 'Harmonious synthesis of Maillard poultry fond, wilted chlorophyll greens, and roasted allicin garlic.',
    relatedNodes: ['node-chicken', 'node-spinach', 'tech-maillard']
  }
];

export const RecipeKnowledgeGraphModal: React.FC<RecipeKnowledgeGraphModalProps> = ({
  isOpen,
  onClose,
  onSelectRecipeNode,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-tomato');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  if (!isOpen) return null;

  const activeNode = KNOWLEDGE_GRAPH_DATA.find((n) => n.id === selectedNodeId) || KNOWLEDGE_GRAPH_DATA[0];

  const filteredNodes = filterCategory === 'All'
    ? KNOWLEDGE_GRAPH_DATA
    : KNOWLEDGE_GRAPH_DATA.filter((n) => n.category === filterCategory);

  const relatedEntities = KNOWLEDGE_GRAPH_DATA.filter((n) =>
    activeNode.relatedNodes.includes(n.id)
  );

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Ingredient': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'FlavorCompound': return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'CookingTechnique': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Cuisine': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'Recipe': return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'Substitution': return 'bg-teal-500/20 text-teal-300 border-teal-500/40';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center">
              <GitFork className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white">Culinary Recipe Knowledge Graph</h3>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold border border-purple-500/30">
                  ONTOLOGY & FLAVOR CHEMISTRY
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Ingredients → Flavor Compounds → Techniques → Cuisines → Recipes → Substitutions.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Categories Horizontal Pill Bar */}
        <div className="px-6 py-3 bg-slate-950/70 border-b border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {['All', 'Ingredient', 'FlavorCompound', 'CookingTechnique', 'Cuisine', 'Recipe', 'Substitution'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                filterCategory === cat
                  ? 'bg-purple-500 text-white border-purple-400 shadow-md'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat === 'FlavorCompound' ? 'Compounds' : cat === 'CookingTechnique' ? 'Techniques' : cat}
            </button>
          ))}
        </div>

        {/* Main Content: 2-Column Graph Visualizer */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Interactive Knowledge Graph Nodes (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span className="font-bold uppercase tracking-wider">Select Node to Trace Molecular Links:</span>
              <span className="font-mono text-[11px]">{filteredNodes.length} Active Nodes</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto p-2 bg-slate-950/60 rounded-2xl border border-slate-800">
              {filteredNodes.map((node) => {
                const isSelected = selectedNodeId === node.id;
                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all space-y-1.5 ${
                      isSelected
                        ? 'bg-purple-500/20 border-purple-400 text-white shadow-lg shadow-purple-500/10'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <strong className="text-xs font-black block leading-tight">{node.label}</strong>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase shrink-0 ${getCategoryColor(node.category)}`}>
                        {node.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-snug">{node.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Node Details & Connected Relationships (1 col) */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${getCategoryColor(activeNode.category)}`}>
                  {activeNode.category}
                </span>
                <span className="text-[10px] font-mono text-slate-500">ID: {activeNode.id}</span>
              </div>

              <div>
                <h4 className="text-base font-black text-white">{activeNode.label}</h4>
                {activeNode.flavorProfile && (
                  <span className="text-xs text-purple-300 font-mono block mt-0.5">
                    Flavor Profile: {activeNode.flavorProfile}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                {activeNode.description}
              </p>

              {/* Related Connected Edges in Graph */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Connected Graph Edges ({relatedEntities.length}):
                </span>

                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {relatedEntities.map((rel) => (
                    <button
                      key={rel.id}
                      onClick={() => setSelectedNodeId(rel.id)}
                      className="w-full p-2 bg-slate-900 hover:bg-slate-850 rounded-xl border border-slate-800 text-left text-xs text-slate-200 hover:text-purple-300 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-purple-400">↳</span>
                        <span className="font-bold truncate">{rel.label}</span>
                      </div>
                      <span className={`text-[8px] font-mono px-1 py-0.2 rounded border uppercase ${getCategoryColor(rel.category)}`}>
                        {rel.category}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {activeNode.category === 'Recipe' && onSelectRecipeNode && (
              <button
                onClick={() => {
                  onSelectRecipeNode(activeNode.label);
                  onClose();
                }}
                className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5"
              >
                <span>Find Recipes Linked to This Node</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
