import { useNavigate } from "react-router-dom"
import MainLayout from "../layouts/MainLayout"
import DashboardCard from "../components/DashboardCard"

const API = import.meta.env.VITE_API_URL

function Dashboard() {

  const navigate = useNavigate()

  return (

    <MainLayout>

      {/* Hero */}

      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-indigo-700 via-purple-600 to-violet-500 p-10 text-white mb-10">

        <div className="absolute inset-0 bg-black/10"></div>

        <div className="relative z-10">

          <h1 className="text-6xl font-extrabold leading-tight mb-5">

            Your Personalized <br />

            Digital School 🏫

          </h1>

          <p className="text-lg text-indigo-100 max-w-2xl">

            Upload notes, generate summaries,
            explore community posts,
            and learn smarter with AI.

          </p>

        </div>

      </div>

      {/* Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        <DashboardCard
          icon="📚📖"
          title="Upload Notes"
          description="Upload New notes or experiences."
          onClick={() => navigate("/upload")}
        />
        
        <DashboardCard
          icon="📚"
          title="My Notes"
          description="Manage and organize all your uploaded learning materials."
          onClick={() => navigate("/mynotes")}
        />

        <DashboardCard
          icon="👨🏻‍🏫"
          title="AI Tutor"
          description="Chat with your AI tutor and ask questions from any topic."
          onClick={() => navigate("/tutor")}
        />

        <DashboardCard
          icon="🌍"
          title="Community"
          description="Explore public notes, discussions and collaborative learning."
          onClick={() => navigate("/community")}
        />

        <DashboardCard
          icon="🧠"
          title="Quiz Mode"
          description="Generate quizzes instantly from your notes and improve retention."
          onClick={() => navigate("/quiz")}
        />

        <DashboardCard
          icon="📈"
          title="Progress Tracking"
          description="Track your learning performance and AI insights."
          onClick={() => navigate("/progress")}
        />

      </div>

    </MainLayout>

  )

}

export default Dashboard