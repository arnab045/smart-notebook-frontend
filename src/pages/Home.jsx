import { Link } from "react-router-dom"
const API = import.meta.env.VITE_API_URL

function Home() {

  return (

    <div className="min-h-screen bg-black text-white">

      {/* Navbar */}

      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-800">

        <h1 className="text-3xl font-bold text-cyan-400">

          📘 Smart Notebook AI

        </h1>

        <div className="flex gap-4">

          <Link to="/login">

            <button className="px-5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800">

              Login

            </button>

          </Link>

          <Link to="/signup">

            <button className="px-5 py-2 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400">

              Signup

            </button>

          </Link>

        </div>

      </nav>

      {/* Hero */}

      <section className="flex flex-col items-center justify-center text-center py-32 px-6">

        <h1 className="text-7xl font-extrabold leading-tight">

          Smart Learning <br />

          With AI 🚀

        </h1>

        <p className="text-gray-400 text-xl mt-6 max-w-3xl">

          Upload notes, generate summaries, explore community posts,
          and learn smarter using AI-powered tutoring.

        </p>

        <div className="flex gap-5 mt-10">

          <Link to="/dashboard">

            <button className="px-7 py-3 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400">

              Get Started

            </button>

          </Link>

          <Link to="/community">

            <button className="px-7 py-3 rounded-xl border border-gray-700 hover:bg-gray-900">

              Explore Community

            </button>

          </Link>

        </div>

      </section>

    </div>
  )
}

export default Home