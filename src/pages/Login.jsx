import { useState } from "react"
import { useNavigate } from "react-router-dom"
const API = import.meta.env.VITE_API_URL

function Login() {

  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e) => {

    e.preventDefault()

    try {

      const response = await fetch("https://smart-notebook-backend.onrender.com/login", {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),

      })

      const data = await response.json()

      if (data.success) {

        alert("Login Successful ✅")

        localStorage.setItem("user", JSON.stringify(data))
        
        console.log("Navigating...")

        navigate("/dashboard")

      } else {

        alert(data.message)

      }

    } catch (error) {

      console.error(error)

      alert("Server Error")

    }

  }

  return (

    <div className="min-h-screen w-full flex flex-col md:flex-row animated-bg relative overflow-hidden">

      {/* Floating Ambient Blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-400/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[150px] pointer-events-none"></div>

      {/* LEFT SIDE */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-center items-center p-10 relative z-10">

        <div className="max-w-md text-center">

          <div className="mb-12 inline-flex items-center justify-center p-6 rounded-full glass-panel shadow-xl">

            <span className="text-6xl">🧠</span>

          </div>

          <h2 className="text-5xl font-bold text-white mb-6 leading-tight">

            Augment Your Intelligence.

          </h2>

          <p className="text-xl text-white/80">

            Connect your thoughts with our neural-link notebook.

          </p>

          <div className="mt-12 relative h-64 w-full flex items-center justify-center">

            <div className="absolute w-32 h-32 border-2 border-white/20 rounded-full animate-pulse"></div>

            <div className="absolute w-48 h-48 border border-white/10 rounded-full animate-ping"></div>

            <div className="grid grid-cols-3 gap-8">

              <div className="w-4 h-4 bg-cyan-300 rounded-full shadow-[0_0_15px_rgba(76,215,246,0.8)]"></div>

              <div className="w-4 h-4 bg-purple-200 rounded-full shadow-[0_0_15px_rgba(240,219,255,0.8)] mt-8"></div>

              <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]"></div>

            </div>

          </div>

        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-10 relative z-20 py-12">

        <div className="w-full max-w-[480px] glass-panel rounded-2xl shadow-2xl overflow-hidden">

          {/* TOP HERO */}
          <div className="w-full bg-gradient-to-b from-indigo-500/10 to-transparent pt-12 pb-6 px-8 flex flex-col items-center">

            <div className="relative w-64 h-64 mb-6 flex items-center justify-center">

              <div className="pulse-glow-bg"></div>

              <div className="orbiting-node"></div>

              <div className="orbiting-node orbit2"></div>

              <div className="orbiting-node orbit3"></div>

              <div className="hero-illustration-container relative z-10 w-full h-full">

                <img
                  src="https://scholarmedia.africa/wp-content/uploads/2025/05/AI-Classroms.png"
                  alt="Digital Student"
                  className="w-full h-full object-contain drop-shadow-2xl"
                />

              </div>

            </div>

            <div className="text-center">

              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-600 inline-block mb-1">

                Welcome To Your Digital School

              </h1>

            </div>

          </div>

          {/* CONTENT */}
          <div className="p-8 md:px-12 md:pb-12 md:pt-0">

            <p className="text-gray-700 text-center mb-10">

              The next chapter of your learning journey starts here.

            </p>

            {/* FORM */}
            <form className="space-y-6" onSubmit={handleLogin}>

              <div>

                <label className="text-sm text-gray-600 block ml-1 mb-2">

                  Email Address

                </label>

                <div className="relative">

                  <input
                    type="email"
                    placeholder="alex@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border-b-2 border-gray-300 py-4 px-4 rounded-t-lg focus:border-indigo-600 outline-none transition-all"
                  />

                </div>

              </div>

              <div>

                <div className="flex justify-between items-center mb-2">

                  <label className="text-sm text-gray-600 block ml-1">

                    Password

                  </label>

                  <a href="#" className="text-indigo-600 text-sm font-bold hover:underline">

                    Forgot?

                  </a>

                </div>

                <div className="relative">

                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border-b-2 border-gray-300 py-4 px-4 rounded-t-lg focus:border-indigo-600 outline-none transition-all"
                  />

                </div>

              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-indigo-700 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
              >

                <span>Sign In</span>

              </button>

            </form>

            {/* DIVIDER */}
            <div className="flex items-center my-10">

              <div className="flex-grow h-px bg-gray-300"></div>

              <span className="px-4 text-xs text-gray-500">

                OR CONTINUE WITH

              </span>

              <div className="flex-grow h-px bg-gray-300"></div>

            </div>

            {/* SOCIAL */}
            <div className="grid grid-cols-2 gap-6">

              <button className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-gray-300 bg-white hover:bg-gray-100 transition-all">

                Google

              </button>

              <button className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-gray-300 bg-white hover:bg-gray-100 transition-all">

                Apple

              </button>

            </div>

            {/* FOOTER */}
            <p className="mt-10 text-center text-gray-600">

              New to the sanctum?

              <span
                onClick={() => navigate("/signup")}
                className="text-indigo-600 font-bold ml-2 cursor-pointer"
              >

                Create an account

              </span>

            </p>

          </div>

        </div>

      </div>

    </div>

  )
}

export default Login