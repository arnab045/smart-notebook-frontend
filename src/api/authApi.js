import API from "./axios"

export const loginUser = async (data) => {

  const response = await API.post("/login", data)

  return response.data

}

export const signupUser = async (data) => {

  const response = await API.post("/register", data)

  return response.data

}