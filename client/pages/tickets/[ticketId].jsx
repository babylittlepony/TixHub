import Router from "next/router";
import useRequest from "../../hooks/use-request";

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      Router.push("/orders/[orderId]", `/orders/${order.id}`),
  });

  return (
    <div className="max-w-screen-lg m-8 ">
      <p className="text-xl">Title: {ticket.title}</p>
      <p className="text-xl py-4">Price: ${ticket.price}</p>
      {errors}
      <button
        onClick={doRequest}
        className="px-2 py-1  bg-gray-300 text-black text-lg font-medium hover:bg-blue-900 border-gray-900 border-4 hover:text-white  focus:outline-none"
      >
        Purchase
      </button>
    </div>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};

export default TicketShow;
