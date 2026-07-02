import { useNavigate } from "react-router-dom";

function ComingSoon() {

  const navigate = useNavigate();

  return (

    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white flex items-center justify-center p-6">

      <div className="max-w-2xl w-full bg-white rounded-[32px] shadow-2xl border border-gray-100 p-12">

        {/* Icon */}

        <div className="flex justify-center mb-8">

          <div className="w-28 h-28 rounded-full bg-gradient-to-r from-indigo-700 to-purple-600 flex items-center justify-center text-6xl shadow-xl">

            🚀

          </div>

        </div>

        {/* Heading */}

        <h1 className="text-5xl font-extrabold text-center text-gray-800">

          Coming Soon

        </h1>

        <p className="text-center text-gray-500 mt-4 text-lg">

          This feature is currently under development.
          It will be available in one of the upcoming releases.

        </p>

        {/* Divider */}

        <div className="my-10 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

        {/* Planned Features */}

        <h2 className="text-2xl font-bold text-gray-800 mb-6">

          Planned Features

        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <div className="rounded-2xl bg-indigo-50 p-5">

            📊 <span className="font-semibold">Learning Analytics</span>

            <p className="text-sm text-gray-600 mt-2">

              Visual charts showing your overall study performance.

            </p>

          </div>

          <div className="rounded-2xl bg-purple-50 p-5">

            🔥 <span className="font-semibold">Study Streak</span>

            <p className="text-sm text-gray-600 mt-2">

              Track your daily learning consistency.

            </p>

          </div>

          <div className="rounded-2xl bg-violet-50 p-5">

            🤖 <span className="font-semibold">AI Recommendations</span>

            <p className="text-sm text-gray-600 mt-2">

              Personalized suggestions based on your learning habits.

            </p>

          </div>

          <div className="rounded-2xl bg-pink-50 p-5">

            📈 <span className="font-semibold">Weekly Progress Reports</span>

            <p className="text-sm text-gray-600 mt-2">

              Detailed reports with AI-generated learning insights.

            </p>

          </div>

        </div>

        {/* Bottom */}

        <div className="mt-10 flex justify-center">

          <button

            onClick={() => navigate(-1)}

            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-700 to-purple-600 text-white font-semibold text-lg hover:scale-105 transition-all shadow-lg"

          >

            ← Back to Dashboard

          </button>

        </div>

        <p className="text-center text-gray-400 text-sm mt-8">

          Smart Notebook AI • Version 1.0

        </p>

      </div>

    </div>

  );

}

export default ComingSoon;