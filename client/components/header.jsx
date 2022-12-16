import Link from "next/link"

export default ({ currentUser }) => {
  const links = [
    !currentUser && { label: "Sign Up", href: "/auth/signup" },
    !currentUser && { label: "Sign In", href: "/auth/signin" },
    currentUser && { label: "Sell Tickets", href: "/tickets/new" },
    currentUser && { label: "My Orders", href: "/orders" },
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
      )
    })

  return (
    <nav className="m-4">
      <div className="container flex flex-wrap flex-row justify-around">
        <Link href="/">TickHub</Link>
        <div>
          <ul className="inline-flex">{links}</ul>
        </div>
      </div>
    </nav>
  )
}
