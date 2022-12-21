import Link from "next/link"

const OrderIndex = ({ orders }) => {
  console.log(orders.length)

  const orderList = orders.map((order) => {
    return (
      <tr
        key={order.id}
        className=" border-b transition duration-300 ease-in-out hover:bg-gray-100 relative"
      >
        <td className="text-lg text-gray-900 font-light whitespace-nowrap m-0 text-center">
          {order.ticket.title}
        </td>
        <td className="text-lg text-gray-900 font-light whitespace-nowrap m-0 text-center">
          {order.status}
        </td>
        <td className="pb-4 text-gray-900 font-light whitespace-nowrap m-0 text-center">
          {order.status === "complete" ? (
            ""
          ) : (
            <Link
              className="px-5 py-1 bg-gray-300 text-black font-light hover:bg-blue-900 border-gray-900 border-2 hover:text-white  focus:outline-none "
              href="/orders/[orderId]"
              as={`/orders/${order.id}`}
            >
              View
            </Link>
          )}
        </td>
      </tr>
    )
  })

  if (orders.length === 0) {
    return (
      <div className="text-center">
        <p className="text-xl">You have no order</p>
      </div>
    )
  }
  return (
    <div className="container max-w-screen-lg mx-auto p-4">
      <table className="min-w-full bg-white border-2 rounded-lg shadow-md">
        <thead className="bg-gray-200 border-b">
          <tr>
            <th className="text-lg font-bold text-gray-900  py-4 text-center">
              Title
            </th>
            <th className="text-lg font-bold text-gray-900  py-4 text-center">
              Status
            </th>
            <th className="text-lg font-bold text-gray-900  py-4 text-center">
              Link
            </th>
          </tr>
        </thead>
        <tbody key={orderList}>{orderList}</tbody>
      </table>
    </div>
  )
}

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/orders")

  return { orders: data }
}

export default OrderIndex
