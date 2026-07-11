import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import MainLayout from "../layouts/MainLayout"
import axios from "axios"
const API = import.meta.env.VITE_API_URL

function Quiz() {

  const location = useLocation()

  const [notes, setNotes] = useState([])

  const [selectedNote, setSelectedNote] =
    useState(null)

  const [loading, setLoading] =
    useState(false) 

  const [generatedQuestions, setGeneratedQuestions] =
    useState([])

  const [numQuestions, setNumQuestions] =
    useState(10)

  const [timeLimit, setTimeLimit] =
    useState(10)

  const questions =
    generatedQuestions.length > 0
      ? generatedQuestions
      : location.state?.questions || [] 


  useEffect(() => {

    loadNotes()

  }, [])

  const [started, setStarted] = useState(false)

  const [timeLeft, setTimeLeft] =
    useState(null)

  const [completed, setCompleted] = useState(false)

  const [currentQuestion, setCurrentQuestion] = useState(0)

  useEffect(() => {

    if (!started) return

    if (timeLeft === null) return

    const timer = setInterval(() => {

      setTimeLeft(prev => {

          if (prev <= 1) {

            clearInterval(timer)

            setCompleted(true)

            return 0

          }

          return prev - 1

        })

      }, 1000)

      return () => clearInterval(timer)

    }, [started])

  const [selected, setSelected] = useState(null)

  const [score, setScore] = useState(0)

  const [correctAnswers, setCorrectAnswers] =
    useState(0)

  const [wrongAnswers, setWrongAnswers] =
    useState(0)

  const [userAnswers, setUserAnswers] =
    useState([])


  const loadNotes = async () => {

  try {

    const userData = JSON.parse(
      localStorage.getItem("user")
    )

    const userEmail =
      userData?.email ||
      userData?.user?.email 

    console.log("USER DATA:", userData)
    console.log("USER EMAIL:", userEmail)

    const res = await axios.get(
      `https://smart-notebook-backend.onrender.com/my-notes/${userEmail}`
    )

    console.log("NOTES RESPONSE:", res.data)

    setNotes(res.data.notes)

  }

  catch (err) {

    console.log(err)

  }

}

const generateQuizFromNote = async () => {

  console.log(numQuestions)

  if (!selectedNote) return

  try {

    setLoading(true)

    const noteRes =
      await axios.get(
        `https://smart-notebook-backend.onrender.com/note/${selectedNote}`
      )

    const note =
      noteRes.data.note

    const quizRes =
      await axios.post(
        "https://smart-notebook-backend.onrender.com/generate-quiz",
        {
          user_email: "",

          title: note.title,

          subject: note.subject,

          content: note.content,

          num_questions: numQuestions
        }
      )

    const quizData =

      typeof quizRes.data.quiz === "string"

        ? JSON.parse(quizRes.data.quiz)

        : quizRes.data.quiz

    setTimeLeft(timeLimit * 60)

    setGeneratedQuestions(
      quizData.questions
    )

    setStarted(true)

    console.log(quizData)
  }

  catch (err) {

    console.log(err)

  }

  finally {

    setLoading(false)

  }

}


if (!questions.length && !started) {

  return (

    <MainLayout>

      <div className="max-w-4xl mx-auto">

        <div className="bg-white rounded-3xl p-10 shadow-xl">

          <h1 className="text-5xl font-black mb-8">

            Select Note For Quiz

          </h1>

          
          
          <div className="mt-4">

            <label className="block font-semibold mb-2">
              Select Note
            </label>

            <select
              value={selectedNote || ""}
              onChange={(e) =>
                setSelectedNote(
                  Number(e.target.value)
                )
              }
              className="w-full p-4 border rounded-xl"
            >

              <option value="">
                Select Note
              </option>

              {notes.map(note => (

                <option
                  key={note.id}
                  value={note.id}
                >
                  {note.title}
                </option>

              ))}

            </select>

          </div>
          
          <div className="mt-8">

            <label className="block font-semibold mb-2">
              Number of Questions
            </label>

            <select
              value={numQuestions}
              onChange={(e) =>
                setNumQuestions(
                  Number(e.target.value)
                )
              }
              className="w-full p-4 border rounded-xl"
            >

              <option value={5}>
                5 Questions
              </option>

              <option value={10}>
                10 Questions
              </option>

              <option value={15}>
                15 Questions
              </option>

              <option value={20}>
                20 Questions
              </option>

            </select>

          </div>

          <div className="mt-6">

            <label className="block font-semibold mb-2">
              Time Limit
            </label>

            <select
              value={timeLimit}
              onChange={(e) =>
                setTimeLimit(
                  Number(e.target.value)
                )
              }
              className="w-full p-4 border rounded-xl"
            >

              <option value={5}>
                5 Minutes
              </option>

              <option value={10}>
                10 Minutes
              </option>

              <option value={15}>
                15 Minutes
              </option>

              <option value={20}>
                20 Minutes
              </option>

            </select>

          </div>

          <button

            onClick={generateQuizFromNote}

            disabled={!selectedNote}

            className="mt-8 px-8 py-4 bg-indigo-700 text-white rounded-2xl"

          >

            {loading

              ? "Generating..."

              : "Generate Quiz"}

          </button>

        </div>

      </div>

    </MainLayout>

  )

}


  const totalQuestions = questions.length

  const current = questions[currentQuestion]

  const accuracy =
    totalQuestions > 0
      ? Math.round(
          (correctAnswers / totalQuestions) * 100
        )
      : 0

  const nextQuestion = () => {

    if (selected !== null) {

      setUserAnswers(prev => [

        ...prev,

        {
          question: current.question,
          options: current.options,
          selected: selected,
          correct: current.answer,
          explanation: current.explanation
        }

      ])

      if (selected === current.answer) {

        setScore(prev => prev + 10)

        setCorrectAnswers(
          prev => prev + 1
        )

      } else {

        setWrongAnswers(
          prev => prev + 1
        )

      }

    }

    setSelected(null)

    if (currentQuestion + 1 < totalQuestions) {

      setCurrentQuestion(
        currentQuestion + 1
      )

    } else {

      setCompleted(true)

    }

  }

  return (

    <MainLayout>

      <div className="max-w-5xl mx-auto">

        {/* SETUP SCREEN */}

        {!started && !completed && (

          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-12 text-center">

            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-8">

              <span className="text-5xl">

                🧠

              </span>

            </div>

            <h1 className="text-6xl font-black text-gray-900 mb-4">

              Quiz Generator

            </h1>

            <p className="text-xl text-gray-500 mb-10">

              AI-powered active recall system for smarter studying.

            </p>

            <div className="grid grid-cols-2 gap-6 max-w-md mx-auto mb-10">

              <div className="bg-indigo-50 rounded-2xl p-6">

                <h2 className="text-4xl font-bold text-indigo-700">

                  {totalQuestions}

                </h2>

                <p className="text-gray-500 mt-2">

                  Questions

                </p>

              </div>

              <div className="bg-purple-50 rounded-2xl p-6">

                <h2 className="text-4xl font-bold text-purple-700">

                  {totalQuestions}

                </h2>

                <p className="text-gray-500 mt-2">

                  Minutes

                </p>

              </div>

            </div>

            <button
              onClick={() => setStarted(true)}
              className="px-10 py-5 bg-gradient-to-r from-indigo-700 to-purple-600 text-white rounded-full font-bold shadow-2xl hover:scale-105 transition-all"
            >

              Start Quiz 🚀

            </button>

          </div>

        )}

        {/* QUIZ SCREEN */}

        {started && !completed && (

          <div className="space-y-8">

            <div>

              <div className="flex justify-between mb-3">

                <span className="text-sm text-gray-500 uppercase font-bold">

                  Question {currentQuestion + 1} of {totalQuestions}

                </span>

                <span className="text-sm text-indigo-700 font-bold">

                  In Progress

                </span>

                <span className="text-red-600 font-bold">

                  {Math.floor(timeLeft / 60)}:
                  {String(timeLeft % 60).padStart(2, "0")}

                </span>

              </div>

              <div className="h-4 bg-white rounded-full overflow-hidden shadow-inner">

                <div
                  className="h-full bg-gradient-to-r from-indigo-700 to-purple-600 transition-all duration-500"
                  style={{
                    width:
                      `${((currentQuestion + 1) / totalQuestions) * 100}%`
                  }}
                ></div>

              </div>

            </div>

            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-10 text-center">

              <h2 className="text-4xl font-bold text-gray-900 leading-relaxed">

                {current.question}

              </h2>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {current.options.map(

                (option, index) => (

                  <button
                    key={index}
                    onClick={() => setSelected(index)}
                    className={`p-8 rounded-3xl border-2 text-left transition-all duration-300 shadow-md

                    ${
                      selected === index
                        ? "border-indigo-700 bg-indigo-100"
                        : "bg-white/70 border-transparent hover:border-indigo-300"
                    }`}
                  >

                    <div className="flex gap-5 items-start">

                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl

                        ${
                          selected === index
                            ? "bg-indigo-700 text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >

                        {String.fromCharCode(
                          65 + index
                        )}

                      </div>

                      <p className="text-lg text-gray-700 leading-relaxed">

                        {option}

                      </p>

                    </div>

                  </button>

                )

              )}

            </div>

            <div className="flex justify-end">

              <button
                onClick={nextQuestion}
                disabled={selected === null}
                className="px-10 py-5 bg-gradient-to-r from-indigo-700 to-purple-600 text-white rounded-full font-bold shadow-xl hover:scale-105 transition-all disabled:opacity-50"
              >

                {currentQuestion + 1 === totalQuestions

                  ? "Submit Quiz"

                  : "Next Question →"}

              </button>

            </div>

          </div>

        )}

        {/* RESULT SCREEN */}

        {completed && (

          <div className="space-y-8 text-center">

            <h1 className="text-7xl font-black text-indigo-700">

              Quiz Complete!

            </h1>

            <p className="text-xl text-gray-500">

              Great effort on your AI-generated assessment.

            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

              <div className="bg-white rounded-3xl shadow-xl p-8 border-t-4 border-indigo-700">

                <p className="text-gray-500 uppercase text-sm font-bold mb-2">

                  Accuracy

                </p>

                <h2 className="text-5xl font-black text-gray-900">

                  {accuracy}%

                </h2>

              </div>

              <div className="bg-white rounded-3xl shadow-xl p-8 border-t-4 border-green-500">

                <p className="text-gray-500 uppercase text-sm font-bold mb-2">

                  Correct

                </p>

                <h2 className="text-5xl font-black text-green-600">

                  {correctAnswers}

                </h2>

              </div>

              <div className="bg-white rounded-3xl shadow-xl p-8 border-t-4 border-red-500">

                <p className="text-gray-500 uppercase text-sm font-bold mb-2">

                  Incorrect

                </p>

                <h2 className="text-5xl font-black text-red-600">

                  {wrongAnswers}

                </h2>

              </div>

              <div className="bg-white rounded-3xl shadow-xl p-8 border-t-4 border-purple-500">

                <p className="text-gray-500 uppercase text-sm font-bold mb-2">

                  Score

                </p>

                <h2 className="text-5xl font-black text-purple-600">

                  {score}

                </h2>

              </div>

            </div>


            <div className="mt-10 text-left">

              <h2 className="text-3xl font-bold mb-6 text-center">

                Answer Review

              </h2>

              <div className="space-y-4">

                {userAnswers.map((item, index) => (

                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-lg p-6"
                  >

                    <h3 className="font-bold mb-4">

                      {index + 1}. {item.question}

                    </h3>

                    <p>

                      Your Answer:

                      <span
                        className={`font-bold ml-2 ${
                          item.selected === item.correct

                            ? "text-green-600"

                            : "text-red-600"
                        }`}
                      >

                        {item.options[item.selected]}

                      </span>

                    </p>

                    {item.selected !== item.correct && (

                      <p className="mt-2">

                        Correct Answer:
                        <span className="font-bold text-green-600 ml-2">
                          {item.options[item.correct]}
                        </span>
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">

                          <span className="font-bold text-blue-700">

                            Explanation:

                          </span>

                          <p className="mt-1 text-gray-700">

                            {item.explanation}

                          </p>

                        </div>

                      </p>

                    )}

                  </div>

                ))}

              </div>

            </div>


            <button
              onClick={() => {

                setStarted(false)
                setCompleted(false)
                setCurrentQuestion(0)
                setSelected(null)
                setScore(0)
                setCorrectAnswers(0)
                setWrongAnswers(0)
                setUserAnswers([])
                setTimeLeft(null)

              }}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-indigo-700 to-purple-600 text-white font-bold shadow-xl"
            >

              Try Again

            </button>

          </div>

        )}

      </div>

    </MainLayout>

  )

}

export default Quiz