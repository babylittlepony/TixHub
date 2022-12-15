import { useState } from "react"
import Router from "next/router"
import useRequest from "../../hooks/use-request"

const NewTicket = () => {
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")

  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: {
      title,
      price,
    },
    onSuccess: () => Router.push("/"),
  })

  const onSubmit = (event) => {
    event.preventDefault()

    doRequest()
  }

  const onBlur = () => {
    // Create a 2 digits decimal number
    const val = parseFloat(price)

    if (isNaN(val)) {
      return
    }

    setPrice(val.toFixed(2))
  }

  return (
    <div className="w-full max-w-sm mx-auto ">
      <h1 className="text-center text-2xl mb-4">Create a Ticket</h1>
      <form className=" mx-auto w-[90%]" onSubmit={onSubmit}>
        <div className="mb-6 md:flex md:items-center">
          <label className="block text-xl font-medium text-gray-900 pr-4  md:text-right md:mb-0 ">
            Title:
          </label>
          <div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              className="bg-gray-200 appearance-none border-gray-200 rounded w-full py-2 px-4 text-gray-900 leading-tight focus:outline-none"
            />
          </div>
        </div>
        <div className="mb-6 w-full md:flex md:items-center">
          <label className="block text-xl font-medium text-gray-900 pr-2">
            Price:
          </label>
          <div>
            <input
              value={price}
              onBlur={onBlur}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              min={0}
              className="block w-full bg-gray-200 appearance-none border-gray-200 rounded  py-2 px-4 text-gray-900 leading-tight focus:outline-none"
            />
          </div>
        </div>
        {errors}
        <button className="block w-full px-5 py-2.5  bg-gray-300 text-black text-lg font-medium hover:bg-blue-900 border-gray-900 border-4 hover:text-white  focus:outline-none">
          Submit
        </button>
      </form>
    </div>
  )
}

export default NewTicket
