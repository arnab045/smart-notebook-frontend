import API from "./axios"

export const generateQuiz = async (topic) => {

  const response = await API.post("/generate-quiz", {

    topic,

  })

  return response.data

}