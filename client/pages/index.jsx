import Link from "next/link"

const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr
        key={ticket.id}
        className=" border-b transition duration-300 ease-in-out hover:bg-gray-200 relative"
      >
        <td className=" text-gray-900 font-light whitespace-nowrap m-0 text-center">
          {ticket.title}
        </td>
        <td className=" text-gray-900 font-light whitespace-nowrap m-0 text-center">
          {ticket.price}
        </td>
        <td className="pb-4 text-gray-900 font-light whitespace-nowrap m-0 text-center">
          <Link
            className="px-5 py-1 bg-gray-300 text-black font-medium hover:bg-blue-900 border-gray-900 border-2 hover:text-white  focus:outline-none "
            href="/tickets/[ticketId]"
            as={`/tickets/${ticket.id}`}
          >
            View
          </Link>
        </td>
      </tr>
    )
  })

  return (
    <div className="max-w-screen-lg mx-auto mt-8 ">
      <h1 className="text-2xl">Tickets</h1>
      <table className="min-w-full">
        <thead className="bg-gray-200 border-b">
          <tr>
            <th className="text-lg font-bold text-gray-900  py-4 text-center">
              Title
            </th>
            <th className="text-lg font-bold text-gray-900  py-4 text-center">
              Price
            </th>
            <th className="text-lg font-bold text-gray-900  py-4 text-center">
              Link
            </th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  )
}

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get("/api/tickets")
  return { ticket: data }
}

export default LandingPage
