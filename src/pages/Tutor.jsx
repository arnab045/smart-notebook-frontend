import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_API_URL

const AITutorPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const noteText =
    location.state?.noteText || "";
  const noteTitle =
    location.state?.noteTitle || "";
  const noteContent =
    location.state?.noteContent || "";
  const [showAnimation, setShowAnimation] = useState(true);
  const [showKnockButton, setShowKnockButton] = useState(true);
  const [showEinsteinMessage, setShowEinsteinMessage] = useState(false);
  const [isKnocking, setIsKnocking] = useState(false);
  const [isDoorOpening, setIsDoorOpening] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [chalkboardMessages, setChalkboardMessages] = useState([
    {
      type: 'welcome',
      content: `Greetings, scholars! Let us unravel how process operations are handled on the silicon plane! 
      The operating system must coordinate CPU sharing amongst competitive processes.`
    }
  ]);

  const [isHandRaised, setIsHandRaised] = useState(false);
  const chalkboardRef = useRef(null); 
  const [chatHistory, setChatHistory] =
  useState(""); 

  const [activeNote, setActiveNote] =
    useState(noteTitle)

  const [activeNoteContent, setActiveNoteContent] =
    useState(noteContent)

  // Q&A Database
  const FAQ_TOPICS = [
    { id: "preemptive", keywords: ["preemptive", "pre-emption", "preempt"] },
    { id: "non-preemptive", keywords: ["non-preemptive", "non preemptive", "non-preempt"] },
    { id: "difference", keywords: ["difference", "compare", "versus", "vs", "differences"] },
    { id: "context-switch", keywords: ["context switch", "context", "switch", "overhead"] },
    { id: "round-robin", keywords: ["round robin", "rr", "quantum", "time slice"] },
    { id: "fcfs", keywords: ["fcfs", "first come", "convoy"] },
    { id: "priority", keywords: ["priority", "starvation", "aging"] }
  ];

  const OS_QA_DATABASE = {
    "preemptive": `Preemptive scheduling is an active CPU allocation strategy where the Operating System can interrupt a running process mid-execution. 
      
• Mechanism: A process is temporarily suspended and moved back to the 'Ready' queue if its time slice has expired, if a higher-priority process arrives, or an interrupt occurs.
• Examples: Round Robin (RR), Shortest Remaining Time First (SRTF), Preemptive Priority.
• Pros: Highly responsive; prevents any single process from monopolizing the CPU.
• Cons: High context-switching overhead; risk of synchronization issues or race conditions.`,

    "non-preemptive": `Non-preemptive scheduling is a cooperative strategy where a process keeps control of the CPU until it voluntary yields or terminates.
      
• Mechanism: Once allocated, the process runs without interruption. The OS cannot force it to pause. It only releases the CPU when it finishes or blocks on I/O.
• Examples: First-Come First-Served (FCFS), Shortest Job First (SJF) (non-preemptive version), Non-Preemptive Priority.
• Pros: Extremely simple to implement; very low overhead since context switches only happen on completion.
• Cons: Poor responsiveness; long processes can freeze interactive response (the 'Convoy Effect').`,

    "difference": `The core distinction lies in control and interruptibility:
      
1. CONTROL: In Preemptive systems, the OS takes charge and can halt processes. In Non-Preemptive systems, the running process itself determines when to yield.
2. OVERHEAD: Preemptive scheduling incurs heavy context-switching costs. Non-Preemptive has minimal overhead.
3. STARVATION: Preemptive models (like SRTF) can starve long-running jobs. Non-Preemptive systems can lock up on stuck infinite loops.
4. RESPONSE TIME: Preemptive is essential for multi-user, time-shared systems to guarantee fairness.`,

    "context-switch": `A context switch is the high-speed procedure of storing the state of an active process (its 'context') so it can be paused, and restoring another process state to resume execution.
      
• State Saved: CPU registers, Program Counter (PC), stack pointer, and memory management mappings.
• Saved Location: Saved into the Process Control Block (PCB) in kernel memory.
• Overhead Cost: It performs zero useful program work – it is pure administrative OS overhead. Excessive context switches hurt overall performance.`,

    "round-robin": `Round Robin (RR) is a popular preemptive scheduling algorithm designed specifically for time-sharing systems.
      
• How it works: The ready queue is treated as a circular list. The OS allocates the CPU to each process for a tiny slice of time, called a "Time Quantum" (usually 10 to 100 milliseconds).
• Time Quantum choice: If too large, RR behaves like FCFS. If too small, context-switch overhead dominates.`,

    "fcfs": `First-Come, First-Served (FCFS) is the simplest scheduling policy. It is strictly non-preemptive.
      
• Rule: The CPU executes processes in the exact absolute order they enter the 'Ready' queue.
• The Convoy Effect: Small, quick I/O-bound jobs get stuck behind one huge CPU-bound process, resulting in terrible average waiting times across the system.`,

    "priority": `Priority Scheduling assigns a numerical rank (priority) to each process. The CPU is always dispatched to the process with the highest priority level.
      
• Starvation: Low priority processes wait indefinitely.
• Solution (Aging): Dynamically increase the priority of long-waiting tasks in the ready queue gradually over time.`
  };

  const DEFAULT_ANSWER = `Ah, a brilliant question! Let us examine context. 
    
For Operating Systems and CPU scheduling, remember the golden rule:
• Preemptive = The OS has absolute authority to suspend a running process.
• Non-Preemptive = The process rules the CPU until it voluntarily yields.

Try asking specifically about "Preemptive", "Non-Preemptive", "Round Robin", or "FCFS"!`;

  // Clock state
  const [clockTime, setClockTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setClockTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Scroll chalkboard to bottom
  useEffect(() => {
    if (chalkboardRef.current) {
      chalkboardRef.current.scrollTop = chalkboardRef.current.scrollHeight;
    }
  }, [chalkboardMessages]);

  const getAnswer = (questionText) => {
    const searchStr = questionText.toLowerCase();
    for (const topic of FAQ_TOPICS) {
      for (const kw of topic.keywords) {
        if (searchStr.includes(kw)) {
          return OS_QA_DATABASE[topic.id];
        }
      }
    }
    return DEFAULT_ANSWER;
  };

  

  const handleSubmitQuestion = async () => {
  if (!question.trim()) return;

  const userQuestion = question;
  console.log("QUESTION =", userQuestion);
  console.log("NOTE TITLE =", activeNote);
  console.log("NOTE CONTENT =", activeNoteContent);
  setChalkboardMessages(prev => [
    ...prev,
    {
      type: "question",
      content: userQuestion
    }
  ]);

  setQuestion("");
  setIsModalOpen(false);
  setIsHandRaised(false);

  try {

    const res = await axios.post(
      "https://smart-notebook-backend.onrender.com/tutor-chat",
      {
        note_text: activeNoteContent,
        question: userQuestion,
        chat_history: chatHistory
      }
    );

    setChalkboardMessages(prev => [
      ...prev,
      {
        type: "answer",
        content: res.data.answer

      }
    ]);

    setChatHistory(prev =>

      prev +

      `\nUser: ${userQuestion}\n` +

      `AI: ${res.data.answer}\n`

    );

  } catch (error) {

    console.error(error);

    setChalkboardMessages(prev => [
      ...prev,
      {
        type: "answer",
        content:
          "⚠️ Failed to connect to AI Tutor."
      }
    ]);
  }
};

const handleRaiseHand = () => {
  setIsModalOpen(true);
  setIsHandRaised(true);
};

const handlePrepareExam = async () => {

  try {

    setExamPrepLoading(true);

    const res = await axios.post(
      "https://smart-notebook-backend.onrender.com/prepare-exam",
      {
        note_text: activeNoteContent
      }
    );

    setChalkboardMessages(prev => [
      ...prev,
      {
        type: "answer",
        content:
          "🎓 EXAM PREPARATION GUIDE\n\n" +
          res.data.result
      }
    ]);

    setShowExamPrep(true);

  } catch (error) {

    console.error(error);

    setChalkboardMessages(prev => [
      ...prev,
      {
        type: "answer",
        content:
          "⚠️ Failed to generate exam preparation guide."
      }
    ]);

  } finally {

    setExamPrepLoading(false);

  }

};


const handleExitClassroom = () => {

  const confirmExit = window.confirm(
    "Exit AI Classroom?"
  );

  if (confirmExit) {
    navigate("/dashboard");
  }

};



  const handlePresetQuestion = (q) => {
    setQuestion(q);
  };

  const getClockRotation = () => {
    const hrs = clockTime.getHours();
    const mins = clockTime.getMinutes();
    const secs = clockTime.getSeconds();
    return {
      hour: ((hrs % 12) * 30) + (mins * 0.5),
      minute: (mins * 6) + (secs * 0.1),
      second: secs * 6
    };
  };

  const rotations = getClockRotation();

  const showToast = (title, msg, colorClass = "bg-stone-800") => {
    alert(`${title}: ${msg}`);
  };

  const [examPrepLoading, setExamPrepLoading] =
  useState(false);

  const [showExamPrep, setShowExamPrep] =
    useState(false);

  // Handle Knock & Enter
  const handleKnockAndEnter = () => {
    setIsKnocking(true);
    
    setTimeout(() => {
      setIsKnocking(false);
      setIsDoorOpening(true);
      
      setTimeout(() => {
        setShowKnockButton(false);
        
        setTimeout(() => {
          setShowEinsteinMessage(true);
          
          setTimeout(() => {
            setShowAnimation(false);
          }, 2000);
        }, 500);
      }, 800);
    }, 500);
  };

  // Entry Animation
  if (showAnimation) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-stone-900 to-stone-800 door-perspective overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-100">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>

        <div className="relative w-[90%] max-w-5xl h-[85%] max-h-[600px] mx-auto mt-8">
          <div className="absolute inset-0 border-[16px] border-amber-900 rounded-2xl shadow-2xl"></div>
          <div className="absolute inset-0 border-[4px] border-amber-950/50 rounded-xl pointer-events-none"></div>

          {/* Left Door */}
          <div className={`absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-amber-800 to-amber-700 border-r-2 border-amber-950 flex flex-col items-end justify-center px-6 md:px-10 shadow-2xl z-10 transition-all duration-1000 ease-out ${isDoorOpening ? 'animate-door-open-left-realistic' : ''}`} style={{ transformOrigin: 'left', boxShadow: 'inset -5px 0 15px rgba(0,0,0,0.3), 5px 0 15px rgba(0,0,0,0.2)' }}>
            <div className="w-full max-w-[200px] h-[80%] bg-gradient-to-br from-amber-700 to-amber-800 border-4 border-amber-950 rounded-lg shadow-inner flex flex-col justify-start items-center p-5 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(90deg,transparent,transparent_10px,rgba(0,0,0,0.1)_10px,rgba(0,0,0,0.1)_12px)]"></div>
              <div className="absolute inset-3 border-2 border-amber-950/50 rounded-md"></div>
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-amber-950 bg-gradient-to-br from-sky-300/40 to-blue-400/30 shadow-inner flex items-center justify-center relative overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent rotate-12"></div>
                <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-white/20 to-transparent -rotate-12"></div>
                <div className="w-10 h-10 rounded-full bg-amber-200/50 blur-md"></div>
                <div className="absolute top-2 left-2 w-8 h-8 bg-white/20 rounded-full blur-sm"></div>
              </div>
              <div className="mt-5 bg-amber-50 text-amber-950 px-5 py-2.5 border-2 border-amber-950 rounded-lg shadow-md font-bold text-[10px] md:text-xs tracking-wider uppercase text-center handwritten-wall leading-tight transform -rotate-1 hover:rotate-0 transition-transform">
                <span className="text-amber-700">📚</span> Dr. Einstein<br />
                <span className="text-[8px] text-amber-600">Office of Theoretical Physics</span>
              </div>
              <div className="mt-3 bg-amber-900 text-amber-100 px-3 py-1 rounded-full text-[10px] font-mono border border-amber-700">Room 201</div>
            </div>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-14 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-full border-2 border-yellow-800 shadow-lg flex items-center justify-center">
              <div className="w-2 h-10 rounded-full bg-yellow-500"></div>
              <div className="absolute -left-1 w-3 h-8 bg-yellow-600 rounded-l-full"></div>
            </div>
            <div className="absolute left-0 top-12 w-4 h-8 bg-amber-950 rounded-r-md shadow-md"></div>
            <div className="absolute left-0 bottom-12 w-4 h-8 bg-amber-950 rounded-r-md shadow-md"></div>
          </div>

          {/* Right Door */}
          <div className={`absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-amber-800 to-amber-700 border-l-2 border-amber-950 flex flex-col items-start justify-center px-6 md:px-10 shadow-2xl z-10 transition-all duration-1000 ease-out ${isDoorOpening ? 'animate-door-open-right-realistic' : ''}`} style={{ transformOrigin: 'right', boxShadow: 'inset 5px 0 15px rgba(0,0,0,0.3), -5px 0 15px rgba(0,0,0,0.2)' }}>
            <div className="w-full max-w-[200px] h-[80%] bg-gradient-to-br from-amber-700 to-amber-800 border-4 border-amber-950 rounded-lg shadow-inner flex flex-col justify-start items-center p-5 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(90deg,transparent,transparent_10px,rgba(0,0,0,0.1)_10px,rgba(0,0,0,0.1)_12px)]"></div>
              <div className="absolute inset-3 border-2 border-amber-950/50 rounded-md"></div>
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-amber-950 bg-gradient-to-br from-sky-300/40 to-blue-400/30 shadow-inner flex items-center justify-center relative overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent rotate-12"></div>
                <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-white/20 to-transparent -rotate-12"></div>
                <div className="w-10 h-10 rounded-full bg-amber-200/50 blur-md"></div>
                <div className="absolute top-2 left-2 w-8 h-8 bg-white/20 rounded-full blur-sm"></div>
              </div>
              <div className="mt-5 bg-[#1b4d3e] text-[#fbfbf9] px-4 py-2 border-2 border-amber-950 rounded-lg shadow-md font-bold text-[10px] md:text-xs tracking-wider uppercase text-center font-mono leading-tight">
                OS SCHEDULING<br /><span className="text-yellow-400 text-[8px] font-sans">🔴 LIVE NOW</span>
              </div>
              <div className="mt-3 bg-amber-900/80 text-amber-200 px-3 py-1 rounded-full text-[9px] font-mono">Lecture Hall A</div>
            </div>
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-14 bg-gradient-to-l from-yellow-600 to-yellow-700 rounded-full border-2 border-yellow-800 shadow-lg flex items-center justify-center">
              <div className="w-2 h-10 rounded-full bg-yellow-500"></div>
              <div className="absolute -right-1 w-3 h-8 bg-yellow-600 rounded-r-full"></div>
            </div>
            <div className="absolute right-0 top-12 w-4 h-8 bg-amber-950 rounded-l-md shadow-md"></div>
            <div className="absolute right-0 bottom-12 w-4 h-8 bg-amber-950 rounded-l-md shadow-md"></div>
          </div>

          <div className="absolute left-1/2 top-0 w-1 h-full bg-amber-950/70 transform -translate-x-1/2 z-5"></div>
          <div className="absolute bottom-0 left-0 w-full h-3 bg-amber-950 rounded-b-lg shadow-inner"></div>
          <div className="absolute -top-8 left-0 w-full h-10 bg-amber-900 rounded-t-2xl shadow-lg flex items-center justify-center z-20">
            <div className="text-amber-200 text-xs font-mono tracking-wider">⚜️ DEPARTMENT OF COMPUTING & INFORMATION SYSTEM ⚜️</div>
          </div>

          {showKnockButton && (
            <div className="absolute bottom-[15%] left-1/2 transform -translate-x-1/2 z-30">
              <button onClick={handleKnockAndEnter} className={`group px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-2xl shadow-2xl border-2 border-amber-300 font-bold text-lg tracking-wider uppercase flex items-center gap-3 transform transition-all duration-200 hover:scale-105 active:scale-95 ${isKnocking ? 'animate-knock-real' : ''}`} style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)' }}>
                <span className="text-2xl group-hover:animate-bounce">🚪</span>
                <span className="font-serif">Knock to Enter</span>
                <span className="text-xl group-hover:animate-pulse">🔔</span>
              </button>
              <p className="text-center text-xs text-amber-800 mt-3 font-mono tracking-wider animate-pulse">⟡ Click to knock on the professor's door ⟡</p>
            </div>
          )}

          {isDoorOpening && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/10 rounded-full animate-dust-expand"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full animate-dust-expand delay-100"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/3 rounded-full animate-dust-expand delay-200"></div>
            </div>
          )}

          {isDoorOpening && !showEinsteinMessage && (
            <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 text-amber-800 font-mono text-sm animate-pulse z-20 bg-amber-100/80 px-4 py-2 rounded-full whitespace-nowrap">🔓 Door unlocking... Please wait</div>
          )}
        </div>

        {showEinsteinMessage && (
          <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md mx-4 transform animate-scale-in border-4 border-amber-400">
              <div className="w-28 h-28 mx-auto mb-4">
                <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
                  <path d="M40,70 C10,50 15,110 35,115 C10,135 45,160 65,150 C50,185 100,180 110,165 C125,185 175,175 160,145 C185,140 190,95 165,85 C190,55 160,25 135,45 C130,10 75,10 65,35 C45,10 20,40 40,70 Z" fill="#EAEAEA" stroke="#4A4A4A" strokeWidth="4"/>
                  <circle cx="55" cy="50" r="15" fill="#F4F4F4"/>
                  <circle cx="145" cy="60" r="18" fill="#F0F0F0"/>
                  <circle cx="100" cy="30" r="16" fill="#E2E2E2"/>
                  <circle cx="60" cy="110" r="12" fill="#FFCFB3" stroke="#4A4A4A" strokeWidth="3"/>
                  <circle cx="140" cy="110" r="12" fill="#FFCFB3" stroke="#4A4A4A" strokeWidth="3"/>
                  <path d="M68,110 C68,75 132,75 132,110 C132,138 115,152 100,152 C85,152 68,138 68,110 Z" fill="#FFE5D4" stroke="#4A4A4A" strokeWidth="4"/>
                  <path d="M93,100 C93,94 107,94 107,100 C107,107 100,112 100,112 C100,112 93,107 93,100 Z" fill="#FCB391" stroke="#4A4A4A" strokeWidth="2.5"/>
                  <circle cx="85" cy="100" r="18" fill="white" stroke="#3A3A3A" strokeWidth="3.5"/>
                  <circle cx="115" cy="100" r="18" fill="white" stroke="#3A3A3A" strokeWidth="3.5"/>
                  <path d="M103,100 L113,100" stroke="#3A3A3A" strokeWidth="3.5"/>
                  <circle cx="85" cy="100" r="4.5" fill="#2E2E2E"/>
                  <circle cx="115" cy="100" r="4.5" fill="#2E2E2E"/>
                  <path d="M72,83 C78,76 90,78 92,85" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round"/>
                  <path d="M128,83 C122,76 110,78 108,85" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round"/>
                  <path d="M75,124 C82,118 100,118 100,124 C100,118 118,118 125,124 C132,130 118,138 100,132 C82,138 68,130 75,124 Z" fill="#EAEAEA" stroke="#4A4A4A" strokeWidth="3.5"/>
                  <path d="M85,158 L100,163 L115,158 L118,172 L100,165 L82,172 Z" fill="#C23B22" stroke="#4A4A4A" strokeWidth="3"/>
                </svg>
              </div>
              <p className="text-3xl font-bold text-amber-700 mb-3 font-serif">Dr. Albert Einstein</p>
              <p className="text-xl text-stone-700 italic">"Welcome to your Digital Classroom!"</p>
              <div className="mt-5 flex justify-center gap-2">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-bounce"></div>
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-bounce delay-200"></div>
              </div>
              <p className="mt-4 text-xs text-stone-400 font-mono">Preparing your classroom...</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main Classroom View
  return (
    <div className="min-h-screen bg-stone-900 flex flex-col">
      {/* Header */}
      <header className="bg-stone-900 border-b border-stone-800 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1b4d3e] flex items-center justify-center border-2 border-stone-600 shadow">
            <span className="text-yellow-400 font-serif font-bold text-lg">E</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-stone-100 uppercase tracking-wider">AI Classroom Assistant</h1>
            <p className="text-xs text-stone-400 font-mono">Operating Systems: CPU Scheduling Algorithms</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={() => {
            setShowAnimation(true);
            setShowKnockButton(true);
            setShowEinsteinMessage(false);
            setIsKnocking(false);
            setIsDoorOpening(false);
          }} className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded border border-stone-700 text-xs font-medium transition-colors">
            🚪 Replay Entry
          </button>

          <button
            onClick={handleExitClassroom}
            className="px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white rounded border border-red-800 text-xs font-medium transition-colors"
          >
            🚪 Exit Classroom
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1b4d3e]/20 border border-[#1b4d3e]/60 rounded text-xs text-green-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            CLASSROOM LINK ACTIVE
          </div>
        </div>
      </header>

      {/* Main Classroom View */}
      <main className="flex-grow flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 bg-[#282725]">
        <div className="relative w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border-4 border-stone-800 flex flex-col bg-[#e3dcd2]" style={{ aspectRatio: '16/10', minHeight: '480px' }}>
          
          {/* Left Wall Items */}
          <div className="absolute left-4 lg:left-8 top-6 flex flex-col items-center gap-8 z-10 w-28 text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-stone-50 border-4 border-amber-900 rounded-full shadow-lg flex items-center justify-center relative">
              <div className="absolute w-1 h-3 bg-stone-800 top-0.5"></div>
              <div className="absolute w-3 h-1 bg-stone-800 right-0.5"></div>
              <div className="absolute w-1 h-3 bg-stone-800 bottom-0.5"></div>
              <div className="absolute w-3 h-1 bg-stone-800 left-0.5"></div>
              <div className="absolute w-1 h-4 bg-stone-900 rounded-full origin-bottom" style={{ top: '25%', transform: `rotate(${rotations.hour}deg)` }}></div>
              <div className="absolute w-0.5 h-6 bg-stone-700 rounded-full origin-bottom" style={{ top: '15%', transform: `rotate(${rotations.minute}deg)` }}></div>
              <div className="absolute w-px h-7 bg-red-500 origin-bottom" style={{ top: '10%', transform: `rotate(${rotations.second}deg)` }}></div>
              <div className="w-1.5 h-1.5 bg-amber-900 rounded-full z-10"></div>
            </div>

            <div className="w-24 h-24 md:w-28 md:h-28 bg-[#c89d7c] border-4 border-amber-950 rounded shadow-md p-1.5 relative flex flex-col justify-start items-center gap-1">
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:6px_6px]"></div>
              <div className="w-9 h-7 bg-yellow-200 border border-yellow-300 text-[6px] text-stone-800 rotate-[-6deg] shadow-sm p-0.5 font-bold uppercase">FCFS = Cooperative</div>
              <div className="w-10 h-8 bg-pink-300 border border-pink-400 text-[5px] text-stone-800 rotate-[8deg] shadow-sm p-0.5 font-bold uppercase mt-1">RR = TIME QUANTUM!</div>
              <div className="w-8 h-8 bg-cyan-200 border border-cyan-300 text-[5px] text-stone-800 rotate-[-3deg] shadow-sm p-0.5 font-bold uppercase mt-1">CONTEXT SWITCH</div>
            </div>
          </div>

          {/* Right Wall Items */}
          <div className="absolute right-4 lg:right-8 top-6 flex flex-col items-center gap-8 z-10 w-28 text-center">
            <div className="w-20 h-24 bg-white border-4 border-amber-900 rounded shadow-md relative p-1.5 flex flex-col justify-between">
              <div className="text-[7px] font-bold text-stone-800 font-mono border-b border-stone-200 pb-0.5 uppercase">READY Q (FIFO)</div>
              <div className="flex items-center justify-center gap-1.5 my-1">
                <div className="w-4 h-4 bg-emerald-200 border border-emerald-400 rounded text-[6px] font-bold text-stone-800 flex items-center justify-center">P1</div>
                <div className="w-4 h-4 bg-emerald-300 border border-emerald-400 rounded text-[6px] font-bold text-stone-800 flex items-center justify-center">P2</div>
                <div className="w-4 h-4 bg-emerald-400 border border-emerald-500 rounded text-[6px] font-bold text-stone-800 flex items-center justify-center">P3</div>
              </div>
              <div className="text-[5px] text-stone-500 text-center font-mono uppercase">Avg Waiting Time</div>
            </div>

            <div className="w-24 h-16 relative flex items-baseline justify-center">
              <div className="absolute bottom-0 w-full h-2.5 bg-amber-900 border-b border-amber-950 rounded shadow-sm"></div>
              <div className="bottom-2 flex items-end gap-0.5 z-10 px-1">
                <div className="w-7 h-7 bg-sky-200 border border-amber-900 rounded-full shadow-xs flex items-center justify-center relative overflow-hidden mr-1">
                  <div className="w-4 h-2 bg-emerald-400 rounded-full absolute top-1 left-1.5 rotate-12"></div>
                </div>
                <div className="w-2 h-7 bg-red-600 border border-red-800 rounded-xs rotate-[-3deg]"></div>
                <div className="w-2.5 h-6 bg-blue-600 border border-blue-800 rounded-xs"></div>
                <div className="w-2.5 h-6 bg-amber-500 border border-amber-700 rounded-xs rotate-[15deg]"></div>
              </div>
            </div>
          </div>

          {/* Green Chalkboard */}
          <div className="flex-grow flex flex-col justify-start items-center p-3 sm:p-5 relative z-10">
            <div className="relative w-[75%] max-w-2xl border-[10px] border-amber-900 rounded-xl shadow-[0_15px_30px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col" style={{ height: '52%', minHeight: '200px', maxHeight: '280px' }}>
              <div className="absolute inset-0 border-2 border-amber-950 pointer-events-none z-10"></div>
              
              <div 
                ref={chalkboardRef}
                className="w-full h-full p-4 sm:p-5 text-white overflow-y-auto font-serif text-sm relative scroll-smooth"
                style={{
                  backgroundColor: '#1b4d3e',
                  backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px), radial-gradient(rgba(255, 255, 255, 0.1) 2px, transparent 2px)`,
                  backgroundSize: '8px 8px, 16px 16px',
                  boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6)'
                }}
              >
                <div className="text-amber-200 font-bold text-center text-base sm:text-lg border-b border-white/20 pb-2 tracking-wide uppercase flex flex-col sm:flex-row items-center justify-center gap-1.5">
                  <span>✍️ CPU Scheduling Algorithms Classroom</span>
                  <span className="text-xs text-yellow-300 bg-stone-900/50 px-2 py-0.5 rounded font-mono font-normal">Active Class Session</span>
                </div>

                <div className="flex flex-col gap-5 text-stone-100 pr-1 mt-3">
                  {chalkboardMessages.map((msg, idx) => (
                    <div key={idx} className="flex flex-col gap-1.5 border-b border-dashed border-white/5 pb-4">
                      {msg.type === 'welcome' && (
                        <>
                          <span className="text-yellow-300 font-bold block" style={{ fontFamily: "'Coming Soon', cursive" }}>📌 DR. EINSTEIN'S SYLLABUS INTRO:</span>
                          <p className="leading-relaxed text-xs sm:text-sm pl-2" style={{ fontFamily: "'Coming Soon', cursive" }}>{msg.content}</p>
                          <div className="mt-2 text-xs text-stone-300/80 italic font-medium pl-2">
                            * Raise your hand to send a scheduling question. 
                            * Try asking about terms: <span className="text-yellow-400">Preemptive</span>, <span className="text-yellow-400">Non-Preemptive</span>, <span className="text-yellow-400">Difference</span>, <span className="text-yellow-400">Round Robin</span>, or <span className="text-yellow-400">FCFS</span>!
                          </div>
                        </>
                      )}
                      {msg.type === 'question' && (
                        <>
                          <span className="text-yellow-300 font-bold block" style={{ fontFamily: "'Coming Soon', cursive" }}>🙋‍♂️ QUESTION:</span>
                          <p className="text-xs sm:text-sm pl-2 italic" style={{ fontFamily: "'Coming Soon', cursive" }}>"{msg.content}"</p>
                        </>
                      )}
                      {msg.type === 'answer' && (
                        <>
                          <span className="text-amber-200 font-bold block mt-3" style={{ fontFamily: "'Coming Soon', cursive" }}>👨‍🏫 DR. EINSTEIN'S EXPLANATION:</span>
                          <p className="text-xs sm:text-sm pl-2 whitespace-pre-wrap font-medium leading-relaxed" style={{ fontFamily: "'Coming Soon', cursive" }}>{msg.content}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Einstein Teacher with Table in Front */}
            <div className="absolute left-[3%] bottom-[8%] flex flex-col items-center z-10">
              {/* Teacher's Table/Podium */}
              <div className="w-28 sm:w-36 h-16 sm:h-20 bg-gradient-to-b from-amber-800 to-amber-900 rounded-lg border-2 border-amber-950 shadow-lg mb-2 relative overflow-hidden">
                <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,rgba(0,0,0,0.1)_20px,rgba(0,0,0,0.1)_22px)]"></div>
                <div className="absolute top-0 left-0 w-full h-2 bg-amber-700 rounded-t-lg"></div>
                {/* Table details */}
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-amber-950 rounded-full opacity-50"></div>
                {/* Book on table */}
                <div className="absolute top-2 right-2 w-5 h-4 bg-red-800 rounded-sm border border-amber-700"></div>
                <div className="absolute top-2 left-2 w-4 h-3 bg-blue-800 rounded-sm border border-amber-700"></div>
              </div>
              
              {/* Einstein SVG */}
              <div className="w-36 sm:w-44 h-48 sm:h-56 select-none pointer-events-none animate-float">
                <svg className="w-full h-full drop-shadow-xl" viewBox="0 0 160 200" fill="none">
                  <rect x="66" y="150" width="13" height="35" fill="#4E3629" stroke="#33221A" strokeWidth="2"/>
                  <rect x="81" y="150" width="13" height="35" fill="#4E3629" stroke="#33221A" strokeWidth="2"/>
                  <rect x="62" y="185" width="18" height="10" rx="3" fill="#1C1917"/>
                  <rect x="80" y="185" width="18" height="10" rx="3" fill="#1C1917"/>
                  <path d="M52,115 L108,115 C112,125 113,155 108,162 L52,162 C47,155 48,125 52,115 Z" fill="#6B4E3D" stroke="#33221A" strokeWidth="2.5"/>
                  <path d="M72,115 L88,115 L80,126 Z" fill="#F4F4F4" stroke="#4A4A4A"/>
                  <circle cx="80" cy="120" r="3.5" fill="#C23B22" stroke="#33221A" strokeWidth="1.5"/>
                  <path d="M68,118 L76,122 L72,126 L66,124 Z" fill="#C23B22"/>
                  <path d="M92,118 L84,122 L88,126 L94,124 Z" fill="#C23B22"/>
                  <rect x="56" y="128" width="16" height="14" rx="2" fill="#503527" stroke="#33221A" strokeWidth="1.5"/>
                  
                  <path d="M98,124 C104,120 126,98 124,94 C120,90 102,112 96,118 Z" fill="#6B4E3D" stroke="#33221A" strokeWidth="2"/>
                  <circle cx="123" cy="94" r="5" fill="#FFE5D4" stroke="#33221A" strokeWidth="1.5"/>
                  <path d="M121,95 L158,54" stroke="#9A3412" strokeWidth="4" strokeLinecap="round"/>
                  <path d="M156,56 L159,53" stroke="#FDE047" strokeWidth="4" strokeLinecap="round"/>
                  
                  <path d="M28,65 C5,45 8,100 24,105 C3,121 34,142 50,133 C38,165 78,160 86,146 C98,165 138,155 126,128 C146,123 150,83 130,74 C150,47 126,20 106,38 C102,6 58,6 50,29 C34,6 13,33 28,65 Z" fill="#EAEAEA" stroke="#33221A" strokeWidth="3"/>
                  <circle cx="41" cy="48" r="11" fill="#F4F4F4"/>
                  <circle cx="119" cy="56" r="13" fill="#F0F0F0"/>
                  <circle cx="45" cy="100" r="9" fill="#FFCFB3" stroke="#33221A" strokeWidth="2"/>
                  <circle cx="115" cy="100" r="9" fill="#FFCFB3" stroke="#33221A" strokeWidth="2"/>
                  <path d="M52,100 C52,65 108,65 108,100 C108,125 94,138 80,138 C66,138 52,125 52,100 Z" fill="#FFE5D4" stroke="#33221A" strokeWidth="3"/>
                  
                  {/* BIG NOSE */}
                  <path d="M74,103 C74,96 86,96 86,103 C86,109 80,114 80,114 C80,114 74,109 74,103 Z" fill="#E8A87C" stroke="#33221A" strokeWidth="2.5"/>
                  <path d="M78,103 L82,103" stroke="#33221A" strokeWidth="1.5"/>
                  
                  <circle cx="68" cy="91" r="14" fill="#FFFFFF" stroke="#22252A" strokeWidth="2.5"/>
                  <circle cx="92" cy="91" r="14" fill="#FFFFFF" stroke="#22252A" strokeWidth="2.5"/>
                  <path d="M82,91 L88,91" stroke="#22252A" strokeWidth="2.5"/>
                  <circle cx="68" cy="91" r="3.5" fill="#1C1917"/>
                  <circle cx="92" cy="91" r="3.5" fill="#1C1917"/>
                  <path d="M56,76 C62,70 72,72 74,78" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round"/>
                  <path d="M104,76 C98,70 88,72 86,78" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round"/>
                  <path d="M60,111 C66,106 80,106 80,111 C80,106 94,106 100,111 C105,116 94,123 80,118 C66,123 55,116 60,111 Z" fill="#FCFCFC" stroke="#33221A" strokeWidth="2.5"/>
                </svg>
              </div>
            </div>

            {/* Formulas on Wall */}
            <div className="absolute left-[34%] bottom-[13%] flex items-center gap-12 text-[#5a5441]/85 font-semibold text-xs tracking-wide pointer-events-none select-none z-0" style={{ fontFamily: "'Architects Daughter', cursive" }}>
              <div className="flex flex-col items-start leading-normal">
                <span className="text-[10px] uppercase font-mono opacity-65">FCFS Policy:</span>
                <span>Waiting Time (W_i = T_start - T_arr)</span>
              </div>
              <div className="flex flex-col items-center border-l-2 border-[#5a5441]/20 pl-6 leading-normal">
                <span className="text-[10px] uppercase font-mono opacity-65">Time Quantum limit:</span>
                <span>(q → ∞ implies FCFS)</span>
              </div>
              <div className="flex flex-col items-start border-l-2 border-[#5a5441]/20 pl-6 leading-normal">
                <span className="text-[10px] uppercase font-mono opacity-65">Context Switching Cost:</span>
                <span className="text-rose-800/60 font-bold">δ(Overhead) ≫ 0</span>
              </div>
            </div>

            {/* Students Benches - 2x SIZE */}
            <div className="absolute bottom-0 inset-x-0 h-[28%] bg-transparent flex justify-around items-end px-6 pointer-events-none select-none z-20">
              {/* Student 1 - 2x size */}
              <div className="flex flex-col items-center w-48 shrink-0 transition-all duration-300 transform translate-y-3 hover:translate-y-1">
                <svg className="w-28 h-28" viewBox="0 0 100 100" fill="none">
                  <circle cx="50" cy="46" r="23" fill="#5C3A21" stroke="#3C1A01" strokeWidth="3"/>
                  <circle cx="34" cy="38" r="11" fill="#5C3A21"/>
                  <circle cx="66" cy="38" r="11" fill="#5C3A21"/>
                  <circle cx="40" cy="54" r="12" fill="#5C3A21"/>
                  <circle cx="60" cy="54" r="12" fill="#5C3A21"/>
                  <circle cx="50" cy="32" r="13" fill="#6E442B"/>
                  <rect x="42" y="65" width="16" height="15" fill="#FFE3D1" stroke="#3C1A01" strokeWidth="2.5"/>
                  <path d="M22,80 C30,73 70,73 78,80 L82,100 L18,100 Z" fill="#0EA5E9" stroke="#3C1A01" strokeWidth="3"/>
                  <path d="M28,80 L29,100" stroke="#EAB308" strokeWidth="3.5" strokeLinecap="round"/>
                  <path d="M72,80 L71,100" stroke="#EAB308" strokeWidth="3.5" strokeLinecap="round"/>
                </svg>
                <div className="w-56 h-10 bg-[#B45309] rounded-t-lg border-t border-r border-l border-amber-950 flex justify-center items-start shadow-md py-1">
                  <div className="w-24 h-2 bg-[#4E3629] rounded opacity-40"></div>
                </div>
              </div>

              {/* Student 2 (Center) - 2x size with Raised Hand */}
              <div className="flex flex-col items-center w-56 shrink-0 transition-all duration-300 transform translate-y-3 hover:translate-y-1 relative">
                <div className={`absolute left-1/2 -translate-x-1/2 top-[-88px] transition-all duration-500 ease-in-out ${isHandRaised ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <svg className="h-32 w-20 overflow-visible" viewBox="0 0 40 80" fill="none">
                    <path d="M20,70 L20,30" stroke="#FDBA74" strokeWidth="9" strokeLinecap="round"/>
                    <path d="M20,72 L20,48" stroke="#EC4899" strokeWidth="11" strokeLinecap="round"/>
                    <circle cx="20" cy="22" r="9" fill="#FDBA74" stroke="#451A03" strokeWidth="2.5"/>
                    <rect x="18" y="9" width="4" height="12" rx="2" fill="#FDBA74" stroke="#451A03" strokeWidth="2"/>
                    <rect x="13" y="12" width="3.5" height="10" rx="1.5" fill="#FDBA74" stroke="#451A03" strokeWidth="1.5"/>
                    <rect x="23.5" y="12" width="3.5" height="10" rx="1.5" fill="#FDBA74" stroke="#451A03" strokeWidth="1.5"/>
                  </svg>
                </div>
                <svg className="w-28 h-28 z-10" viewBox="0 0 100 100" fill="none">
                  <circle cx="21" cy="46" r="12" fill="#EE7623" stroke="#2D1100" strokeWidth="2.5"/>
                  <circle cx="79" cy="46" r="12" fill="#EE7623" stroke="#2D1100" strokeWidth="2.5"/>
                  <rect x="25" y="42" width="4" height="8" rx="1" fill="#F43F5E"/>
                  <rect x="71" y="42" width="4" height="8" rx="1" fill="#F43F5E"/>
                  <circle cx="50" cy="46" r="21" fill="#EE7623" stroke="#2D1100" strokeWidth="3"/>
                  <rect x="42" y="65" width="16" height="15" fill="#FFE5D9" stroke="#2D1100" strokeWidth="2.5"/>
                  <path d="M20,80 C28,73 72,73 80,80 L84,100 L16,100 Z" fill="#EC4899" stroke="#2D1100" strokeWidth="3"/>
                </svg>
                <div className="w-64 h-10 bg-[#B45309] rounded-t-lg border-t border-r border-l border-amber-950 flex justify-center items-start shadow-md py-1 relative">
                  <div className="w-32 h-6 bg-white border border-stone-400 shadow-xs absolute top-[-3px] flex justify-between px-0.5 pointer-events-none shadow-inner">
                    <div className="w-14 h-full border-r border-dashed border-sky-200"></div>
                    <div className="w-14 h-full"></div>
                  </div>
                </div>
              </div>

              {/* Student 3 - 2x size */}
              <div className="flex flex-col items-center w-48 shrink-0 transition-all duration-300 transform translate-y-3 hover:translate-y-1">
                <svg className="w-28 h-28" viewBox="0 0 100 100" fill="none">
                  <path d="M26,30 C30,10 70,10 74,30 C82,45 84,65 78,74 C75,70 70,68 64,70 C50,65 40,70 34,68 C22,65 18,45 26,30 Z" fill="#F59E0B" stroke="#451A03" strokeWidth="3"/>
                  <rect x="42" y="65" width="16" height="15" fill="#FFE4D6" stroke="#451A03" strokeWidth="2.5"/>
                  <path d="M22,81 C30,75 70,75 78,81 L82,100 L18,100 Z" fill="#10B981" stroke="#451A03" strokeWidth="3"/>
                  <circle cx="50" cy="22" r="4.5" fill="#EF4444"/>
                </svg>
                <div className="w-56 h-10 bg-[#B45309] rounded-t-lg border-t border-r border-l border-amber-950 flex justify-center items-start shadow-md py-1">
                  <div className="w-16 h-2 bg-yellow-400 rotate-[12deg] rounded-full border border-stone-800"></div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 inset-x-0 h-[10%] bg-amber-950 border-t border-amber-900 flex justify-center items-center shadow-inner z-0 pointer-events-none"></div>
          </div>

          {/* Floating Raise Hand Button - Near the Board */}
          <div className="absolute bottom-[35%] right-[10%] z-30">
            <button 
              onClick={handleRaiseHand}
              className="group px-5 py-3 bg-yellow-500 hover:bg-yellow-400 text-stone-950 rounded-2xl shadow-[0_6px_20px_rgba(234,179,8,0.5)] border-2 border-stone-900 font-bold text-sm tracking-wider uppercase flex items-center gap-2 transform transition-all duration-200 hover:scale-105 active:scale-95 animate-pulse-slow"
            >
              <span className="text-xl group-hover:animate-bounce">🙋‍♂️</span>
              <span>Raise Hand</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer Buttons */}
      <footer className="bg-stone-900 border-t border-stone-800 p-4 md:p-6 flex flex-col items-center gap-4">
        <div className="flex flex-wrap justify-center gap-3 w-full max-w-2xl">
          <button 
            onClick={handlePrepareExam}
            disabled={examPrepLoading}
            className="flex-1 min-w-[150px] px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-xs tracking-wider uppercase shadow-md border-b-4 border-indigo-800 transform hover:translate-y-[-2px] active:translate-y-[2px] transition-all hover:scale-105 disabled:opacity-50"
          >
            {examPrepLoading
              ? "Generating..."
              : "🎓 Prepare for Exam"}
          </button>
          <button 
            onClick={() => showToast("Module Summary", "Classroom notes, ready queue layout, and timeline formulae have been compiled.", "bg-emerald-600")}
            className="flex-1 min-w-[150px] px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-xs tracking-wider uppercase shadow-md border-b-4 border-emerald-800 transform hover:translate-y-[-2px] active:translate-y-[2px] transition-all hover:scale-105"
          >
            📜 Summarize this Page
          </button>
          <button 
            onClick={handleRaiseHand}
            className="flex-1 min-w-[150px] px-5 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-semibold text-xs tracking-wider uppercase shadow-md border-b-4 border-amber-800 transform hover:translate-y-[-2px] active:translate-y-[2px] transition-all hover:scale-105"
          >
            💬 Ask Yourselves
          </button>
        </div>
        <p className="text-[10px] sm:text-xs text-stone-500 font-mono text-center">
          🎓 AI Classroom | Raise your hand to ask Professor Einstein a question!
        </p>
      </footer>

      {/* Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-stone-900 border-2 border-stone-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden transform animate-scale-in">
            <div className="bg-gradient-to-r from-[#1b4d3e] to-stone-800 px-6 py-4 border-b border-stone-700 flex justify-between items-center">
              <h3 className="font-bold text-stone-100 flex items-center gap-2 text-sm uppercase tracking-wider">
                <span className="animate-wave">🙋‍♀️</span> Ask Dr. Einstein a Question
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-200 text-xl transition-colors">&times;</button>
            </div>

            <div className="p-6">
              <p className="text-xs text-stone-400 mb-4 font-sans">
                Provide keywords like <strong className="text-yellow-400 font-mono">preemptive</strong>, <strong className="text-yellow-400 font-mono">round robin</strong>, <strong className="text-yellow-400 font-mono">FCFS</strong>, or <strong className="text-yellow-400 font-mono">context switch</strong>.
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-[10px] text-stone-400 uppercase tracking-wider flex items-center font-bold mr-1">Suggestions:</span>
                <button onClick={() => handlePresetQuestion('What is Preemptive Scheduling?')} className="text-[10px] px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-yellow-300 rounded border border-stone-700 font-semibold transition-all hover:scale-105">
                  Preemptive
                </button>
                <button onClick={() => handlePresetQuestion('Explain Non-Preemptive Scheduling')} className="text-[10px] px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-yellow-300 rounded border border-stone-700 font-semibold transition-all hover:scale-105">
                  Non-Preemptive
                </button>
                <button onClick={() => handlePresetQuestion('What is the main Difference between preemptive and non-preemptive?')} className="text-[10px] px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-yellow-300 rounded border border-stone-700 font-semibold transition-all hover:scale-105">
                  Differences
                </button>
                <button onClick={() => handlePresetQuestion('How does Round Robin scheduling work?')} className="text-[10px] px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-yellow-300 rounded border border-stone-700 font-semibold transition-all hover:scale-105">
                  Round Robin
                </button>
                <button onClick={() => handlePresetQuestion('Tell me about FCFS scheduling')} className="text-[10px] px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-yellow-300 rounded border border-stone-700 font-semibold transition-all hover:scale-105">
                  FCFS Policy
                </button>
              </div>

              <textarea 
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={4} 
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-4 py-3 text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm font-sans transition-all focus:scale-[1.01]" 
                placeholder="Type your OS Scheduling question here..."
              />
            </div>

            <div className="bg-stone-950/40 px-6 py-4 border-t border-stone-800 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all hover:scale-105">
                Cancel
              </button>
              <button onClick={handleSubmitQuestion} className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-stone-950 rounded-xl text-xs font-bold tracking-wider uppercase shadow-md transition-all hover:scale-105">
                Send Question
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Architects+Daughter&family=Caveat:wght@700&family=Inter:wght@400;500;600;700&family=Coming+Soon&display=swap');
        
        @keyframes floating {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(0.5deg); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes doorOpenLeftRealistic {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(-115deg); }
        }
        
        @keyframes doorOpenRightRealistic {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(115deg); }
        }
        
        @keyframes knockReal {
          0%, 100% { transform: translateX(0) scale(1); }
          20% { transform: translateX(-4px) scale(0.98); }
          40% { transform: translateX(4px) scale(0.98); }
          60% { transform: translateX(-2px) scale(0.99); }
          80% { transform: translateX(2px) scale(0.99); }
        }
        
        @keyframes dustExpand {
          0% { opacity: 0.6; transform: translate(-50%, -50%) scale(0.5); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(4); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(15deg); }
          75% { transform: rotate(-10deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.02); }
        }
        
        .animate-float {
          animation: floating 4s ease-in-out infinite;
        }
        
        .animate-door-open-left-realistic {
          animation: doorOpenLeftRealistic 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .animate-door-open-right-realistic {
          animation: doorOpenRightRealistic 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .animate-knock-real {
          animation: knockReal 0.4s ease-in-out 2;
        }
        
        .animate-dust-expand {
          animation: dustExpand 0.8s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
        
        .animate-wave {
          animation: wave 1s ease-in-out infinite;
          display: inline-block;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        
        .door-perspective {
          perspective: 1800px;
        }
        
        .group-hover\\:animate-bounce:hover {
          animation: bounce 0.5s ease-in-out;
        }
        
        .handwritten-wall {
          font-family: 'Architects Daughter', cursive;
        }
      `}</style>
    </div>
  );
};

export default AITutorPage;