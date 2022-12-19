import { useState } from "react"
import Router from "next/router"

import useRequest from "../../hooks/use-request"

export default () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { doRequest, errors } = useRequest({
    url: "/api/users/signup",
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push("/"),
  })

  const onSubmit = async (event) => {
    event.preventDefault()
    doRequest()
  }

  return (
    <div className="container w-full max-w-sm mx-auto">
      <form onSubmit={onSubmit} className="text-center">
        <h1 className="text-4xl mb-4">Sign Up</h1>
        <div className="mb-6 md:flex md:items-center">
          <label className="text-xl font-medium text-gray-900 pr-4 md:mb-0">
            Email Address
          </label>
          <div className="bg-gray-200 appearance-none border-gray-200 rounded py-2 w-full">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="bg-gray-200 text-gray-900 leading-tight focus:outline-none"
            />
          </div>
        </div>
        <div className="mb-6 md:flex md:items-center">
          <label className="block text-xl font-medium text-gray-900 pr-5 md:mb-0">
            Password
          </label>
          <div className="bg-gray-200 appearance-none border-gray-200 rounded py-2 w-full">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="bg-gray-200 text-gray-900 leading-tight focus:outline-none"
            />
          </div>
        </div>
        {errors}
        <button className="mt-2 py-2 px-2.5 w-full bg-gray-300 text-black text-md font-medium hover:bg-blue-900 border-gray-900 border-4 hover:text-white  focus:outline-none">
          Sign Up
        </button>
      </form>
    </div>
  )
}
