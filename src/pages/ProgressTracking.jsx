import { useEffect, useMemo, useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, Legend,
  CartesianGrid, ResponsiveContainer,
} from "recharts";
import {
  Sparkles, TrendingUp, TrendingDown, BookOpenCheck, Clock3, Trophy, ListChecks,
  Star, GraduationCap, LineChart as LineChartIcon, BarChart3, UploadCloud, Wand2,
  Brain, Flame, CheckCircle2, Circle, Target, Zap, NotebookPen,
} from "lucide-react";

import MainLayout from "../layouts/MainLayout"

const API = import.meta.env.VITE_API_URL

// ---------------------------------------------------------------------------
// Mock "AI-generated" data — in production this streams in automatically from
// the Quiz Generator, Einstein Classroom, and Note Upload pipelines.
// ---------------------------------------------------------------------------
const INITIAL_SUBJECTS = [
  { id: "math", name: "Math" },
  { id: "english", name: "English" },
  { id: "science", name: "Science" },
  { id: "ict", name: "ICT" },
];

const QUIZ_RESULTS = [
  { id: "q1", subjectId: "math", subject: "Math", date: "2026-06-01", score: 14, total: 20 },
  { id: "q2", subjectId: "math", subject: "Math", date: "2026-06-15", score: 17, total: 20 },
  { id: "q3", subjectId: "english", subject: "English", date: "2026-06-03", score: 12, total: 20 },
  { id: "q4", subjectId: "english", subject: "English", date: "2026-06-18", score: 10, total: 20 },
  { id: "q5", subjectId: "science", subject: "Science", date: "2026-06-05", score: 18, total: 20 },
  { id: "q6", subjectId: "ict", subject: "ICT", date: "2026-06-10", score: 16, total: 20 },
  { id: "q7", subjectId: "math", subject: "Math", date: "2026-06-28", score: 19, total: 20 },
  { id: "q8", subjectId: "science", subject: "Science", date: "2026-06-22", score: 14, total: 20 },
];

const HABIT_LOGS = [
  { id: "h1", subjectId: "math", subject: "Math", date: "2026-06-14", studyHours: 2 },
  { id: "h2", subjectId: "english", subject: "English", date: "2026-06-17", studyHours: 0.5 },
  { id: "h3", subjectId: "science", subject: "Science", date: "2026-06-04", studyHours: 1.5 },
  { id: "h4", subjectId: "ict", subject: "ICT", date: "2026-06-09", studyHours: 1 },
  { id: "h5", subjectId: "math", subject: "Math", date: "2026-06-27", studyHours: 1.5 },
];

const AI_ACTIVITY = {
  notesUploaded: 18,
  aiNotesImproved: 11,
  einsteinSessions: 9,
  studyStreak: 6,
};

const TODAY_GOALS = [
  { id: "g1", label: "Review Physics — Motion & Force", done: true },
  { id: "g2", label: "Finish AI-generated Chemistry quiz", done: true },
  { id: "g3", label: "Improve Biology notes with AI", done: false },
];

const EXAM_READINESS = 82;

const PALETTE = [
  { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500", chart: "#2563eb" },
  { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500", chart: "#6366f1" },
  { bg: "bg-sky-50", text: "text-sky-700", dot: "bg-sky-500", chart: "#0ea5e9" },
  { bg: "bg-cyan-50", text: "text-cyan-700", dot: "bg-cyan-500", chart: "#06b6d4" },
];
const colorMap = new Map(INITIAL_SUBJECTS.map((s, i) => [s.id, PALETTE[i % PALETTE.length]]));
const getSubjectColor = (id) => colorMap.get(id) ?? PALETTE[0];

function percent(score, total) { return total === 0 ? 0 : (score / total) * 100; }

// ---------------------------------------------------------------------------
// Insight engine
// ---------------------------------------------------------------------------
function computeSubjectStats(quizResults, habitLogs, subjects) {
  return subjects.map((subject) => {
    const results = quizResults.filter((r) => r.subjectId === subject.id).sort((a, b) => a.date.localeCompare(b.date));
    const count = results.length;
    const avgPercent = count === 0 ? 0 : results.reduce((s, r) => s + percent(r.score, r.total), 0) / count;
    let trend = "flat";
    let diff = 0;
    if (count >= 2) {
      const mid = Math.floor(count / 2);
      const firstHalf = results.slice(0, mid || 1);
      const secondHalf = results.slice(mid || 1);
      const firstAvg = firstHalf.reduce((s, r) => s + percent(r.score, r.total), 0) / firstHalf.length;
      const secondAvg = secondHalf.length > 0 ? secondHalf.reduce((s, r) => s + percent(r.score, r.total), 0) / secondHalf.length : firstAvg;
      diff = secondAvg - firstAvg;
      if (diff > 3) trend = "up"; else if (diff < -3) trend = "down";
    }
    const studyHours = habitLogs.filter((h) => h.subjectId === subject.id).reduce((s, h) => s + h.studyHours, 0);
    return { subject: subject.name, avgPercent, count, trend, diff, studyHours };
  });
}

function generateInsights(quizResults, habitLogs, subjects, activity) {
  const stats = computeSubjectStats(quizResults, habitLogs, subjects).filter((s) => s.count > 0);
  const insights = [];
  if (stats.length === 0) return [{ icon: Sparkles, text: "Not enough data yet — take a quiz or open Einstein Classroom to see insights here.", tone: "neutral" }];

  const sorted = [...stats].sort((a, b) => b.avgPercent - a.avgPercent);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  if (strongest.subject !== weakest.subject) {
    insights.push({ icon: Trophy, text: `Your strongest subject is ${strongest.subject}, averaging ${strongest.avgPercent.toFixed(0)}% across recent quizzes.`, tone: "positive" });
    insights.push({ icon: Target, text: `${weakest.subject} needs the most attention — average score is ${weakest.avgPercent.toFixed(0)}%.`, tone: "warning" });
  }

  stats.forEach((s) => {
    if (s.trend === "up") insights.push({ icon: TrendingUp, text: `${s.subject} performance improved by ${Math.abs(s.diff).toFixed(0)}% recently — great progress!`, tone: "positive" });
    else if (s.trend === "down") insights.push({ icon: TrendingDown, text: `${s.subject} scores dipped this week — a quick revision with Einstein Classroom could help.`, tone: "warning" });
  });

  const topStudyHours = [...stats].sort((a, b) => b.studyHours - a.studyHours)[0];
  if (topStudyHours) insights.push({ icon: Clock3, text: `You spend most of your study time on ${topStudyHours.subject} (${topStudyHours.studyHours}h logged).`, tone: "neutral" });

  insights.push({ icon: NotebookPen, text: `You've uploaded ${activity.notesUploaded} notes this month, with ${activity.aiNotesImproved} improved by AI.`, tone: "neutral" });
  insights.push({ icon: Brain, text: `Einstein Classroom has guided ${activity.einsteinSessions} tutoring sessions — keep the momentum going.`, tone: "positive" });
  insights.push({ icon: Flame, text: `You're on a ${activity.studyStreak}-day study streak. Stay consistent to unlock better recall.`, tone: "positive" });

  return insights;
}

// ---------------------------------------------------------------------------
// Small animation helper
// ---------------------------------------------------------------------------
function useCountUp(target, durationMs = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let frame; const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);
  return value;
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------
function Hero({ quizResults, habitLogs, activity, overview }) {
  const totalQuizzes = quizResults.length;
  const avgScore = totalQuizzes === 0 ? 0 : quizResults.reduce((s, r) => s + percent(r.score, r.total), 0) / totalQuizzes;
  const totalHours = habitLogs.reduce((s, h) => s + h.studyHours, 0);
  const animatedAvg = useCountUp(avgScore);
  const animatedNotes = useCountUp(
    overview.total_notes
  );
  const animatedQuizzes = useCountUp(totalQuizzes);
  const animatedHours = useCountUp(totalHours);
  const stats = [
    { icon: TrendingUp, label: "Average Score", value: `${animatedAvg.toFixed(1)}%` },
    { icon: BookOpenCheck, label: "Total Notes", value: Math.round(animatedNotes).toString() },
    { icon: ListChecks, label: "Total Quizzes", value: Math.round(animatedQuizzes).toString() },
    { icon: Clock3, label: "Study Hours", value: `${animatedHours.toFixed(1)}h` },
  ];
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-600 to-sky-500 bg-[length:200%_200%] animate-gradient-slow p-8 md:p-12 shadow-lg shadow-blue-200">
      <div className="pointer-events-none absolute -top-16 -left-10 h-56 w-56 rounded-full bg-white/10 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-sky-300/20 blur-3xl animate-float-slow-delayed" />
      <div className="pointer-events-none absolute top-10 right-24 h-24 w-24 rounded-full bg-white/10 blur-2xl animate-float" />
      <div className="relative animate-fade-in-up">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5" /> Smart Notebook AI
        </span>
        <h1 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight text-white">Your Progress</h1>
        <p className="mt-2 max-w-xl text-blue-50/90">Here's your study progress — automatically tracked from Quiz Generator, Einstein Classroom, and your uploaded notes.</p>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-2xl">
          {stats.map(({ icon: Icon, label, value }, i) => (
            <div key={label} className="rounded-2xl bg-white/10 backdrop-blur-sm p-4 ring-1 ring-white/20 animate-fade-in-up" style={{ animationDelay: `${150 + i * 100}ms`, animationFillMode: "backwards" }}>
              <Icon className="h-5 w-5 text-white/80" />
              <p className="mt-2 text-2xl font-bold text-white tabular-nums">{value}</p>
              <p className="text-xs text-blue-50/80">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// AI Activity dashboard cards
// ---------------------------------------------------------------------------
function ActivityGrid({ quizResults, habitLogs, activity, overview }) {
  const totalQuizzes = quizResults.length;
  const avgScore = totalQuizzes === 0 ? 0 : quizResults.reduce((s, r) => s + percent(r.score, r.total), 0) / totalQuizzes;
  const totalStudyHours = habitLogs.reduce((s, h) => s + h.studyHours, 0);
  const bestQuiz = totalQuizzes === 0 ? null : [...quizResults].sort((a, b) => percent(b.score, b.total) - percent(a.score, a.total))[0];

  const cards = [
    { icon: UploadCloud, label: "Notes Uploaded", value: overview.total_notes.toString(), accent: "from-blue-600 to-blue-500" },
    { icon: Wand2, label: "AI Notes Improved", value: activity.aiNotesImproved.toString(), accent: "from-indigo-600 to-indigo-500" },
    { icon: Brain, label: "Einstein Sessions", value: activity.einsteinSessions.toString(), accent: "from-sky-600 to-sky-500" },
    { icon: ListChecks, label: "Quizzes Taken", value: totalQuizzes.toString(), accent: "from-blue-600 to-indigo-500" },
    { icon: Star, label: "Average Score", value: `${avgScore.toFixed(1)}%`, accent: "from-indigo-600 to-sky-500" },
    { icon: Trophy, label: "Best Quiz Score", value: bestQuiz ? `${bestQuiz.score}/${bestQuiz.total}` : "—", accent: "from-sky-600 to-blue-500" },
    { icon: Clock3, label: "Study Hours", value: `${totalStudyHours}h`, accent: "from-blue-600 to-sky-500" },
    { icon: Flame, label: "Study Streak", value: `${activity.studyStreak} days`, accent: "from-indigo-600 to-blue-500" },
  ];

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map(({ icon: Icon, label, value, accent }, i) => (
        <div key={label} className="group rounded-2xl border border-blue-100 bg-white/70 backdrop-blur-sm p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:shadow-blue-100 animate-fade-in-up" style={{ animationDelay: `${i * 70}ms`, animationFillMode: "backwards" }}>
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${accent} text-white shadow-sm`}>
            <Icon className="h-4.5 w-4.5" />
          </div>
          <p className="mt-3 text-xl font-bold text-slate-800 tabular-nums">{value}</p>
          <p className="text-xs text-slate-500">{label}</p>
        </div>
      ))}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Exam readiness — circular progress
// ---------------------------------------------------------------------------
function ExamReadiness({ value }) {
  const animated = useCountUp(value, 1200);
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated / 100) * circumference;

  let label = "Getting Started";
  if (value >= 80) label = "Ready for Final Exam";
  else if (value >= 60) label = "Almost There";
  else if (value >= 40) label = "Building Momentum";

  return (
    <div className="rounded-2xl border border-blue-100 bg-white/70 backdrop-blur-sm p-6 shadow-sm flex flex-col items-center justify-center text-center">
      <div className="flex items-center gap-2 mb-4 self-start">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-500 text-white"><Target className="h-4.5 w-4.5" /></div>
        <h2 className="text-base font-bold text-slate-800">Exam Readiness</h2>
      </div>
      <div className="relative h-40 w-40">
        <svg viewBox="0 0 160 160" className="h-40 w-40 -rotate-90">
          <circle cx="80" cy="80" r={radius} fill="none" stroke="#eff6ff" strokeWidth="12" />
          <circle
            cx="80" cy="80" r={radius} fill="none"
            stroke="url(#readinessGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.3s ease" }}
          />
          <defs>
            <linearGradient id="readinessGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-slate-800 tabular-nums">{Math.round(animated)}%</span>
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-blue-700">{label}</p>
      <p className="mt-1 text-xs text-slate-400">Based on quiz accuracy, study hours, and AI review activity.</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Today's goal
// ---------------------------------------------------------------------------
function TodaysGoal({ goals }) {
  const [items, setItems] = useState(goals);
  const completed = items.filter((g) => g.done).length;
  const pct = items.length === 0 ? 0 : (completed / items.length) * 100;

  function toggle(id) {
    setItems((prev) => prev.map((g) => (g.id === id ? { ...g, done: !g.done } : g)));
  }

  return (
    <div className="rounded-2xl border border-blue-100 bg-white/70 backdrop-blur-sm p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-sky-500 text-white"><Zap className="h-4.5 w-4.5" /></div>
        <h2 className="text-base font-bold text-slate-800">Today's Goal</h2>
      </div>
      <ul className="space-y-2.5">
        {items.map((g, i) => (
          <li key={g.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 80}ms`, animationFillMode: "backwards" }}>
            <button
              onClick={() => toggle(g.id)}
              className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition-all ${g.done ? "bg-blue-50 text-slate-500" : "bg-slate-50 text-slate-700 hover:bg-blue-50/60"}`}
            >
              {g.done ? <CheckCircle2 className="h-4.5 w-4.5 text-blue-600 shrink-0" /> : <Circle className="h-4.5 w-4.5 text-slate-300 shrink-0" />}
              <span className={g.done ? "line-through decoration-slate-300" : ""}>{g.label}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-5">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
          <span>Progress</span>
          <span className="font-semibold text-blue-700 tabular-nums">{completed} / {items.length} Completed</span>
        </div>
        <div className="h-2 w-full rounded-full bg-blue-50 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-700 ease-out" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Charts
// ---------------------------------------------------------------------------
function ChartsView({ quizResults, habitLogs }) {
  const dates = Array.from(new Set(quizResults.map((r) => r.date))).sort();
  const scoreData = dates.map((date) => {
    const row = { date };
    INITIAL_SUBJECTS.forEach((s) => {
      const match = quizResults.find((r) => r.date === date && r.subjectId === s.id);
      if (match) row[s.name] = Number(((match.score / match.total) * 100).toFixed(1));
    });
    return row;
  });
  const hoursData = INITIAL_SUBJECTS.map((s) => ({
    subject: s.name,
    hours: habitLogs.filter((h) => h.subjectId === s.id).reduce((sum, h) => sum + h.studyHours, 0),
    color: getSubjectColor(s.id).chart,
  }));

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="rounded-2xl border border-blue-100 bg-white/70 backdrop-blur-sm p-5 md:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><LineChartIcon className="h-4.5 w-4.5" /></div>
          <h2 className="text-base font-bold text-slate-800">Score Trend (%)</h2>
        </div>
        {scoreData.length === 0 ? <p className="text-sm text-slate-400">No data yet.</p> : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={scoreData}>
              <defs>
                {INITIAL_SUBJECTS.map((s) => {
                  const color = getSubjectColor(s.id).chart;
                  return <linearGradient key={s.id} id={`grad-${s.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>;
                })}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eff6ff" />
              <XAxis dataKey="date" fontSize={12} stroke="#94a3b8" />
              <YAxis domain={[0, 100]} fontSize={12} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #dbeafe", fontSize: 13 }} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" />
              {INITIAL_SUBJECTS.map((s) => {
                const color = getSubjectColor(s.id).chart;
                return <Area key={s.id} type="monotone" dataKey={s.name} stroke={color} fill={`url(#grad-${s.id})`} strokeWidth={2.5} connectNulls animationDuration={900} />;
              })}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="rounded-2xl border border-blue-100 bg-white/70 backdrop-blur-sm p-5 md:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600"><BarChart3 className="h-4.5 w-4.5" /></div>
          <h2 className="text-base font-bold text-slate-800">Study Time by Subject</h2>
        </div>
        {hoursData.every((h) => h.hours === 0) ? <p className="text-sm text-slate-400">No data yet.</p> : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={hoursData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eff6ff" />
              <XAxis dataKey="subject" fontSize={12} stroke="#94a3b8" />
              <YAxis fontSize={12} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #dbeafe", fontSize: 13 }} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} payload={[{ value: "Study Hours", type: "circle", color: "#2563eb" }]} />
              <Bar dataKey="hours" name="Study Hours" radius={[8, 8, 0, 0]} animationDuration={900}>
                {hoursData.map((entry) => <Cell key={entry.subject} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// AI Insights
// ---------------------------------------------------------------------------
const TONE_STYLES = {
  positive: "border-blue-400 bg-blue-50/60 text-slate-700",
  warning: "border-amber-400 bg-amber-50/60 text-slate-700",
  neutral: "border-indigo-300 bg-indigo-50/50 text-slate-700",
};

function AIInsights({ insights }) {
  return (
    <section className="rounded-2xl border border-blue-100 bg-white/70 backdrop-blur-sm p-5 md:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-sky-500 text-white"><Sparkles className="h-4.5 w-4.5" /></div>
        <h2 className="text-lg font-bold text-slate-800">AI Insights</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {insights.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className={`flex items-start gap-2.5 rounded-xl border-l-4 px-4 py-3 text-sm animate-fade-in-up ${TONE_STYLES[item.tone] || TONE_STYLES.neutral}`} style={{ animationDelay: `${index * 70}ms`, animationFillMode: "backwards" }}>
              <Icon className="h-4 w-4 mt-0.5 shrink-0 text-blue-600" />
              <span>{item.text}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
function ProgressTracking() {
  const [overview, setOverview] = useState({

    total_notes: 0,

    public_notes: 0,

    private_notes: 0

  })
  const quizResults = QUIZ_RESULTS;
  const habitLogs = HABIT_LOGS;
  
  useEffect(() => {

    const fetchOverview = async () => {

      const storedUser = JSON.parse(

        localStorage.getItem("user")

      )

      if (!storedUser) return

      const response = await fetch(

        `${API}/progress/overview?user_email=${storedUser.user.email}`

      )

      const data = await response.json()

      if (data.success) {

        setOverview(data.data)

      }

    }

    fetchOverview()

  }, [])

  const insights = useMemo(() => generateInsights(quizResults, habitLogs, INITIAL_SUBJECTS, AI_ACTIVITY), []);

  return (
    <MainLayout>
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out both; }
        @keyframes floatSlow { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(20px, -20px); } }
        .animate-float-slow { animation: floatSlow 8s ease-in-out infinite; }
        .animate-float-slow-delayed { animation: floatSlow 10s ease-in-out infinite reverse; }
        @keyframes floatGentle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-float { animation: floatGentle 6s ease-in-out infinite; }
        @keyframes gradientSlow { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-gradient-slow { animation: gradientSlow 12s ease infinite; }
      `}</style>
      <div className="container mx-auto max-w-6xl p-4 md:p-8 space-y-6">
        <Hero quizResults={quizResults} habitLogs={habitLogs} activity={AI_ACTIVITY} overview={overview} />
        <ActivityGrid quizResults={quizResults} habitLogs={habitLogs} activity={AI_ACTIVITY} overview={overview} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ExamReadiness value={EXAM_READINESS} />
          <div className="lg:col-span-2">
            <TodaysGoal goals={TODAY_GOALS} />
          </div>
        </div>
        <ChartsView quizResults={quizResults} habitLogs={habitLogs} />
        <AIInsights insights={insights} />
      </div>
    </div>
    </MainLayout>
  );
}

export default ProgressTracking