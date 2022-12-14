const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr
        key={ticket.id}
        className="border-b transition duration-300 ease-in-out hover:bg-gray-100"
      >
        <td className="pb-4 text-gray-900 font-light whitespace-nowrap">
          {ticket.title}
        </td>
        <td className="pb-4 text-gray-900 font-light whitespace-nowrap">
          {ticket.price}
        </td>
      </tr>
    );
  });

  return (
    <div className="max-w-screen-lg mx-auto mt-8 ">
      <h1 className="text-2xl">Tickets</h1>
      <table className="min-w-full">
        <thead className="bg-white border-b">
          <tr>
            <th className="text-lg font-bold text-gray-900  py-4 text-left">
              Title
            </th>
            <th className="text-lg font-bold text-gray-900  py-4 text-left">
              Price
            </th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get("/api/tickets");
  return { tickets: data };
};

export default LandingPage;
