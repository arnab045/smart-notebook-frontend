import API from "./axios"

export const askTutor = async (message) => {

  const response = await API.post("/ask-ai", {

    message,

  })

  return response.data

}