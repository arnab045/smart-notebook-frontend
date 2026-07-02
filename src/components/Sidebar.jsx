import { Link, useLocation, useNavigate } from "react-router-dom"

function Sidebar() {

  const location = useLocation()

  const navigate = useNavigate()

  const menuItems = [

    {
      name: "Dashboard",
      icon: "🏠",
      path: "/dashboard",
    },

    {
      name: "Community",
      icon: "🌍",
      path: "/community",
    },

    {
      name: "My Notes",
      icon: "📚",
      path: "/mynotes",
    },

    {
      name: "AI Tutor",
      icon: "🤖",
      path: "/tutor",
    },

    {
      name: "Quiz Mode",
      icon: "🧠",
      path: "/quiz",
    },

    {
      name: "Profile",
      icon: "👤",
      path: "/profile",
    },

  ]

  const handleLogout = () => {

    localStorage.removeItem("user")

    navigate("/login")

  }

  return (

    <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 bg-white/80 backdrop-blur-xl border-r border-gray-200 p-6">

      {/* Profile */}
      <div className="flex flex-col items-center text-center mb-10">

        <img
          src="https://i.pravatar.cc/150"
          alt="profile"
          className="w-24 h-24 rounded-full border-4 border-indigo-200 shadow-lg"
        />

        <h2 className="mt-4 text-xl font-bold text-gray-800">

          {
            JSON.parse(localStorage.getItem("user"))
              ?.user?.name || "Smart Student"
          }

        </h2>

        <p className="text-gray-500 text-sm">

          AI Powered Learner 🚀

        </p>

      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-3 flex-1">

        {menuItems.map((item) => (

          <Link key={item.path} to={item.path}>

            <div
              className={`p-4 rounded-2xl transition-all duration-200 cursor-pointer flex items-center gap-3 font-medium

              ${
                location.pathname === item.path
                  ? "bg-gradient-to-r from-indigo-700 to-purple-600 text-white shadow-lg"
                  : "hover:bg-indigo-100 text-gray-700"
              }
              `}
            >

              <span className="text-xl">

                {item.icon}

              </span>

              <span>

                {item.name}

              </span>

            </div>

          </Link>

        ))}

      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="mt-6 p-4 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 font-semibold transition-all duration-200"
      >

        🚪 Logout

      </button>

    </aside>
  )
}

export default Sidebar