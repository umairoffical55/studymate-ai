"use client";

import { useState, useEffect } from "react";
import { 
  CheckSquare, 
  Sparkles, 
  Trash2, 
  Plus, 
  Calendar, 
  BookOpen, 
  BookMarked,
  Check, 
  AlertCircle,
  BrainCircuit,
  HelpCircle,
  Moon
} from "lucide-react";

export default function Home() {
  // --- STATE ---
  const [tasks, setTasks] = useState([]);
  
  // Task form fields
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [deadline, setDeadline] = useState("");
  
  // AI Tutor fields
  const [tutorTopic, setTutorTopic] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [tutorError, setTutorError] = useState("");

  // Hydration safety flag
  const [isMounted, setIsMounted] = useState(false);

  // --- LOCALSTORAGE PERSISTENCE ---
  // Load tasks on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("studymate_tasks");
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (err) {
        console.error("Error parsing tasks from localStorage:", err);
      }
    }
    setIsMounted(true);
  }, []);

  // Save tasks to localStorage on change
  const saveTasks = (updatedTasks) => {
    setTasks(updatedTasks);
    localStorage.setItem("studymate_tasks", JSON.stringify(updatedTasks));
  };

  // --- HANDLERS ---
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!subject.trim() || !topic.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      subject: subject.trim(),
      topic: topic.trim(),
      deadline: deadline || "No deadline set",
      completed: false,
    };

    const updatedTasks = [...tasks, newTask];
    saveTasks(updatedTasks);

    // Reset form inputs
    setSubject("");
    setTopic("");
    setDeadline("");
  };

  const handleToggleComplete = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks(updatedTasks);
  };

  const handleDeleteTask = (id, e) => {
    // Prevent event bubbling to the parent container which triggers the toggle action
    e.stopPropagation();
    const updatedTasks = tasks.filter((task) => task.id !== id);
    saveTasks(updatedTasks);
  };

  const handleAskTutor = async (e) => {
    e.preventDefault();
    const cleanTopic = tutorTopic.trim();
    if (!cleanTopic) {
      setTutorError("Please type a topic or question first.");
      return;
    }

    setIsThinking(true);
    setTutorError("");
    setAiResponse("");

    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic: cleanTopic }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get explanation from tutor.");
      }

      setAiResponse(data.response);
    } catch (err) {
      console.error("Tutor Request Failed:", err);
      setTutorError(err.message || "Something went wrong. Please check your connection and try again.");
    } finally {
      setIsThinking(false);
    }
  };

  // Prevent server-rendered HTML from mismatching client-side loaded localstorage state
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712]">
        <div className="flex flex-col items-center gap-3">
          <BrainCircuit className="w-12 h-12 text-indigo-500 animate-spin" />
          <span className="text-slate-400 font-medium tracking-wide">Loading StudyMate AI...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 flex flex-col min-h-screen">
      {/* Header */}
      <header className="text-center mb-8 md:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs md:text-sm mb-4 font-semibold tracking-wide animate-subtle-pulse shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          AI-Powered Student Assistant
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent select-none drop-shadow-sm">
          📚 StudyMate AI
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-md mx-auto mt-3 font-medium">
          Your personal study planner and AI-powered tutor.
        </p>
      </header>

      {/* Grid Layout */}
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start flex-grow">
        
        {/* Section 1: Study Tasks */}
        <section className="glass-panel rounded-2xl p-6 md:p-8 glow-primary flex flex-col h-full min-h-[500px]">
          <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4 mb-6">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white tracking-wide">Study Tasks</h2>
              <p className="text-slate-400 text-xs mt-0.5">Organize your subjects and tracking goals</p>
            </div>
          </div>

          {/* Task Form */}
          <form onSubmit={handleAddTask} className="space-y-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider" htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  type="text"
                  placeholder="e.g., Biology, Calculus"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="bg-slate-900/50 border border-slate-700/50 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all font-medium"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider" htmlFor="topic">Topic</label>
                <input
                  id="topic"
                  type="text"
                  placeholder="e.g., Mitosis, Derivatives"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="bg-slate-900/50 border border-slate-700/50 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider" htmlFor="deadline">Deadline</label>
                <div className="relative">
                  <input
                    id="deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg pl-3.5 pr-10 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all font-medium appearance-none"
                  />
                  <Calendar className="absolute right-3.5 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-indigo-500/20 active:scale-95 duration-150 flex items-center justify-center gap-2 whitespace-nowrap min-h-[38px]"
              >
                <Plus className="w-4 h-4" />
                Add Task
              </button>
            </div>
          </form>

          {/* Tasks List Container */}
          <div className="flex-grow overflow-y-auto max-h-[350px] pr-1">
            {tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-slate-800/80 rounded-xl bg-slate-900/20">
                <BookMarked className="w-10 h-10 text-slate-600 mb-3" />
                <p className="text-slate-400 text-sm font-medium text-center">No tasks yet</p>
                <p className="text-slate-500 text-xs text-center mt-1">Add tasks above to start planning your studies.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleComplete(task.id)}
                    className={`group relative flex items-center justify-between p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                      task.completed
                        ? "bg-green-600/90 border-green-500 text-white line-through shadow-md"
                        : "bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700/60 text-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 pr-8 select-none">
                      {/* Completion check circle */}
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                        task.completed 
                          ? "bg-white border-white text-green-700" 
                          : "border-slate-600 text-transparent group-hover:border-indigo-400"
                      }`}>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>

                      {/* Task Info */}
                      <div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            task.completed
                              ? "bg-green-500/30 text-green-100"
                              : "bg-indigo-500/10 text-indigo-300 border border-indigo-500/10"
                          }`}>
                            {task.subject}
                          </span>
                          {task.deadline && (
                            <span className={`text-[10px] inline-flex items-center gap-1 font-medium ${
                              task.completed ? "text-green-200/80" : "text-slate-500"
                            }`}>
                              <Calendar className="w-3 h-3" />
                              {task.deadline}
                            </span>
                          )}
                        </div>
                        <p className={`text-sm font-semibold mt-1.5 leading-snug tracking-wide ${
                          task.completed ? "text-green-50" : "text-white"
                        }`}>
                          {task.topic}
                        </p>
                      </div>
                    </div>

                    {/* Delete button (✕) */}
                    <button
                      onClick={(e) => handleDeleteTask(task.id, e)}
                      aria-label="Delete Task"
                      className={`absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        task.completed
                          ? "hover:bg-green-700 text-green-100 hover:text-white"
                          : "hover:bg-red-500/15 text-slate-500 hover:text-red-400"
                      }`}
                    >
                      <span className="text-lg font-medium leading-none">✕</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Section 2: AI Tutor */}
        <section className="glass-panel rounded-2xl p-6 md:p-8 glow-primary flex flex-col h-full min-h-[500px]">
          <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4 mb-6">
            <div className="w-8 h-8 rounded-lg bg-pink-500/15 flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white tracking-wide">Ask the AI Tutor</h2>
              <p className="text-slate-400 text-xs mt-0.5">Learn any concept with StudyMate AI</p>
            </div>
          </div>

          <form onSubmit={handleAskTutor} className="flex flex-col gap-3 mb-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider" htmlFor="tutor-input">Topic or Question</label>
              <textarea
                id="tutor-input"
                placeholder="What topic or question do you need help with? (e.g. Photosynthesis, Binary Search, French Revolution)"
                value={tutorTopic}
                onChange={(e) => setTutorTopic(e.target.value)}
                className="bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/40 focus:border-pink-400 transition-all font-medium resize-none h-[88px]"
                disabled={isThinking}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isThinking || !tutorTopic.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-purple-800/40 disabled:to-pink-800/40 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold text-sm px-4 py-3 rounded-lg transition-all shadow-lg shadow-purple-500/20 active:scale-[0.98] duration-150 flex items-center justify-center gap-2 min-h-[46px]"
            >
              {isThinking ? (
                <>
                  <BrainCircuit className="w-4 h-4 animate-spin text-pink-200" />
                  Thinking...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-pink-200" />
                  Explain Concept
                </>
              )}
            </button>
          </form>

          {/* AI Response Display Area */}
          <div className="flex-grow flex flex-col min-h-[220px]">
            {/* Error Message */}
            {tutorError && (
              <div className="flex gap-3 p-4 rounded-xl border border-red-500/20 bg-red-950/20 text-red-300 text-sm animate-fade-in">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <div className="font-medium leading-relaxed">{tutorError}</div>
              </div>
            )}

            {/* Response Output */}
            {aiResponse && (
              <div className="flex flex-col gap-2 flex-grow animate-fade-in">
                <span className="text-pink-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> {"StudyMate's Explanation"}
                </span>
                <pre className="whitespace-pre-wrap font-sans text-sm md:text-[14.5px] leading-relaxed bg-slate-950/80 p-5 rounded-xl border border-slate-800/80 shadow-inner text-slate-200 overflow-y-auto max-h-[260px] scrollbar-thin">
                  {aiResponse}
                </pre>
              </div>
            )}

            {/* Empty Tutor State */}
            {!tutorError && !aiResponse && !isThinking && (
              <div className="flex-grow flex flex-col items-center justify-center py-10 px-4 border border-dashed border-slate-800/80 rounded-xl bg-slate-900/20">
                <HelpCircle className="w-10 h-10 text-slate-600 mb-3" />
                <p className="text-slate-400 text-sm font-medium text-center">Ask StudyMate anything</p>
                <p className="text-slate-500 text-xs text-center mt-1 max-w-xs leading-relaxed">
                  Enter a complex topic above and click Explain to receive a simple breakdown, key facts, and practice questions.
                </p>
              </div>
            )}

            {/* Thinking / Loading Placeholder */}
            {isThinking && (
              <div className="flex-grow flex flex-col items-center justify-center py-12">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-12 h-12 rounded-full border-2 border-pink-500/10 border-t-pink-500 animate-spin"></div>
                  <BrainCircuit className="w-6 h-6 text-pink-400 animate-pulse" />
                </div>
                <p className="text-pink-300/80 text-sm font-semibold tracking-wider mt-5 animate-pulse">
                  Consulting StudyMate...
                </p>
                <p className="text-slate-500 text-xs mt-1.5">Gathering explanations and practice questions</p>
              </div>
            )}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-slate-900 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} StudyMate AI. Built for students who want to learn faster and stay organized.</p>
      </footer>
    </div>
  );
}
