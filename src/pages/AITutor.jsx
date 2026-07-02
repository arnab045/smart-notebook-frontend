import React, { useState, useRef, useEffect } from 'react';
import { useParams } from "react-router-dom"

const AITutor = () => {
  const { id } = useParams()

  const API = import.meta.env.VITE_API_URL

  const [note, setNote] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [conversationHistory, setConversationHistory] = useState([])

  const scrollerRef = useRef(null);
  const chatInputRef = useRef(null);

  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);
  
  useEffect(() => {
      loadNote()
  }, [])

  const loadNote = async () => {

    try {

        const response = await fetch(
            `${API}/note/${id}`
        )

        const data = await response.json()

        if (data.success) {

            setNote(data.note)

        }

    } catch (error) {

        console.error(error)

    }

}

  const handleSendMessage = async () => {

    const text = inputValue.trim();

    if (text === "") return;

    // User message
    const newMessage = {

      id: Date.now(),

      type: "user",

      content: text

    };

    setMessages(prev => [...prev, newMessage]);

    setInputValue("");

    if (chatInputRef.current) {

      chatInputRef.current.style.height = "auto";

    }

    // Typing animation ON
    setIsTyping(true);

    try {

      const response = await fetch(
        `${API}/ai-tutor`,
        {

          method: "POST",

          headers: {

            "Content-Type": "application/json"

          },

          body: JSON.stringify({

            question: text,

            note_title: note?.title,

            note_content: note?.content,

            history: conversationHistory

          })

        }
      );

      const data = await response.json();

      setIsTyping(false);

      if (data.success) {

        setMessages(prev => [

          ...prev,

          {

            id: Date.now() + 1,

            type: "ai",

            content: data.answer

          }

        ]);

        setConversationHistory(prev => [

            ...prev,

            {

                role: "user",

                content: text

            },

            {

                role: "assistant",

                content: data.answer

            }

        ]);

      }

    }

    catch (error) {

      console.error(error);

      setIsTyping(false);

      alert("Tutor failed");

    }

  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="smart-notebook-container">
      {/* Top AppBar */}
      <header className="sticky top-0 z-50 flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-16 bg-surface/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
        <div className="flex items-center gap-4">
          <span 
            className="material-symbols-outlined text-primary cursor-pointer lg:hidden" 
            onClick={toggleSidebar}
          >
            menu
          </span>
          <h1 className="text-headline-md font-headline-md font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Smart Notebook AI
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-6 items-center">
            <nav className="flex gap-4">
              <a className="text-on-surface-variant hover:text-primary transition-all duration-200 text-label-sm font-label-sm" href="#">
                Dashboard
              </a>
              <a className="text-on-surface-variant hover:text-primary transition-all duration-200 text-label-sm font-label-sm" href="#">
                My Notes
              </a>
              <a className="text-primary font-bold text-label-sm font-label-sm" href="#">
                AI Tutor
              </a>
            </nav>
          </div>
          <img 
            alt="User profile avatar" 
            className="w-8 h-8 rounded-full border border-primary/20" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTXKzHHf7dLFc2hl8Jpn4g6rFgsjQ5gaBIVRkNgLEkHjGGeRZYZS1Q8QtglEhWqQAj99zBaiYlfnpdjI_PHdx_-c5clTOPEMs_ER8r611vhy4wS1PnhX19iW2R-LvqMrezV5tgLIlgjZZ_EpDcSWPA4LdFPZelOyVJ58PivrEkUbBHw3DESqimJhLBmWJowSmE_DPmp4ZxfWiqSVe_pK-O1M29xvNzg-QZHJp2xzZiCYDy9pO9C667DCIvssAzx1fiBtZBxct9IGD_"
          />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Persistent History Sidebar */}
        <aside 
          className={`sidebar-transition w-72 h-full bg-surface/90 border-r border-white/10 p-6 flex-col gap-6 ${
            isSidebarOpen ? 'flex fixed inset-0 z-[60]' : 'hidden lg:flex'
          }`}
          id="history-sidebar"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-headline-md font-headline-md text-primary">History</h3>
            <button className="material-symbols-outlined text-outline hover:text-primary transition-colors">
              history
            </button>
          </div>
          {isSidebarOpen && (
            <button 
              className="absolute top-4 right-4 lg:hidden text-outline hover:text-primary"
              onClick={toggleSidebar}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
          <div className="flex-1 overflow-y-auto space-y-4">
            <div className="group cursor-pointer p-3 rounded-xl bg-primary-container/10 border border-primary/5 hover:bg-primary-container/20 transition-all">
              <p className="text-label-sm font-label-sm text-primary uppercase mb-1">Active Now</p>
              <p className="text-body-md font-medium text-on-surface truncate">Operating Systems Exam Prep</p>
            </div>
            <div className="cursor-pointer p-3 rounded-xl hover:bg-surface-variant/50 transition-all">
              <p className="text-body-md text-on-surface-variant truncate">Summarizing Chapter 4: Calculus</p>
            </div>
            <div className="cursor-pointer p-3 rounded-xl hover:bg-surface-variant/50 transition-all">
              <p className="text-body-md text-on-surface-variant truncate">Data Structures &amp; Algorithms</p>
            </div>
          </div>
          <button className="flex items-center gap-2 p-4 rounded-xl bg-secondary text-on-secondary font-bold hover:opacity-90 transition-all shadow-lg">
            <span className="material-symbols-outlined">add</span>
            <span className="text-label-sm">New Session</span>
          </button>
        </aside>

        {/* Main Chat Canvas */}
        <main className="flex-1 flex flex-col h-screen relative bg-gradient-to-br from-background to-surface-container-low overflow-hidden">
          {/* Context-aware Header */}
          <div className="p-4 md:p-6 border-b border-white/20 glass-card z-10">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center ai-glow">
                  <span className="material-symbols-outlined text-white" data-weight="fill">
                    psychology
                  </span>
                </div>
                <div>
                  <h2 className="text-body-lg font-bold text-on-surface">AI Study Partner</h2>
                  <p className="text-label-sm text-on-surface-variant flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Context: {note?.title || "Loading..."}
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 p-2 px-4 rounded-full bg-surface-container-highest border border-white/20">
                <span className="material-symbols-outlined text-primary text-[20px]">description</span>
                <span className="text-label-sm text-primary">{note?.title || "Loading..."}</span>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div
              ref={scrollerRef}
              className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 pb-56"
          >
            <div className="max-w-4xl mx-auto space-y-8">
              {messages.map((message) => (
                <div key={message.id}>
                  {message.type === 'ai' ? (
                    <div className="flex gap-4 items-start animate-fade-in">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex-shrink-0 flex items-center justify-center border border-indigo-100">
                        <span className="material-symbols-outlined text-primary text-[18px]" data-weight="fill">
                          smart_toy
                        </span>
                      </div>
                      <div className="space-y-4 max-w-[85%]">
                        <div className="message-bubble-ai p-5 rounded-2xl rounded-tl-none shadow-sm">
                          <p className="text-body-md text-on-surface leading-relaxed mb-4">

                              {message.content}

                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4 items-start justify-end">
                      <div className="bg-primary text-on-primary p-5 rounded-2xl rounded-tr-none shadow-md max-w-[80%]">
                        <p className="text-body-md leading-relaxed">{message.content}</p>
                      </div>
                      <img 
                        alt="User" 
                        className="w-8 h-8 rounded-full border border-primary/20" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOGZzqvh5Qek1QOo5CcmIr-uTbzw_bpIrCt9XVvpaZ7yS2oJqrYQw0D6gE7gXVxcPdXLdgIIbn8Njl9BVpvGnFcwjHrHzd9sOQD-dt1mMURj5ymfAmBTTGpcbY55knTIie_vJ93WSpE2F4hSo9eKCnlhaC3DbZO0C_czuAtp_Isdk_CbLJ3Lld9yDCe4zX9cpp0BJrSJjka4qtTiXn-Y3DkMhsXLijsf833SP227aqn7Yr0h0T2GprM6szIOh9VR6RkiSJziILOs_S"
                      />
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}

              {isTyping && (

                <div className="flex gap-4 items-start animate-fade-in">

                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex-shrink-0 flex items-center justify-center border border-indigo-100">

                    <span
                      className="material-symbols-outlined text-primary text-[18px]"
                      data-weight="fill"
                    >
                      smart_toy
                    </span>

                  </div>

                  <div className="bg-white rounded-2xl rounded-tl-none shadow-sm border border-indigo-100 px-5 py-4">

                      <p className="text-sm text-gray-600 mb-3">

                          🤖 Tutor is thinking...

                      </p>
                      <p className="text-xs text-gray-400 mt-2">

                          Reading: {note?.title}

                      </p>

                      <div className="flex gap-2">

                          <div className="w-2 h-2 rounded-full bg-indigo-500 typing-dot"></div>

                          <div className="w-2 h-2 rounded-full bg-indigo-500 typing-dot"></div>

                          <div className="w-2 h-2 rounded-full bg-indigo-500 typing-dot"></div>

                      </div>

                  </div>

              </div>

              )}
            </div>
          </div>

          {/* Suggestion Chips & Input Area */}
          <div className="sticky bottom-0 p-4 md:p-8 pt-0 bg-gradient-to-t from-background via-background to-transparent z-20">
            <div className="max-w-4xl mx-auto space-y-4">
              {/* Suggested Chips */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
                <button className="whitespace-nowrap px-4 py-2 rounded-full border border-primary/20 bg-white/80 text-primary text-label-sm hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">quiz</span> 
                  Prepare for exam
                </button>
                <button className="whitespace-nowrap px-4 py-2 rounded-full border border-primary/20 bg-white/80 text-primary text-label-sm hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">auto_stories</span> 
                  Summarize this page
                </button>
                <button className="whitespace-nowrap px-4 py-2 rounded-full border border-primary/20 bg-white/80 text-primary text-label-sm hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">spellcheck</span> 
                  Check my reasoning
                </button>
              </div>

              {/* Input Console */}
              <div className="relative glass-card rounded-2xl p-2 shadow-xl border border-white/40 ring-1 ring-primary/5 group focus-within:ring-primary/20 transition-all">
                <div className="flex items-end gap-2 px-2 py-2">
                  <button className="p-2 rounded-xl text-outline-variant hover:text-primary hover:bg-primary/5 transition-all">
                    <span className="material-symbols-outlined">attach_file</span>
                  </button>
                  <textarea 
                    ref={chatInputRef}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-body-md text-on-surface py-2 resize-none max-h-48 scrollbar-hide" 
                    placeholder="Ask your tutor anything..." 
                    rows="1"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                  />
                  <div className="flex items-center gap-2 pb-1">
                    <button className="p-2 rounded-xl text-outline-variant hover:text-primary hover:bg-primary/5 transition-all">
                      <span className="material-symbols-outlined">mic</span>
                    </button>
                    <button 
                      className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50" 
                      onClick={handleSendMessage}
                    >
                      <span className="material-symbols-outlined">arrow_upward</span>
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-center text-[10px] text-on-surface-variant/60 uppercase tracking-widest">
                Powered by Smart Notebook AI • v4.2 Pro
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex lg:hidden justify-around items-center px-4 py-3 pb-safe bg-surface/80 backdrop-blur-xl border-t border-white/20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col items-center justify-center text-on-surface-variant/70">
          <span className="material-symbols-outlined">home</span>
          <span className="text-label-sm font-label-sm">Home</span>
        </div>
        <div className="flex flex-col items-center justify-center text-on-surface-variant/70">
          <span className="material-symbols-outlined">book</span>
          <span className="text-label-sm font-label-sm">Notes</span>
        </div>
        <div className="flex flex-col items-center justify-center text-primary relative after:content-[''] after:absolute after:-bottom-1 after:w-1 after:h-1 after:bg-primary after:rounded-full">
          <span className="material-symbols-outlined" data-weight="fill">smart_toy</span>
          <span className="text-label-sm font-label-sm">Tutor</span>
        </div>
        <div className="flex flex-col items-center justify-center text-on-surface-variant/70">
          <span className="material-symbols-outlined">forum</span>
          <span className="text-label-sm font-label-sm">Social</span>
        </div>
        <div className="flex flex-col items-center justify-center text-on-surface-variant/70">
          <span className="material-symbols-outlined">extension</span>
          <span className="text-label-sm font-label-sm">Quizzes</span>
        </div>
      </nav>

      <style jsx global>{`
        /* Tailwind CSS with custom colors */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Geist:wght@400;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

        /* Custom color variables matching the original design */
        :root {
          --color-secondary-fixed: #f0dbff;
          --color-tertiary-container: #006a7c;
          --color-tertiary-fixed-dim: #4cd7f6;
          --color-on-background: #0b1c30;
          --color-secondary-fixed-dim: #ddb8ff;
          --color-on-primary-fixed-variant: #3323cc;
          --color-surface-container-highest: #d3e4fe;
          --color-on-surface-variant: #464555;
          --color-on-error-container: #93000a;
          --color-tertiary-fixed: #acedff;
          --color-on-tertiary-fixed-variant: #004e5c;
          --color-on-secondary-fixed: #2c0051;
          --color-primary-container: #4f46e5;
          --color-on-tertiary-fixed: #001f26;
          --color-inverse-on-surface: #eaf1ff;
          --color-inverse-primary: #c3c0ff;
          --color-on-secondary-fixed-variant: #6800b4;
          --color-outline-variant: #c7c4d8;
          --color-surface-tint: #4d44e3;
          --color-on-primary-fixed: #0f0069;
          --color-primary-fixed-dim: #c3c0ff;
          --color-error: #ba1a1a;
          --color-inverse-surface: #213145;
          --color-on-tertiary-container: #93e8ff;
          --color-background: #f8f9ff;
          --color-surface: #f8f9ff;
          --color-on-secondary-container: #fffbff;
          --color-surface-container-high: #dce9ff;
          --color-secondary: #831ada;
          --color-surface-container: #e5eeff;
          --color-surface-bright: #f8f9ff;
          --color-on-tertiary: #ffffff;
          --color-surface-dim: #cbdbf5;
          --color-surface-variant: #d3e4fe;
          --color-surface-container-low: #eff4ff;
          --color-primary-fixed: #e2dfff;
          --color-primary: #3525cd;
          --color-secondary-container: #9e41f5;
          --color-on-primary: #ffffff;
          --color-on-secondary: #ffffff;
          --color-outline: #777587;
          --color-on-error: #ffffff;
          --color-on-surface: #0b1c30;
          --color-tertiary: #00505f;
          --color-on-primary-container: #dad7ff;
          --color-error-container: #ffdad6;
          --color-surface-container-lowest: #ffffff;
        }

        /* Tailwind custom classes */
        .text-secondary-fixed { color: var(--color-secondary-fixed); }
        .bg-secondary-fixed { background-color: var(--color-secondary-fixed); }
        .text-tertiary-container { color: var(--color-tertiary-container); }
        .bg-tertiary-container { background-color: var(--color-tertiary-container); }
        .text-tertiary-fixed-dim { color: var(--color-tertiary-fixed-dim); }
        .bg-tertiary-fixed-dim { background-color: var(--color-tertiary-fixed-dim); }
        .text-on-background { color: var(--color-on-background); }
        .bg-on-background { background-color: var(--color-on-background); }
        .text-secondary-fixed-dim { color: var(--color-secondary-fixed-dim); }
        .bg-secondary-fixed-dim { background-color: var(--color-secondary-fixed-dim); }
        .text-on-primary-fixed-variant { color: var(--color-on-primary-fixed-variant); }
        .bg-on-primary-fixed-variant { background-color: var(--color-on-primary-fixed-variant); }
        .text-surface-container-highest { color: var(--color-surface-container-highest); }
        .bg-surface-container-highest { background-color: var(--color-surface-container-highest); }
        .text-on-surface-variant { color: var(--color-on-surface-variant); }
        .bg-on-surface-variant { background-color: var(--color-on-surface-variant); }
        .text-on-error-container { color: var(--color-on-error-container); }
        .bg-on-error-container { background-color: var(--color-on-error-container); }
        .text-tertiary-fixed { color: var(--color-tertiary-fixed); }
        .bg-tertiary-fixed { background-color: var(--color-tertiary-fixed); }
        .text-on-tertiary-fixed-variant { color: var(--color-on-tertiary-fixed-variant); }
        .bg-on-tertiary-fixed-variant { background-color: var(--color-on-tertiary-fixed-variant); }
        .text-on-secondary-fixed { color: var(--color-on-secondary-fixed); }
        .bg-on-secondary-fixed { background-color: var(--color-on-secondary-fixed); }
        .text-primary-container { color: var(--color-primary-container); }
        .bg-primary-container { background-color: var(--color-primary-container); }
        .text-on-tertiary-fixed { color: var(--color-on-tertiary-fixed); }
        .bg-on-tertiary-fixed { background-color: var(--color-on-tertiary-fixed); }
        .text-inverse-on-surface { color: var(--color-inverse-on-surface); }
        .bg-inverse-on-surface { background-color: var(--color-inverse-on-surface); }
        .text-inverse-primary { color: var(--color-inverse-primary); }
        .bg-inverse-primary { background-color: var(--color-inverse-primary); }
        .text-on-secondary-fixed-variant { color: var(--color-on-secondary-fixed-variant); }
        .bg-on-secondary-fixed-variant { background-color: var(--color-on-secondary-fixed-variant); }
        .text-outline-variant { color: var(--color-outline-variant); }
        .bg-outline-variant { background-color: var(--color-outline-variant); }
        .text-surface-tint { color: var(--color-surface-tint); }
        .bg-surface-tint { background-color: var(--color-surface-tint); }
        .text-on-primary-fixed { color: var(--color-on-primary-fixed); }
        .bg-on-primary-fixed { background-color: var(--color-on-primary-fixed); }
        .text-primary-fixed-dim { color: var(--color-primary-fixed-dim); }
        .bg-primary-fixed-dim { background-color: var(--color-primary-fixed-dim); }
        .text-error { color: var(--color-error); }
        .bg-error { background-color: var(--color-error); }
        .text-inverse-surface { color: var(--color-inverse-surface); }
        .bg-inverse-surface { background-color: var(--color-inverse-surface); }
        .text-on-tertiary-container { color: var(--color-on-tertiary-container); }
        .bg-on-tertiary-container { background-color: var(--color-on-tertiary-container); }
        .text-background { color: var(--color-background); }
        .bg-background { background-color: var(--color-background); }
        .text-surface { color: var(--color-surface); }
        .bg-surface { background-color: var(--color-surface); }
        .text-on-secondary-container { color: var(--color-on-secondary-container); }
        .bg-on-secondary-container { background-color: var(--color-on-secondary-container); }
        .text-surface-container-high { color: var(--color-surface-container-high); }
        .bg-surface-container-high { background-color: var(--color-surface-container-high); }
        .text-secondary { color: var(--color-secondary); }
        .bg-secondary { background-color: var(--color-secondary); }
        .text-surface-container { color: var(--color-surface-container); }
        .bg-surface-container { background-color: var(--color-surface-container); }
        .text-surface-bright { color: var(--color-surface-bright); }
        .bg-surface-bright { background-color: var(--color-surface-bright); }
        .text-on-tertiary { color: var(--color-on-tertiary); }
        .bg-on-tertiary { background-color: var(--color-on-tertiary); }
        .text-surface-dim { color: var(--color-surface-dim); }
        .bg-surface-dim { background-color: var(--color-surface-dim); }
        .text-surface-variant { color: var(--color-surface-variant); }
        .bg-surface-variant { background-color: var(--color-surface-variant); }
        .text-surface-container-low { color: var(--color-surface-container-low); }
        .bg-surface-container-low { background-color: var(--color-surface-container-low); }
        .text-primary-fixed { color: var(--color-primary-fixed); }
        .bg-primary-fixed { background-color: var(--color-primary-fixed); }
        .text-primary { color: var(--color-primary); }
        .bg-primary { background-color: var(--color-primary); }
        .text-secondary-container { color: var(--color-secondary-container); }
        .bg-secondary-container { background-color: var(--color-secondary-container); }
        .text-on-primary { color: var(--color-on-primary); }
        .bg-on-primary { background-color: var(--color-on-primary); }
        .text-on-secondary { color: var(--color-on-secondary); }
        .bg-on-secondary { background-color: var(--color-on-secondary); }
        .text-outline { color: var(--color-outline); }
        .bg-outline { background-color: var(--color-outline); }
        .text-on-error { color: var(--color-on-error); }
        .bg-on-error { background-color: var(--color-on-error); }
        .text-on-surface { color: var(--color-on-surface); }
        .bg-on-surface { background-color: var(--color-on-surface); }
        .text-tertiary { color: var(--color-tertiary); }
        .bg-tertiary { background-color: var(--color-tertiary); }
        .text-on-primary-container { color: var(--color-on-primary-container); }
        .bg-on-primary-container { background-color: var(--color-on-primary-container); }
        .text-error-container { color: var(--color-error-container); }
        .bg-error-container { background-color: var(--color-error-container); }
        .text-surface-container-lowest { color: var(--color-surface-container-lowest); }
        .bg-surface-container-lowest { background-color: var(--color-surface-container-lowest); }

        /* Spacing and font classes */
        .px-margin-mobile { padding-left: 16px; padding-right: 16px; }
        .px-margin-desktop { padding-left: 40px; padding-right: 40px; }
        .text-label-sm { font-size: 12px; line-height: 16px; letter-spacing: 0.05em; font-weight: 600; font-family: 'Geist', sans-serif; }
        .text-display-lg-mobile { font-size: 32px; line-height: 40px; letter-spacing: -0.02em; font-weight: 700; font-family: 'Geist', sans-serif; }
        .text-body-md { font-size: 16px; line-height: 24px; font-weight: 400; font-family: 'Inter', sans-serif; }
        .text-headline-md { font-size: 24px; line-height: 32px; letter-spacing: -0.01em; font-weight: 600; font-family: 'Geist', sans-serif; }
        .text-body-lg { font-size: 18px; line-height: 28px; font-weight: 400; font-family: 'Inter', sans-serif; }
        .text-display-lg { font-size: 48px; line-height: 56px; letter-spacing: -0.02em; font-weight: 700; font-family: 'Geist', sans-serif; }
        .font-label-sm { font-family: 'Geist', sans-serif; }
        .font-body-md { font-family: 'Inter', sans-serif; }
        .font-headline-md { font-family: 'Geist', sans-serif; }
        .font-body-lg { font-family: 'Inter', sans-serif; }
        .font-display-lg { font-family: 'Geist', sans-serif; }
        .font-display-lg-mobile { font-family: 'Geist', sans-serif; }

        /* Glass and animation classes */
        .glass-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .ai-glow {
          box-shadow: 0px 0px 20px rgba(6, 182, 212, 0.15);
        }
        .message-bubble-ai {
          background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
          border: 1px solid rgba(79, 70, 229, 0.1);
        }
        .typing-dot {
          animation: typing 1.4s infinite ease-in-out;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typing {
          0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
        .sidebar-transition {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #dce9ff; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .bg-primary/20 { background-color: rgba(53, 37, 205, 0.2); }
        .bg-primary/5 { background-color: rgba(53, 37, 205, 0.05); }
        .bg-primary/40 { background-color: rgba(53, 37, 205, 0.4); }
        .bg-primary/10 { background-color: rgba(53, 37, 205, 0.1); }
        .border-primary/20 { border-color: rgba(53, 37, 205, 0.2); }
        .border-primary/5 { border-color: rgba(53, 37, 205, 0.05); }
        .text-primary/20 { color: rgba(53, 37, 205, 0.2); }
        .bg-white/80 { background-color: rgba(255, 255, 255, 0.8); }
        .bg-white/50 { background-color: rgba(255, 255, 255, 0.5); }
        .bg-white/20 { background-color: rgba(255, 255, 255, 0.2); }
        .bg-surface/80 { background-color: rgba(248, 249, 255, 0.8); }
        .bg-surface/90 { background-color: rgba(248, 249, 255, 0.9); }
        .border-white/20 { border-color: rgba(255, 255, 255, 0.2); }
        .border-white/40 { border-color: rgba(255, 255, 255, 0.4); }
        .border-white/10 { border-color: rgba(255, 255, 255, 0.1); }
        .bg-primary-container/10 { background-color: rgba(79, 70, 229, 0.1); }
        .bg-primary-container/20 { background-color: rgba(79, 70, 229, 0.2); }
        .bg-surface-container-high/50 { background-color: rgba(220, 233, 255, 0.5); }
        .bg-surface-container-lowest { background-color: #ffffff; }
        .bg-surface-container-high { background-color: #dce9ff; }
        .bg-indigo-50 { background-color: #eef2ff; }
        .border-indigo-100 { border-color: #e0e7ff; }
        .text-indigo-50 { color: #eef2ff; }
        .bg-cyan-400 { background-color: #22d3ee; }
        .to-indigo-600 { background-color: #4f46e5; }
        .from-cyan-400 { background-color: #22d3ee; }
        .to-indigo-600 { background-color: #4f46e5; }
        .bg-green-500 { background-color: #22c55e; }

        /* Responsive classes */
        @media (min-width: 1024px) {
          .lg\\:flex { display: flex; }
          .lg\\:hidden { display: none; }
        }
        @media (max-width: 1023px) {
          .hidden { display: none; }
        }
        @media (min-width: 640px) {
          .sm\\:flex { display: flex; }
          .sm\\:hidden { display: none; }
        }
        @media (max-width: 639px) {
          .hidden\\:sm\\:flex { display: none; }
        }
        @media (min-width: 768px) {
          .md\\:flex { display: flex; }
          .md\\:hidden { display: none; }
          .md\\:p-8 { padding: 2rem; }
          .md\\:p-6 { padding: 1.5rem; }
          .px-margin-desktop { padding-left: 40px; padding-right: 40px; }
        }
        @media (max-width: 767px) {
          .px-margin-mobile { padding-left: 16px; padding-right: 16px; }
        }
        .fixed { position: fixed; }
        .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
        .z-50 { z-index: 50; }
        .z-10 { z-index: 10; }
        .z-\\[60\\] { z-index: 60; }
        .sticky { position: sticky; }
        .top-0 { top: 0; }
        .bottom-0 { bottom: 0; }
        .left-0 { left: 0; }
        .right-0 { right: 0; }
        .absolute { position: absolute; }
        .relative { position: relative; }
        .top-4 { top: 1rem; }
        .right-4 { right: 1rem; }
        .-bottom-1 { bottom: -0.25rem; }
        .w-full { width: 100%; }
        .w-72 { width: 18rem; }
        .w-10 { width: 2.5rem; }
        .w-8 { width: 2rem; }
        .w-2 { width: 0.5rem; }
        .w-\\[20px\\] { width: 20px; }
        .w-\\[18px\\] { width: 18px; }
        .w-\\[16px\\] { width: 16px; }
        .max-w-4xl { max-width: 56rem; }
        .max-w-\\[85\\%\\] { max-width: 85%; }
        .max-w-\\[80\\%\\] { max-width: 80%; }
        .max-h-48 { max-height: 12rem; }
        .h-16 { height: 4rem; }
        .h-full { height: 100%; }
        .h-10 { height: 2.5rem; }
        .h-8 { height: 2rem; }
        .h-2 { height: 0.5rem; }
        .h-\\[20px\\] { height: 20px; }
        .h-\\[18px\\] { height: 18px; }
        .h-\\[16px\\] { height: 16px; }
        .h-\\[calc\\(100vh-64px\\)\\] { height: calc(100vh - 64px); }
        .min-h-\\[884px\\] { min-height: 884px; }
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .flex-1 { flex: 1 1 0%; }
        .flex-shrink-0 { flex-shrink: 0; }
        .items-center { align-items: center; }
        .items-start { align-items: flex-start; }
        .items-end { align-items: flex-end; }
        .justify-center { justify-content: center; }
        .justify-between { justify-content: space-between; }
        .justify-around { justify-content: space-around; }
        .gap-4 { gap: 1rem; }
        .gap-3 { gap: 0.75rem; }
        .gap-2 { gap: 0.5rem; }
        .gap-1 { gap: 0.25rem; }
        .gap-6 { gap: 1.5rem; }
        .space-y-8 > * + * { margin-top: 2rem; }
        .space-y-4 > * + * { margin-top: 1rem; }
        .space-y-1 > * + * { margin-top: 0.25rem; }
        .overflow-hidden { overflow: hidden; }
        .overflow-y-auto { overflow-y: auto; }
        .overflow-x-auto { overflow-x: auto; }
        .p-6 { padding: 1.5rem; }
        .p-5 { padding: 1.25rem; }
        .p-4 { padding: 1rem; }
        .p-3 { padding: 0.75rem; }
        .p-2 { padding: 0.75rem; }
        .px-4 { padding-left: 1rem; padding-right: 1rem; }
        .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
        .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
        .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
        .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
        .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
        .pb-2 { padding-bottom: 0.5rem; }
        .pb-1 { padding-bottom: 0.25rem; }
        .pt-0 { padding-top: 0; }
        .mt-4 { margin-top: 1rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-1 { margin-bottom: 0.25rem; }
        .rounded-2xl { border-radius: 1rem; }
        .rounded-xl { border-radius: 0.75rem; }
        .rounded-lg { border-radius: 0.5rem; }
        .rounded-full { border-radius: 9999px; }
        .rounded-tl-none { border-top-left-radius: 0; }
        .rounded-tr-none { border-top-right-radius: 0; }
        .border { border-width: 1px; }
        .border-t { border-top-width: 1px; }
        .border-b { border-bottom-width: 1px; }
        .border-r { border-right-width: 1px; }
        .border-none { border: none; }
        .bg-transparent { background: transparent; }
        .bg-clip-text { background-clip: text; }
        .text-transparent { color: transparent; }
        .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
        .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
        .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
        .shadow-\\[0_-4px_20px_rgba\\(0\\,0\\,0\\,0\\.05\\)\\] { box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05); }
        .ring-1 { box-shadow: 0 0 0 1px; }
        .ring-primary/5 { box-shadow: 0 0 0 1px rgba(53, 37, 205, 0.05); }
        .focus\\:ring-primary/20:focus { box-shadow: 0 0 0 1px rgba(53, 37, 205, 0.2); }
        .focus\\:ring-0:focus { box-shadow: 0 0 0 0; }
        .transition-all { transition: all 0.3s ease; }
        .transition-colors { transition: colors 0.3s ease; }
        .transition-opacity { transition: opacity 0.3s ease; }
        .duration-200 { transition-duration: 200ms; }
        .duration-300 { transition-duration: 300ms; }
        .hover\\:scale-105:hover { transform: scale(1.05); }
        .active\\:scale-95:active { transform: scale(0.95); }
        .hover\\:opacity-90:hover { opacity: 0.9; }
        .hover\\:bg-primary-container/20:hover { background-color: rgba(79, 70, 229, 0.2); }
        .hover\\:bg-primary-container:hover { background-color: #4f46e5; }
        .hover\\:bg-surface-variant/50:hover { background-color: rgba(211, 228, 254, 0.5); }
        .hover\\:bg-primary/5:hover { background-color: rgba(53, 37, 205, 0.05); }
        .hover\\:text-primary:hover { color: #3525cd; }
        .hover\\:text-on-primary-container:hover { color: #dad7ff; }
        .group:hover .group-hover\\:bg-primary-container/20 { background-color: rgba(79, 70, 229, 0.2); }
        .cursor-pointer { cursor: pointer; }
        .whitespace-nowrap { white-space: nowrap; }
        .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .uppercase { text-transform: uppercase; }
        .tracking-widest { letter-spacing: 0.1em; }
        .leading-relaxed { line-height: 1.625; }
        .text-center { text-align: center; }
        .font-bold { font-weight: 700; }
        .font-medium { font-weight: 500; }
        .text-\\[20px\\] { font-size: 20px; }
        .text-\\[18px\\] { font-size: 18px; }
        .text-\\[16px\\] { font-size: 16px; }
        .text-\\[13px\\] { font-size: 13px; }
        .text-\\[10px\\] { font-size: 10px; }
        .bg-gradient-to-br { background-image: linear-gradient(to bottom right, var(--tw-gradient-stops)); }
        .bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-stops)); }
        .from-primary { --tw-gradient-from: #3525cd; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(53, 37, 205, 0)); }
        .to-secondary { --tw-gradient-to: #831ada; }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .opacity-0 { opacity: 0; }
        .opacity-100 { opacity: 1; }
        .opacity-60 { opacity: 0.6; }
        .group\\:focus-within\\:ring-primary/20:focus-within { box-shadow: 0 0 0 1px rgba(53, 37, 205, 0.2); }
        .disabled\\:opacity-50:disabled { opacity: 0.5; }
        .resize-none { resize: none; }
        .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .after\\:content-\\[\\'\\'\\]::after { content: ''; }
        .after\\:absolute::after { position: absolute; }
        .after\\:-bottom-1::after { bottom: -0.25rem; }
        .after\\:w-1::after { width: 0.25rem; }
        .after\\:h-1::after { height: 0.25rem; }
        .after\\:bg-primary::after { background-color: #3525cd; }
        .after\\:rounded-full::after { border-radius: 9999px; }
        .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
        .backdrop-blur-xl { backdrop-filter: blur(12px); }
        .bg-surface/80 { background-color: rgba(248, 249, 255, 0.8); }
        .bg-surface/90 { background-color: rgba(248, 249, 255, 0.9); }
        .bg-white/80 { background-color: rgba(255, 255, 255, 0.8); }
        .bg-white/50 { background-color: rgba(255, 255, 255, 0.5); }
        .bg-white/20 { background-color: rgba(255, 255, 255, 0.2); }
        .border-white/20 { border-color: rgba(255, 255, 255, 0.2); }
        .border-white/40 { border-color: rgba(255, 255, 255, 0.4); }
        .border-white/10 { border-color: rgba(255, 255, 255, 0.1); }
        .from-background { --tw-gradient-from: #f8f9ff; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(248, 249, 255, 0)); }
        .to-surface-container-low { --tw-gradient-to: #eff4ff; }
        .border-outline-variant/30 { border-color: rgba(199, 196, 216, 0.3); }
        .border-outline-variant/20 { border-color: rgba(199, 196, 216, 0.2); }
        .bg-surface-container-lowest { background-color: #ffffff; }
        .bg-surface-container-high { background-color: #dce9ff; }
        .text-outline-variant { color: #c7c4d8; }
        .text-outline { color: #777587; }
        .text-on-surface-variant/60 { color: rgba(70, 69, 85, 0.6); }
        .text-on-surface-variant/70 { color: rgba(70, 69, 85, 0.7); }
        .hover\\:bg-primary-container:hover { background-color: #4f46e5; }
        .hover\\:text-on-primary-container:hover { color: #dad7ff; }
        .bg-primary-container { background-color: #4f46e5; }
        .text-on-primary-container { color: #dad7ff; }
        .from-cyan-400 { --tw-gradient-from: #22d3ee; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(34, 211, 238, 0)); }
        .to-indigo-600 { --tw-gradient-to: #4f46e5; }
        .text-white { color: #ffffff; }
        .bg-green-500 { background-color: #22c55e; }
        .border-indigo-100 { border-color: #e0e7ff; }
        .bg-indigo-50 { background-color: #eef2ff; }
        .text-secondary { color: #831ada; }
        .text-primary { color: #3525cd; }
        .bg-secondary { background-color: #831ada; }
        .bg-primary { background-color: #3525cd; }
        .text-on-secondary { color: #ffffff; }
        .text-on-primary { color: #ffffff; }
        .text-on-surface { color: #0b1c30; }
        .bg-surface-container-low { background-color: #eff4ff; }
        .bg-surface-container-high { background-color: #dce9ff; }
        .bg-surface-container-highest { background-color: #d3e4fe; }
        .bg-surface-variant { background-color: #d3e4fe; }
        .text-on-surface-variant { color: #464555; }
        .bg-surface { background-color: #f8f9ff; }
        .bg-background { background-color: #f8f9ff; }
        .text-on-background { color: #0b1c30; }
        .shadow { box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); }
        .focus\\:ring-0:focus { box-shadow: 0 0 0 0; }
        .ring-1 { box-shadow: 0 0 0 1px; }
        .ring-primary/5 { box-shadow: 0 0 0 1px rgba(53, 37, 205, 0.05); }
        .group\\:focus-within\\:ring-primary/20:focus-within { box-shadow: 0 0 0 1px rgba(53, 37, 205, 0.2); }
        .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
        .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
        .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
        .shadow-\\[0_-4px_20px_rgba\\(0\\,0\\,0\\,0\\.05\\)\\] { box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05); }
        .border-b { border-bottom-width: 1px; }
        .border-t { border-top-width: 1px; }
        .border-r { border-right-width: 1px; }
        .border { border-width: 1px; }
        .border-none { border: none; }
        .bg-transparent { background: transparent; }
        .text-transparent { color: transparent; }
        .bg-clip-text { background-clip: text; }

        /* Material Symbols */
        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined';
          font-weight: normal;
          font-style: normal;
          font-size: 24px;
          line-height: 1;
          letter-spacing: normal;
          text-transform: none;
          display: inline-block;
          white-space: nowrap;
          word-wrap: normal;
          direction: ltr;
          -webkit-font-feature-settings: 'liga';
          -webkit-font-smoothing: antialiased;
        }
      `}</style>
    </div>
  );
};

export default AITutor;