import Link from "next/link";

export default ({ currentUser }) => {
  return (
    <nav className="m-4 ">
      <div className="container flex flex-wrap items-center justify-between">
        <Link href="/">TickHub</Link>
      </div>
    </nav>
  );
};
