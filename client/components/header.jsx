import Link from "next/link";

export default ({ currentUser }) => {
  const links = [
    !currentUser && { label: "Sign Up", href: "/auth/signup" },
    !currentUser && { label: "Sign In", href: "/auth/signin" },
    currentUser && { label: "Sign Out", href: "/auth/signout" },
  ]
    .filter((link) => link)
    .map(({ label, href }) => {
      return (
        <Link href={href}>
          <p className="px-4" key={label}>
            {label}
          </p>
        </Link>
      );
    });

  return (
    <nav className="m-4 ">
      <div className="container flex flex-wrap flex-row justify-between ">
        <Link href="/">TickHub</Link>
        <div className="inline-flex">{links}</div>
      </div>
    </nav>
  );
};
