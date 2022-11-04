import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <div className="m-8">
      <h1 className="text-center text-4xl font-bold">You are signed in</h1>
    </div>
  ) : (
    <div className="m-8">
      <h1 className="text-center text-4xl font-bold">You are not signed in</h1>
    </div>
  );
};

LandingPage.getInitialProps = async (context) => {
  const { data } = await buildClient(context)
    .get("/api/users/currentuser")
    .catch((err) => err.message);

  return data;
};

export default LandingPage;
