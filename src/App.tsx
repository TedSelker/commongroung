import React, { useState } from 'react';
import { Users, Search, Sparkles, ArrowRight, UserPlus, Loader2 } from 'lucide-react';
import Markdown from 'react-markdown';
import { findCommonGround } from './services/gemini';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [person1, setPerson1] = useState('');
  const [person2, setPerson2] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!person1.trim() || !person2.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await findCommonGround(person1, person2);
      setResult(response);
    } catch (err) {
      console.error(err);
      setError('Failed to find common ground. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-zinc-900 font-sans selection:bg-emerald-100">
      {/* Header */}
      <header className="max-w-4xl mx-auto pt-16 px-6 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-600 rounded-xl text-white">
            <Users size={24} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Common Ground</h1>
        </div>
        <p className="text-zinc-500 max-w-lg">
          Discover shared interests, professional synergies, and collaboration opportunities between any two people.
        </p>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-24">
        {/* Input Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-zinc-200 p-8 mb-8">
          <form onSubmit={handleSearch} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
              <div className="space-y-2">
                <label htmlFor="person1" className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <UserPlus size={14} />
                  Person One
                </label>
                <input
                  id="person1"
                  type="text"
                  value={person1}
                  onChange={(e) => setPerson1(e.target.value)}
                  placeholder="e.g. Steve Jobs"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-lg"
                  required
                />
              </div>

              <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full border border-zinc-100 shadow-sm">
                <ArrowRight className="text-zinc-300" size={20} />
              </div>

              <div className="space-y-2">
                <label htmlFor="person2" className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <UserPlus size={14} />
                  Person Two
                </label>
                <input
                  id="person2"
                  type="text"
                  value={person2}
                  onChange={(e) => setPerson2(e.target.value)}
                  placeholder="e.g. Bill Gates"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-lg"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !person1.trim() || !person2.trim()}
              className={cn(
                "w-full py-4 rounded-2xl font-medium flex items-center justify-center gap-2 transition-all",
                loading 
                  ? "bg-zinc-100 text-zinc-400 cursor-not-allowed" 
                  : "bg-zinc-900 text-white hover:bg-zinc-800 active:scale-[0.98]"
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Analyzing Connections...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Find Common Ground
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-8 flex items-center gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            {error}
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <Search size={16} />
              <span className="text-sm font-medium uppercase tracking-widest">Analysis Results</span>
            </div>
            
            <div className="bg-white rounded-3xl shadow-sm border border-zinc-200 p-8 prose prose-zinc max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-p:text-zinc-600 prose-strong:text-zinc-900 prose-li:text-zinc-600">
              <Markdown>{result}</Markdown>
            </div>

            <div className="flex justify-center pt-8">
              <button 
                onClick={() => {
                  setResult(null);
                  setPerson1('');
                  setPerson2('');
                }}
                className="text-zinc-400 hover:text-zinc-600 text-sm font-medium transition-colors"
              >
                Clear and Start Over
              </button>
            </div>
          </div>
        )}

        {/* Empty State / Loading Placeholder */}
        {!result && !loading && !error && (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
            <div className="w-16 h-16 bg-zinc-200 rounded-full flex items-center justify-center mb-4">
              <Search size={32} className="text-zinc-400" />
            </div>
            <p className="text-zinc-500 font-medium">Enter two names to see where they connect.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-zinc-200 py-4 px-6 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400">
          <span>Powered by Gemini AI</span>
          <span>© 2024 Common Ground Finder</span>
        </div>
      </footer>
    </div>
  );
}
