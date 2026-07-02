import API from "./axios"

export const getNotes = async () => {

  const response = await API.get("/notes")

  return response.data

}

export const uploadNote = async (formData) => {

  const response = await API.post("/upload-note", formData)

  return response.data

}