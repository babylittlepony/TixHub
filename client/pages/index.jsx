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

LandingPage.getInitialProps = async (context, currentUser) => {
  return {};
};

export default LandingPage;
