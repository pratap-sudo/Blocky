import React, { useState } from 'react';
import { SAMPLE_PROGRAMS, SampleProgram } from '../data/samplePrograms';
import { X, Search, Sparkles, ArrowRight, Code2, Layers } from 'lucide-react';

interface ExamplesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSample: (sample: SampleProgram) => void;
}

export const ExamplesModal: React.FC<ExamplesModalProps> = ({
  isOpen,
  onClose,
  onSelectSample,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const categories = ['All', 'Basics', 'Conditionals', 'Loops', 'Arrays', 'Math'];

  const filtered = SAMPLE_PROGRAMS.filter((sample) => {
    const matchesCategory =
      selectedCategory === 'All' || sample.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      sample.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] sm:max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="h-16 px-4 sm:px-6 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/50">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-xs sm:text-base font-bold text-white flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span>Sample Programs</span>
                <span className="text-[10px] sm:text-xs font-normal text-slate-400 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700">
                  {SAMPLE_PROGRAMS.length} Programs
                </span>
              </h2>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Choose a pre-built program to instantly load its visual blocks and C code.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar & Search */}
        <div className="px-4 sm:px-6 py-2.5 sm:py-3 border-b border-slate-800 flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center justify-between bg-slate-950/40">
          {/* Category Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search programs or tags..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Programs Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((sample) => (
            <div
              key={sample.id}
              className="group bg-slate-950/60 border border-slate-800 hover:border-blue-500/50 rounded-xl p-4 flex flex-col justify-between transition hover:shadow-lg hover:shadow-blue-950/20"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="font-bold text-white text-sm group-hover:text-blue-400 transition flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>{sample.title}</span>
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider shrink-0 ${
                      sample.difficulty === 'Beginner'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {sample.difficulty}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  {sample.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {sample.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 text-[10px] border border-slate-800 font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  onSelectSample(sample);
                  onClose();
                }}
                className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition group-hover:bg-blue-600 group-hover:text-white"
              >
                <span>Load into Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 text-xs">
              No sample programs found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
