import { useEffect, useState } from "react"
import MainLayout from "../layouts/MainLayout"
const API = import.meta.env.VITE_API_URL

function NoteCard({ note }) {

  return (

    <article className="bg-white/70 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20 shadow-lg hover:-translate-y-1 transition-all duration-300">

      <div className="flex flex-col md:flex-row">

        <div className="w-full md:w-56 h-48 md:h-auto overflow-hidden">

          <img
            src={note.image}
            alt={note.title}
            className="w-full h-full object-cover hover:scale-105 transition-all duration-500"
          />

        </div>

        <div className="flex-1 p-8">

          <div className="flex justify-between items-start mb-4">

            <h2 className="text-3xl font-bold text-gray-800">

              {note.title}

            </h2>

            <button className="text-gray-400 hover:text-indigo-700">

              🔖

            </button>

          </div>

          <p className="text-gray-600 leading-relaxed mb-6">

            {note.description}

          </p>

          <div className="flex flex-wrap gap-2 mb-6">

            {note.tags.map((tag, index) => (

              <span
                key={index}
                className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium"
              >

                #{tag}

              </span>

            ))}

          </div>

          <div className="flex items-center justify-between border-t pt-4">

            <div className="flex gap-6 text-gray-500">

              <button className="hover:text-red-500 transition-all">

                ❤️ {note.likes}

              </button>

              <button className="hover:text-indigo-700 transition-all">

                💬 {note.comments}

              </button>

              <button className="hover:text-purple-700 transition-all">

                ↗ Share

              </button>

            </div>

            <span className="text-sm text-gray-400">

              👁 {note.views} views

            </span>

          </div>

        </div>

      </div>

    </article>

  )
}

function Profile() {

  const [profile, setProfile] = useState(null)
  
  const [showEdit, setShowEdit] = useState(false)

  const [bio, setBio] = useState("")
  const [university, setUniversity] = useState("")
  const [department, setDepartment] = useState("")
  const [skills, setSkills] = useState("")

  const [notes, setNotes] = useState([])

  useEffect(() => {

    const fetchProfile = async () => {

      const user =
        JSON.parse(localStorage.getItem("user"))

      const email =
        user?.user?.email

      if (!email) return

      try {

        const response = await fetch(
          `https://smart-notebook-backend.onrender.com/profile/${email}`
        )

        const data =
          await response.json()

        if (data.success) {

          setProfile(data.profile)

          setBio(data.profile.bio || "")
          setUniversity(data.profile.university || "")
          setDepartment(data.profile.department || "")
          setSkills(data.profile.skills || "")

          
          setNotes(
            data.notes || []
          )

        }

      } catch (error) {

        console.error(error)

      }

    }

    fetchProfile()

  }, [])

  const handleSaveProfile = async () => {

    try {

      const response = await fetch(
        "https://smart-notebook-backend.onrender.com/update-profile",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            email: profile.email,

            bio,
            university,
            department,
            skills

          })
        }
      )

      const data = await response.json()

      if (data.success) {

        alert("Profile Updated ✅")

        setProfile({

          ...profile,

          bio,
          university,
          department,
          skills

        })

        setShowEdit(false)

      }

    } catch (error) {

      console.error(error)

      alert("Update Failed")

    }

  }


  if (!profile) {

    return (

      <MainLayout>

        <div className="text-center py-20">

          Loading Profile...

        </div>

      </MainLayout>

    )

  }


  return (

    <MainLayout>
      {
        showEdit && (

          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-white p-8 rounded-3xl w-full max-w-xl space-y-4">

              <h2 className="text-2xl font-bold">

                Edit Profile
              </h2>

            <textarea
              placeholder="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full border p-3 rounded-xl"
            />

            <input
              type="text"
              placeholder="University"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="w-full border p-3 rounded-xl"
            />

            <input
              type="text"
              placeholder="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full border p-3 rounded-xl"
            />

            <input
              type="text"
              placeholder="Skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full border p-3 rounded-xl"
            />

            <div className="flex gap-3">

              <button
                onClick={handleSaveProfile}
                className="bg-green-600 text-white px-5 py-2 rounded-xl"
              >
                Save
              </button>

              <button
                onClick={() => setShowEdit(false)}
                className="bg-gray-300 px-5 py-2 rounded-xl"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )
    }

      <div className="max-w-6xl mx-auto space-y-10">

        {/* PROFILE HEADER */}

        <section className="bg-white/70 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-xl relative overflow-hidden">

          <div className="absolute top-[-80px] right-[-80px] w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl"></div>

          <div className="flex flex-col lg:flex-row items-center gap-10 relative z-10">

            {/* Avatar */}
            <div className="relative">

              <img
                src="https://i.pravatar.cc/300"
                alt="profile"
                className="w-40 h-40 rounded-full border-4 border-white shadow-2xl object-cover"
              />

              <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-gradient-to-r from-indigo-700 to-purple-600 flex items-center justify-center text-white shadow-lg">

                ✓

              </div>

            </div>

            {/* Info */}
            <div className="flex-1 text-center lg:text-left">

              <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">

                <h1 className="text-6xl font-black text-gray-900">

                  {profile.full_name}

                </h1>

                <button 
                  onClick={() => setShowEdit(true)}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-700 to-purple-600 text-white font-bold shadow-lg hover:scale-105 transition-all">

                  Edit Profile

                </button>

              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">

                <span className="px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold">

                  🎓 {profile.department || "Department Not Set"}

                </span>

                <span className="px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold">

                  🏫 {profile.university || "University Not Set"}

                </span>

              </div>

              <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">

                {profile.bio || "No bio added yet."}

              </p>

            </div>

          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 border-t mt-10 pt-8">

            <div className="text-center">

              <h2 className="text-4xl font-black text-indigo-700">

                {profile.notes_shared}

              </h2>

              <p className="text-gray-500 mt-2">

                Notes Shared

              </p>

            </div>

            <div className="text-center border-x">

              <h2 className="text-4xl font-black text-indigo-700">

                {profile.followers}

              </h2>

              <p className="text-gray-500 mt-2">

                Followers

              </p>

            </div>

            <div className="text-center">

              <h2 className="text-4xl font-black text-indigo-700">

                {profile.following}

              </h2>

              <p className="text-gray-500 mt-2">

                Following

              </p>

            </div>

          </div>

        </section>

        {/* TITLE */}

        <div className="flex items-center justify-between">

          <h2 className="text-3xl font-bold text-gray-900">

            Publicly Shared Notes

          </h2>

          <div className="flex gap-3">

            <button className="p-3 rounded-2xl bg-white shadow-md">

              ⬜

            </button>

            <button className="p-3 rounded-2xl bg-indigo-100 text-indigo-700">

              ☰

            </button>

          </div>

        </div>

        {/* NOTES */}

        <div className="space-y-8">

          {notes.map((note, index) => (

            <NoteCard key={index} note={note} />

          ))}

        </div>

      </div>

    </MainLayout>

  )
}

export default Profile