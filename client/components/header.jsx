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
          <p
            className="p-4 hover:bg-gray-200 hover:rounded-lg hover:text-black"
            key={label}
          >
            {label}
          </p>
        </Link>
      )
    })

  return (
    <nav className="bg-blue-900 text-gray-100 p-2 pl-56 mb-8">
      <div className="container flex flex-wrap flex-row justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          TixHub
        </Link>
        <div>
          <ul key={links} className="inline-flex">
            {links}
          </ul>
        </div>
      </div>
    </nav>
  )
}
