import MainLayout from "../layouts/MainLayout"
import { useEffect, useState } from "react"
const API = import.meta.env.VITE_API_URL

const scholars = [

  {
    name: "Sarah Wong",
    field: "Neuroscience • Harvard",
  },

  {
    name: "David Kim",
    field: "Philosophy • Yale",
  },

  {
    name: "Elena Bianchi",
    field: "Art History • Sorbonne",
  },

]

function PostCard({ post }) {
  const [expanded, setExpanded] = useState(false)
  const [likes, setLikes] = useState(post.likes)
  const [liked, setLiked] = useState(post.liked)

  const [showComments, setShowComments] = useState(false)

  const [comments, setComments] = useState([])

  const [commentCount, setCommentCount] =
  useState(post.comments)

  const [newComment, setNewComment] = useState("")
  const [showSave, setShowSave] = useState(false)

  const [saveTitle, setSaveTitle] = useState(post.title)

  const [saveSubject, setSaveSubject] = useState(post.subject)

  const handleLike = async () => {

    const storedUser = JSON.parse(
      localStorage.getItem("user")
    )

    if (!storedUser) return

    const response = await fetch(

      `${API}/community/like`,

      {

        method: "POST",

        headers: {

          "Content-Type": "application/json"

        },

        body: JSON.stringify({

          note_id: post.id,

          user_email: storedUser.user.email

        })

      }

    )

    const data = await response.json()

    if (data.success) {

      setLiked(data.liked)

      setLikes(data.likes)

    }

  }

  const loadComments = async () => {

    const response = await fetch(

      `${API}/community/comments/${post.id}`

    )

    const data = await response.json()

    if (data.success) {

      setComments(data.comments)

    }

  }

  const handleComment = async () => {

    const storedUser = JSON.parse(
      localStorage.getItem("user")
    )

    if (!newComment.trim()) return

    const response = await fetch(

      `${API}/community/comment`,

      {

        method: "POST",

        headers: {

          "Content-Type": "application/json"

          },

        body: JSON.stringify({

          note_id: post.id,

          user_email: storedUser.user.email,

          comment: newComment

        })

      }

    )

    const data = await response.json()

    if (data.success) {

      setComments(data.comments)

      setCommentCount(data.comments.length)

      setNewComment("")

    }

  }

  const handleSave = async () => {

    const storedUser = JSON.parse(
      localStorage.getItem("user")
    )

    const response = await fetch(

      `${API}/community/save`,

      {

        method: "POST",

        headers: {

          "Content-Type": "application/json"

        },

        body: JSON.stringify({

          user_email: storedUser.user.email,

          title: saveTitle,

          subject: saveSubject,

          content: post.content

        })

      }

    )

    const data = await response.json()

    if (data.success) {

      alert("✅ Note saved successfully")

      setShowSave(false)

    }

  }

  const openOriginalNote = () => {

    window.open(

      `/note/${post.id}`,

      "_blank"

    )

  }

  return (

    <article className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/20 hover:-translate-y-1 transition-all duration-300">

      {/* Header */}
      <div className="flex justify-between items-start mb-5">

        <div className="flex gap-4">

          <img
            src={`https://i.pravatar.cc/150?u=${post.name}`}
            alt={post.name}
            className="w-14 h-14 rounded-2xl"
          />

          <div>

            <h3 className="font-bold text-lg text-gray-800">

              {post.name}

            </h3>

            <p className="text-sm text-gray-500">

              {post.user_email}

            </p>

          </div>

        </div>

        <button className="text-indigo-700 font-semibold hover:underline">

          + Follow

        </button>

      </div>

      {/* Content */}
      <div>

        <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase mb-4">

          Note Shared

        </span>

        <h2 className="text-2xl font-bold text-gray-800 mb-3">

          {post.title}

        </h2>

        {
          post.file_type === "text" ? (

            <>

              <p className="text-gray-600 leading-relaxed mb-5">

                {
                  expanded
                    ? post.content
                    : post.content.slice(0, 250) + "..."
                }

              </p>

              <button
                onClick={() => setExpanded(!expanded)}
                className="text-purple-600 font-semibold"
              >

                {
                  expanded
                    ? "Show Less"
                    : "See More"
                }

              </button>

              <button
                onClick={openOriginalNote}
                className="mt-4 text-indigo-600 font-semibold hover:underline"
              >

                📖 Open Original Note

              </button>

            </>

          ) : post.file_type === "pdf" ? (

            <div
              onClick={openOriginalNote}
              className="bg-slate-100 rounded-2xl p-6 mt-4 cursor-pointer hover:bg-slate-200 transition"
            >

              <div className="text-5xl mb-3">

                📑

              </div>

              <h3 className="font-bold text-lg">

                PDF Document

              </h3>

              <p className="text-gray-500">

                click to view

              </p>

              <div
                onClick={openOriginalNote}
                className="mt-4 text-indigo-600 font-semibold cursor-pointer"
              >

                📖 Open Original Note

              </div>

            </div>

          ) : (

            <div
              onClick={openOriginalNote}
              className="bg-slate-100 rounded-2xl p-6 mt-4 cursor-pointer hover:bg-slate-200 transition"
            >

              <div className="text-5xl mb-3">

                📄

              </div>

              <h3 className="font-bold text-lg">

                Image Note

              </h3>

              <p className="text-gray-500">

                click to view

              </p>

            </div>

          )
        }

      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t pt-4">

        <div className="flex gap-6 text-gray-500">

          <button
            onClick={handleLike}
            className="hover:text-purple-600 transition-all"
          >

            {liked ? "💜" : "🤍"} {likes}

          </button>

          <button
            onClick={async () => {

              await loadComments()

              setShowComments(true)

            }}
            className="hover:text-indigo-700 transition-all"
          >

            💬 {commentCount}

          </button>

          <button
            onClick={() => setShowSave(true)}
            className="hover:text-indigo-700 transition-all"
          >

            🔖 Save

          </button>

        </div>

        <span className="text-sm text-gray-400">

          Recently Shared

        </span>

      </div>

      {
      showComments && (

      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-3xl w-[500px] p-6">

      <h2 className="text-2xl font-bold mb-4">

      Comments

      </h2>

      <div className="space-y-3 max-h-72 overflow-y-auto">

      {

      comments.map(

      (c,index)=>(

      <div
      key={index}
      className="bg-slate-100 rounded-xl p-3"
      >

      <p className="text-xs text-gray-500">

      {c.user_email}

      </p>

      <p>

      {c.comment}

      </p>

      </div>

      )

      )

      }

      </div>

      <textarea

      value={newComment}

onChange={(e)=>

setNewComment(

e.target.value

)

}

placeholder="Write a comment..."

className="w-full border rounded-xl p-3 mt-4"

      />

      <div className="flex justify-end gap-3 mt-4">

      <button

      onClick={()=>

setShowComments(false)

}

className="px-4 py-2"

      >

      Close

      </button>

      <button

      onClick={handleComment}

      className="px-4 py-2 bg-purple-600 text-white rounded-xl"

      >

      Post

      </button>

      </div>

      </div>

      </div>

      )
      }

      {
        showSave && (

          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-3xl w-[500px] p-6">

              <h2 className="text-2xl font-bold mb-5">

                Save Note

              </h2>

              <div className="space-y-4">

                <div>

                  <label className="block text-sm text-gray-500 mb-2">

                    Title

                  </label>

                  <input
                    type="text"
                    value={saveTitle}
                    onChange={(e) => setSaveTitle(e.target.value)}
                    className="w-full border rounded-xl p-3"
                  />

                </div>

                <div>

                  <label className="block text-sm text-gray-500 mb-2">

                    Subject

                  </label>

                  <input
                    type="text"
                    value={saveSubject}
                    onChange={(e) => setSaveSubject(e.target.value)}
                    className="w-full border rounded-xl p-3"
                  />

                </div>

              </div>

              <div className="flex justify-end gap-3 mt-6">

                <button
                  onClick={() => setShowSave(false)}
                  className="px-5 py-2 rounded-xl border"
                >

                  Cancel

                </button>

                <button
                  onClick={handleSave}
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white"
                >

                  Save

                </button>

              </div>

            </div>

          </div>

        )
      }

    </article>

  )
}

function Community() {
  const [posts, setPosts] = useState([])
  useEffect(() => {

    const fetchPosts = async () => {

      try {

        const storedUser = JSON.parse(
          localStorage.getItem("user")
        )

        const email =
          storedUser?.user?.email || ""

        const response = await fetch(

          `${API}/community/posts?user_email=${email}`

        )

        const data = await response.json()

        if (data.success) {

          setPosts(data.posts)

        }

      } catch (error) {

        console.error(error)

      }

    }

    fetchPosts()

  }, [])

  return (

    <MainLayout>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* FEED */}
        <div className="xl:col-span-2 space-y-8">

          {/* Filter */}
          <div className="flex gap-3 overflow-x-auto pb-2">

            <button className="px-5 py-2 rounded-full bg-gradient-to-r from-indigo-700 to-purple-600 text-white whitespace-nowrap">

              All Posts

            </button>

            <button className="px-5 py-2 rounded-full bg-white shadow-md whitespace-nowrap">

              Computer Science

            </button>

            <button className="px-5 py-2 rounded-full bg-white shadow-md whitespace-nowrap">

              Economics

            </button>

            <button className="px-5 py-2 rounded-full bg-white shadow-md whitespace-nowrap">

              Neuroscience

            </button>

          </div>

          {/* Posts */}
          {posts.map((post, index) => (

            <PostCard key={index} post={post} />

          ))}

        </div>

        {/* RIGHT SIDEBAR */}
        <div className="hidden xl:block space-y-8">

          {/* Trending */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/20">

            <h3 className="text-sm uppercase tracking-widest text-gray-500 font-bold mb-6">

              Trending Tags

            </h3>

            <div className="space-y-5">

              <div className="flex justify-between">

                <span>#MachineLearning</span>

                <span className="text-gray-400 text-sm">

                  1.2k

                </span>

              </div>

              <div className="flex justify-between">

                <span>#OrganicChemistry</span>

                <span className="text-gray-400 text-sm">

                  850

                </span>

              </div>

              <div className="flex justify-between">

                <span>#LegalTech</span>

                <span className="text-gray-400 text-sm">

                  620

                </span>

              </div>

              <div className="flex justify-between">

                <span>#StudyTips</span>

                <span className="text-gray-400 text-sm">

                  2.4k

                </span>

              </div>

            </div>

          </div>

          {/* Scholars */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/20">

            <h3 className="text-sm uppercase tracking-widest text-gray-500 font-bold mb-6">

              Scholars To Follow

            </h3>

            <div className="space-y-5">

              {scholars.map((scholar, index) => (

                <div
                  key={index}
                  className="flex items-center gap-4"
                >

                  <img
                    src={`https://i.pravatar.cc/100?u=${scholar.name}`}
                    alt={scholar.name}
                    className="w-12 h-12 rounded-full"
                  />

                  <div className="flex-1">

                    <h4 className="font-semibold">

                      {scholar.name}

                    </h4>

                    <p className="text-xs text-gray-500">

                      {scholar.field}

                    </p>

                  </div>

                  <button className="text-indigo-700">

                    +

                  </button>

                </div>

              ))}

            </div>

          </div>

          {/* Promo */}
          <div className="rounded-3xl p-8 bg-gradient-to-br from-indigo-700 to-purple-600 text-white relative overflow-hidden">

            <h3 className="text-2xl font-bold mb-3">

              Join a Study Pod

            </h3>

            <p className="text-sm opacity-90 mb-6">

              Get matched with students in your subject for AI-led deep dives.

            </p>

            <button className="bg-white text-indigo-700 px-5 py-3 rounded-2xl font-bold">

              Start Matching

            </button>

            <div className="absolute -bottom-10 -right-10 text-[120px] opacity-10">

              ✨

            </div>

          </div>

        </div>

      </div>

    </MainLayout>

  )
}

export default Community