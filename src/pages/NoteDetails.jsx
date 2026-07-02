import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
const API = import.meta.env.VITE_API_URL

function NoteDetails() {

  const { id } = useParams()

  const navigate = useNavigate()

  const [note, setNote] = useState(null)

  const [currentPage, setCurrentPage] = useState(0)

  const [loadingQuiz, setLoadingQuiz] = useState(false)

  useEffect(() => {

    loadNote()

  }, [])

  const loadNote = async () => {

    try {

      const response = await fetch(
        `${API}/note/${id}`
      )

      const data = await response.json()
      console.log(data)

      if (data.success) {

        setNote(data.note)

      }

    } catch (error) {

      console.error(error)

    }

  }

  if (!note) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        Loading...

      </div>

    )

  }

  const pdfUrl =
  note?.pdf_path
    ? `https://smart-notebook-backend.onrender.com/pdf/${note.pdf_path.split("/").pop()}`
    : null

  const pageImages =
  note.page_images || []

  const totalPages =
  pageImages.length + 1

  const nextPage = () => {

    if (
      currentPage <
      totalPages - 1
    ) {

      setCurrentPage(
        currentPage + 1
      )

    }

  }

  const prevPage = () => {

    if (
      currentPage > 0
    ) {

      setCurrentPage(
        currentPage - 1
      )

    }

  }
 
  const generateQuiz = async () => {

  try {

    setLoadingQuiz(true)

    const response = await fetch(
      "https://smart-notebook-backend.onrender.com/generate-quiz",
      {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          user_email: "",

          title: note.title,

          subject: note.subject,

          content: note.content

        })

      }
    )

    const data = await response.json()

    if (data.success) {

      let quizData

      try {

        quizData = JSON.parse(
          data.quiz
        )

      } catch {

        alert(
          "Quiz generation failed. Gemini did not return valid JSON."
        )

        return

      }

      navigate(
        "/quiz",
        {

          state: {

            questions:
              quizData.questions

          }

        }
      )

    }

  } catch (error) {

    console.error(error)

    alert("Quiz generation failed")

  } finally {

    setLoadingQuiz(false)

  }

}

const handleShare = async () => {

  try {

    const response = await fetch(
      `https://smart-notebook-backend.onrender.com/make-public/${id}`,
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



  return (

    <div className="min-h-screen bg-slate-100 overflow-hidden">

      {/* HEADER */}

      <header className="h-16 bg-white/80 backdrop-blur border-b flex items-center justify-between px-6">

        <div className="flex items-center gap-4">

          <button
            onClick={() =>
              navigate("/mynotes")
            }
            className="p-2 rounded-full hover:bg-slate-100"
          >
            ←
          </button>

          <h1 className="font-bold text-xl bg-gradient-to-r from-indigo-700 to-purple-600 bg-clip-text text-transparent">

            Smart Notebook AI

          </h1>

        </div>

        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-700 to-purple-600"></div>

      </header>

      {/* TOOLBAR */}

      <div className="bg-white/50 backdrop-blur border-b px-4 py-3 flex gap-3 overflow-x-auto">

        <button className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-700 to-purple-600 text-white text-sm">

          ✨ Improve

        </button>

        <button
          onClick={() =>
            navigate(`/ai-tutor/${id}`)
          }
          className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-700 to-purple-600 text-white text-sm"
        >

          🤖 Ask Tutor

        </button>

        <button 
          onClick={generateQuiz}
          className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-700 to-purple-600 text-white text-sm"
        >

          {
            loadingQuiz
              ? "Generating..."
              : "🧠 Quiz"
          }

        </button> 
        
        <button
          onClick={() =>
            navigate("/tutor", {
              state: {
                noteTitle: note.title,
                noteContent: note.content
              }
            })
          }
          className="..."
        >
          🧠 Discuss With Einstein
        </button>

        <button 
          onClick={handleShare}
          className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-700 to-purple-600 text-white text-sm"
        > 

          📤 Share

        </button>

      </div>

      {/* BOOK */}

      <div className="book-container">

        <div className="book">

          {/* COVER */}

          <div
            className={`page ${
              currentPage >= 1
                ? "flipped"
                : ""
            }`}
            style={{
              zIndex:
                totalPages + 10
            }}
          >

            <div className="page-front">

              <div className="page-shadow"></div>

              <div className="mt-10">

                <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">

                  {note.subject}

                </span>

                <h1 className="text-4xl font-black mt-6 mb-6">

                  {note.title}

                </h1>

                <p className="text-gray-500">

                  Smart Notebook AI

                </p>

              </div>

              <div className="h-56 rounded-2xl bg-gradient-to-br from-indigo-700 to-purple-600 flex items-center justify-center text-8xl text-white mt-10">

                📖

              </div>

              <div className="page-number">

                Cover

              </div>

            </div>

            <div className="page-back">

              <div className="page-shadow"></div>

            </div>

          </div>

          {/* CONTENT PAGES */}

          {pageImages.map(
            (
              imagePath,
              index
            ) => (

              <div
                key={index}
                className={`page ${
                  currentPage >
                  index + 1
                    ? "flipped"
                    : ""
                }`}
                style={{
                  zIndex:
                    totalPages -
                    index
                }}
              >

                <div className="page-front">

                  <div className="page-shadow"></div>

                  <img
                    src={`https://smart-notebook-backend.onrender.com/page-images/${imagePath.split("/").pop()}`}
                    alt={`Page ${index + 1}`}
                    className="w-full h-full object-contain rounded-xl"
                  />

                  <div className="page-number">

                    {index + 1}

                  </div>

                </div>

                <div className="page-back">

                  <div className="page-shadow"></div>

                </div>

              </div>

            )
          )}

        </div>

      </div>

      {/* CONTROLS */}

      <div className="fixed bottom-6 left-0 w-full flex justify-center gap-6 items-center">

        <button
          onClick={prevPage}
          className="w-12 h-12 rounded-full bg-white shadow-lg hover:scale-110 transition-all"
        >

          ◀

        </button>

        <div className="bg-black text-white px-5 py-2 rounded-full">

          {currentPage + 1}
          {" / "}
          {totalPages}

        </div>

        <button
          onClick={nextPage}
          className="w-12 h-12 rounded-full bg-white shadow-lg hover:scale-110 transition-all"
        >

          ▶

        </button>

      </div>

      {/* AI BUTTON */}

      <button
        onClick={() =>
          navigate(`/ai-tutor/${id}`)
        }
        className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-700 to-purple-600 text-white text-sm">

        🤖 

      </button>

    </div>

  )

}

export default NoteDetails