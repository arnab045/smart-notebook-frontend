function Navbar() {

  const storedUser = JSON.parse(localStorage.getItem("user"))

  const userName =
    storedUser?.user?.name || "Smart Student"

  return (

    <header className="flex justify-between items-center w-full px-6 h-20">

      {/* LEFT */}
      <div className="flex items-center gap-5">

        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-700 to-purple-600 flex items-center justify-center shadow-lg">

          <span className="text-white text-2xl">

            🧠

          </span>

        </div>

        <div>

          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-purple-600 bg-clip-text text-transparent">

            Smart Notebook AI

          </h1>

          <p className="text-sm text-gray-500">

            Learn smarter with AI

          </p>

        </div>

      </div>

      {/* SEARCH */}
      <div className="hidden md:flex flex-1 max-w-2xl mx-10">

        <div className="relative w-full">

          <input
            type="text"
            placeholder="Search notes, quizzes or ask AI..."
            className="w-full bg-white/70 backdrop-blur-xl border border-white/30 shadow-sm rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
          />

          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400">

            🔍

          </span>

        </div>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-5">

        <button className="relative w-12 h-12 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/30 shadow-sm hover:scale-105 transition-all flex items-center justify-center">

          <span className="text-xl">

            🔔

          </span>

          <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full"></span>

        </button>

        <div className="flex items-center gap-3 bg-white/70 backdrop-blur-xl border border-white/30 shadow-sm rounded-2xl px-3 py-2 hover:scale-[1.02] transition-all cursor-pointer">

          <img
            src="https://i.pravatar.cc/100"
            alt="profile"
            className="w-11 h-11 rounded-xl border-2 border-indigo-200"
          />

          <div className="hidden xl:block">

            <h3 className="text-sm font-bold text-gray-800">

              {userName}

            </h3>

            <p className="text-xs text-gray-500">

              Premium Student

            </p>

          </div>

        </div>

      </div>

    </header>

  )
}

export default Navbar