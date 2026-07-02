import { useState } from "react"
import { useNavigate } from "react-router-dom"
const API = import.meta.env.VITE_API_URL

function Signup() {

  const navigate = useNavigate()

  const [step, setStep] = useState(1)

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const nextStep = () => {

    if (!fullName || !email) {

      alert("Please fill all fields")
      return
    }

    setStep(2)
  }

  const prevStep = () => {

    setStep(1)
  }

  const handleSignup = async () => {

    if (!password || !confirmPassword) {

      alert("Please fill all password fields")
      return
    }

    if (password !== confirmPassword) {

      alert("Passwords do not match")
      return
    }

    try {

      const response = await fetch(
        "https://smart-notebook-backend.onrender.com/signup",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: fullName,
            email: email,
            password: password,
          }),
        }
      )

      const data = await response.json()

      alert(data.message)

      if (response.ok) {

        navigate("/")
      }

    } catch (error) {

      console.log(error)

      alert("Signup failed")
    }
  }

  return (

    <div className="mesh-gradient min-h-screen flex items-center justify-center p-4 md:p-8 overflow-x-hidden text-[#0b1c30] relative">

      {/* Background Blur */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"></div>

      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full"></div>

      <main className="w-full max-w-[1000px] grid lg:grid-cols-2 gap-12 items-center relative z-10">

        {/* LEFT SIDE */}
        <div className="hidden lg:flex flex-col space-y-6 pr-10">

          <div className="flex items-center space-x-3 mb-4">

            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-700 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">🧠</span>
            </div>

            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-600">
              Smart Notebook AI
            </h1>

          </div>

          <h2 className="text-6xl font-bold leading-tight">
            Unlock your
            <span className="text-indigo-700"> academic potential</span>
            with AI.
          </h2>

          <p className="text-xl text-gray-600 max-w-md">
            Step into a digital sanctum where your notes come alive.
          </p>

          <div className="grid grid-cols-2 gap-6 pt-8">

            <div className="flex items-center gap-3">
              ✨ <span>AI Summaries</span>
            </div>

            <div className="flex items-center gap-3">
              👥 <span>Study Groups</span>
            </div>

            <div className="flex items-center gap-3">
              🧠 <span>Smart Quizzes</span>
            </div>

            <div className="flex items-center gap-3">
              ☁️ <span>Sync Anywhere</span>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="w-full relative">

          <div className="glass-card rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">

            {/* HEADER */}
            <div className="mb-10">

              <div className="flex justify-between items-center mb-4">

                <span className="text-sm font-bold text-indigo-700 uppercase tracking-widest">
                  {step === 1 ? "Step 1 of 2: Basics" : "Step 2 of 2: Security"}
                </span>

                <span className="text-sm text-gray-500">
                  {step === 1 ? "50% Complete" : "90% Complete"}
                </span>

              </div>

              <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">

                <div
                  className={`h-full bg-gradient-to-r from-indigo-700 to-purple-600 transition-all duration-500 ${
                    step === 1 ? "w-1/2" : "w-full"
                  }`}
                ></div>

              </div>

            </div>

            {/* STEP 1 */}
            {step === 1 && (

              <div className="space-y-6">

                <div>

                  <h3 className="text-4xl font-bold mb-2">
                    Welcome, Scholar
                  </h3>

                  <p className="text-gray-600">
                    Tell us a bit about yourself to get started.
                  </p>

                </div>

                <div className="space-y-4">

                  <div>

                    <label className="block mb-2 text-sm text-gray-500">
                      Full Name
                    </label>

                    <input
                      type="text"
                      placeholder="Alex Rivera"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full border-b border-gray-300 py-4 px-2 bg-transparent outline-none focus:border-indigo-700"
                    />

                  </div>

                  <div>

                    <label className="block mb-2 text-sm text-gray-500">
                      University Email
                    </label>

                    <input
                      type="email"
                      placeholder="alex.r@stanford.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border-b border-gray-300 py-4 px-2 bg-transparent outline-none focus:border-indigo-700"
                    />

                  </div>

                </div>

                <button
                  onClick={nextStep}
                  className="w-full mt-6 bg-gradient-to-r from-indigo-700 to-purple-600 text-white py-4 rounded-xl font-bold shadow-lg hover:scale-[1.02] transition-all"
                >
                  Continue →
                </button>

              </div>

            )}

            {/* STEP 2 */}
            {step === 2 && (

              <div className="space-y-6">

                <div>

                  <h3 className="text-4xl font-bold mb-2">
                    Secure Your Mind
                  </h3>

                  <p className="text-gray-600">
                    Create a strong password to protect your notes.
                  </p>

                </div>

                <div className="space-y-4">

                  <div>

                    <label className="block mb-2 text-sm text-gray-500">
                      Password
                    </label>

                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border-b border-gray-300 py-4 px-2 bg-transparent outline-none focus:border-indigo-700"
                    />

                  </div>

                  <div>

                    <label className="block mb-2 text-sm text-gray-500">
                      Confirm Password
                    </label>

                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full border-b border-gray-300 py-4 px-2 bg-transparent outline-none focus:border-indigo-700"
                    />

                  </div>

                </div>

                <div className="flex gap-4">

                  <button
                    onClick={prevStep}
                    className="flex-1 border border-gray-300 py-4 rounded-xl"
                  >
                    ← Back
                  </button>

                  <button
                    onClick={handleSignup}
                    className="flex-[2] bg-gradient-to-r from-indigo-700 to-purple-600 text-white py-4 rounded-xl font-bold"
                  >
                    ✨ Create Account
                  </button>

                </div>

              </div>

            )}

            {/* FOOTER */}
            <p className="text-center mt-10 text-gray-600">

              Already have an account?

              <span
                onClick={() => navigate("/")}
                className="text-indigo-700 font-bold ml-2 cursor-pointer"
              >
                Login
              </span>

            </p>

          </div>

        </div>

      </main>

    </div>

  )
}

export default Signup