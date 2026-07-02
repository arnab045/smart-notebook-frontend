import { useState } from "react"
import MainLayout from "../layouts/MainLayout"
const API = import.meta.env.VITE_API_URL

function UploadNote() {

  const storedUser = JSON.parse(
    localStorage.getItem("user")
  )

  const userEmail =
    storedUser?.user?.email || ""

  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)

  const [analysis, setAnalysis] = useState("")
  const [improvedContent, setImprovedContent] = useState("")

  const [loadingAnalysis, setLoadingAnalysis] = useState(false)
  const [loadingImprove, setLoadingImprove] = useState(false)

  const [originalFilePath, setOriginalFilePath] =
    useState("")

  const [pdfPath, setPdfPath] =
    useState("")

  const [fileType, setFileType] =
    useState("")

  const handleExtractText = async () => {
    console.log("BUTTON CLICKED")
    if (!selectedFile) {

      alert("Please select an image")

      return

    }

    try {

      const formData = new FormData()

      formData.append("file", selectedFile)

      const response = await fetch(
        "https://smart-notebook-backend.onrender.com/extract-note",
        {
          method: "POST",
          body: formData
        }
      )

      const data = await response.json()

      if (data.success) {

        // setContent(data.text)
        
        setOriginalFilePath(
          data.original_file_path
        )

        setPdfPath(
          data.pdf_path
        )

        setFileType(
          data.file_type
        )

        alert("File uploaded & Text extracted successfully ✅")

      } else {

        alert(data.message)

      }

    } catch (error) {

      console.error(error)

      alert("OCR failed")

    }

  }

  const handleAnalyzeNote = async () => {

    if (!originalFilePath) {

      alert("Please upload file first")

      return

    }

    try {

      setLoadingAnalysis(true)

      const response = await fetch(
        "https://smart-notebook-backend.onrender.com/analyze-note",
        {

          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            user_email: userEmail,
            title,
            subject,
            content,
            
            original_file_path:
              originalFilePath,

            pdf_path:
              pdfPath,

            file_type:
              fileType

          })

        }
      )

      const data = await response.json()

      if (data.success) {

        setAnalysis(data.analysis)

      }

    } catch (error) {

      console.error(error)

      alert("Analysis failed")

    } finally {

      setLoadingAnalysis(false)

    }

  }

  const handleImproveNote = async () => {

    if (!originalFilePath) {

      alert("Please upload file first")

      return

    }

    try {

      setLoadingImprove(true)

      const response = await fetch(
        "https://smart-notebook-backend.onrender.com/improve-note",
        {

          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            user_email: userEmail,
            title,
            subject,
            content,
            original_file_path:
              originalFilePath,

            pdf_path:
              pdfPath,

            file_type:
              fileType

          })

        }
      )

      const data = await response.json()

      if (data.success) {

        setImprovedContent(
          data.improved_content
        )

      }

    } catch (error) {

      console.error(error)

      alert("Improve failed")

    } finally {

      setLoadingImprove(false)

    }

  }

  const handleGenerateEnhancedPDF = async () => {

    try {

      const response = await fetch(
        `${API}/generate-enhanced-pdf`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            pdf_path: pdfPath,

            improved_content:
              improvedContent,

            title:
              title

          })

        }
      )

      const data = await response.json()
      console.log(data)

      if (data.success) {

        window.open(
          `${API}/download-pdf?path=${encodeURIComponent(data.pdf_path)}`
        )

      }

    } catch (error) {

      console.error(error)

      alert(
        "Enhanced PDF Generation Failed"
      )

    }

  }

  const handleSaveNote = async () => {

    console.log({
      user_email: userEmail,
      title,
      subject,
      content,
      originalFilePath,
      pdfPath,
      fileType
    })

    if (!title || !subject || !originalFilePath) {

      alert("Please fill all fields")

      return

    }

    try {

      const response = await fetch(
        `${API}/save-note`,
        {

          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({

            user_email: userEmail,
            title,
            subject,
            content,
            original_file_path:
              originalFilePath,

            pdf_path:
              pdfPath,

            file_type:
              fileType

          }),

        }
      )

      const data = await response.json()

      if (data.success) {

        alert("Note saved successfully ✅")

        setTitle("")
        setSubject("")
        setContent("")
        setSelectedFile(null)

        setAnalysis("")
        setImprovedContent("")

      } else {

        alert(data.message)

      }

    } catch (error) {

      console.error(error)

      alert("Save failed")

    }

  }

  return (

    <MainLayout>

      <div className="max-w-5xl mx-auto space-y-10">

        <div>

          <h1 className="text-6xl font-black text-gray-900">

            Upload Notes

          </h1>

          <p className="text-xl text-gray-500 mt-4">

            Upload handwritten or printed notes with AI OCR.

          </p>

        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/20">

          <div className="space-y-8">

            <div>

              <label className="block text-gray-700 font-semibold mb-3">

                Upload Note Image

              </label>

              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) =>
                  setSelectedFile(e.target.files[0])
                }
                className="w-full bg-white border border-gray-200 rounded-2xl p-4"
              />

            </div>

            <button
              onClick={handleExtractText}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-indigo-700 text-white font-bold shadow-xl hover:scale-[1.01] transition-all"
            >

              Upload & Process File ✨

            </button>

            <div>

              <label className="block text-gray-700 font-semibold mb-3">

                Note Title

              </label>

              <input
                type="text"
                placeholder="Example: Neural Networks"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                className="w-full px-6 py-5 rounded-2xl bg-white border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-300"
              />

            </div>

            <div>

              <label className="block text-gray-700 font-semibold mb-3">

                Subject

              </label>

              <input
                type="text"
                placeholder="Example: Computer Science"
                value={subject}
                onChange={(e) =>
                  setSubject(e.target.value)
                }
                className="w-full px-6 py-5 rounded-2xl bg-white border border-gray-200 outline-none focus:ring-2 focus:ring-purple-300"
              />

            </div>

            {/*
            <div>

              <label className="block text-gray-700 font-semibold mb-3">

                Extracted Content

              </label>

              <textarea
                rows="14"
                placeholder="OCR extracted text will appear here..."
                value={content}
                onChange={(e) =>
                setContent(e.target.value)
              }
            />

          </div>
          */}

            <div className="grid md:grid-cols-2 gap-4">

              <button
                onClick={handleAnalyzeNote}
                className="py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold shadow-lg"
              >

                {loadingAnalysis
                  ? "Analyzing..."
                  : "🔍 Analyze Note"}

              </button>

              <button
                onClick={handleImproveNote}
                className="py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold shadow-lg"
              >

                {loadingImprove
                  ? "Improving..."
                  : "✨ Improve Note"}

              </button>

            </div>

            {analysis && (

              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">

                <h3 className="font-bold text-xl mb-4">

                  AI Analysis Report

                </h3>

                <pre className="whitespace-pre-wrap text-gray-700">

                  {analysis}

                </pre>

              </div>

            )}

            {improvedContent && (

              <div className="bg-green-50 border border-green-200 rounded-2xl p-6">

                <h3 className="font-bold text-xl mb-4">

                  Improved Version

                </h3>

                <textarea
                  rows="16"
                  value={improvedContent}
                  onChange={(e) =>
                    setImprovedContent(
                      e.target.value
                    )
                  }
                  className="w-full p-4 rounded-xl border border-green-200 bg-white"
                />


                <button
                  onClick={handleGenerateEnhancedPDF}
                  className="mt-4 ml-3 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold"
                >
                  Generate Enhanced PDF 📄
                </button>

              </div>

            )}

            <button
              onClick={handleSaveNote}
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-indigo-700 to-purple-600 text-white font-bold text-lg shadow-xl hover:scale-[1.01] transition-all"
            >

              Save Note 🚀

            </button>

          </div>

        </div>

      </div>

    </MainLayout>

  )

}

export default UploadNote