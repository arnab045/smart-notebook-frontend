import MainLayout from "../layouts/MainLayout"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
const API = import.meta.env.VITE_API_URL

function Book({ book, onClick }) {

  const colors = [
    "from-indigo-700 to-indigo-500",
    "from-purple-700 to-fuchsia-500",
    "from-cyan-700 to-cyan-500",
    "from-violet-700 to-indigo-600",
    "from-pink-600 to-purple-500",
  ]

  const heights = [
    "h-[240px]",
    "h-[220px]",
    "h-[250px]",
    "h-[230px]",
  ]

  const color =
    colors[(book?.id || 0) % colors.length]

  const height =
    heights[(book?.id || 0) % heights.length]

  return (

    <div
      onClick={onClick}
      className="group cursor-pointer transition-all duration-500 hover:-translate-y-4 hover:rotate-[-6deg]"
    >

      <div
        className={`w-[65px] ${height} bg-gradient-to-b ${color} rounded-l-md rounded-r-sm shadow-2xl border-r border-black/20 flex flex-col items-center py-4`}
      >

        <div className="text-white/70 text-xs mb-3">
          📘
        </div>

        <div className="writing-mode-vertical rotate-180 text-white text-xs font-bold tracking-widest uppercase flex-1 text-center">
          {book?.title}
        </div>

        <div className="writing-mode-vertical rotate-180 text-white/70 text-[10px] mt-3">
          {book?.subject}
        </div>

      </div>

    </div>

  )
}

function MyNotes() {

  const navigate = useNavigate()

  const [notes, setNotes] = useState([])

  useEffect(() => {

    loadNotes()

  }, [])
  const handleShare = async (noteId) => {

    try {

      const response = await fetch(
        `https://smart-notebook-backend.onrender.com/make-public/${noteId}`,
        {
        method: "POST"
        }
      )

      const data = await response.json()

      if (data.success) {

        alert("Note Shared To Community 🚀")

      }

    } catch (error) {

      console.error(error)

      alert("Share Failed")

    }

  }

  const loadNotes = async () => {

    try {

      const storedUser = JSON.parse(
        localStorage.getItem("user")
      )

      const email =
        storedUser?.user?.email

      if (!email) return

      const response = await fetch(
        `https://smart-notebook-backend.onrender.com/my-notes/${email}`
      )

      const data = await response.json()

      if (data.success) {

        setNotes(data.notes)

      }

    } catch (error) {

      console.error(error)

    }

  }

  return (

    <MainLayout>

      <div className="space-y-10">

        {/* Header */}

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">

          <div>

            <h1 className="text-6xl font-black text-gray-900">
              My Library
            </h1>

            <p className="text-xl text-gray-500 mt-3">
              Your intellectual garden, shelved and ready for study.
            </p>

          </div>

          <div className="flex gap-3">

            <input
              type="text"
              placeholder="Search library..."
              className="px-5 py-3 rounded-2xl bg-white shadow-md outline-none w-72"
            />

            <button className="px-6 py-3 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all">
              Filter
            </button>

          </div>

        </div>

        {/* Shelf */}

        <div className="mb-16">

          <div className="bg-[#24160f] rounded-xl p-6 shadow-2xl border-x-[10px] border-[#3b2418]">

            <div className="flex items-end gap-4 flex-wrap">

              {notes.map((note) => (

                <div
                  key={note.id}
                  className="flex flex-col items-center gap-2"
                >
                  <Book
                    book={note}
                    onClick={() => navigate(`/note/${note.id}`)}
                  />
                </div>

                 ))}

              <div
                onClick={() => navigate("/upload")}
                className="w-[65px] h-[240px] border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center text-white/40 text-3xl hover:bg-white/5 transition-all cursor-pointer"
              >

                +

              </div>

            </div>

            <div className="h-5 bg-gradient-to-b from-[#5d4037] to-[#3e2723] rounded-sm mt-2 shadow-xl"></div>

          </div>

        </div>

        {notes.length === 0 && (

          <div className="text-center text-gray-500 text-xl">

            No notes found. Upload your first note 🚀

          </div>

        )}

        {/* Floating Button */}

        <button
          onClick={() => navigate("/upload")}
          className="fixed bottom-10 right-10 bg-gradient-to-r from-indigo-700 to-purple-600 text-white px-6 py-4 rounded-full shadow-2xl hover:scale-105 transition-all"
        >

          + New Note

        </button>

      </div>

    </MainLayout>

  )
}

export default MyNotes