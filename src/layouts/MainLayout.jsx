import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"

function MainLayout({ children }) {

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] via-[#eef2ff] to-[#f5f3ff] flex overflow-hidden">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* Top Navbar */}
        <div className="sticky top-0 z-40 px-6 pt-6">

          <div className="bg-white/70 backdrop-blur-xl border border-white/30 shadow-sm rounded-3xl">

            <Navbar />

          </div>

        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto px-6 py-6">

          <div className="max-w-[1600px] mx-auto">

            {children}

          </div>

        </main>

      </div>

    </div>

  )
}

export default MainLayout