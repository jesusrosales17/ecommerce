import Link from "next/link"

export const Logo = () => {
  return (
    <Link href="/"  className="text-xl sm:text-2xl flex items-center font-medium">
      <span className="text-white font-bold rounded-full px-2 sm:px-3 text-2xl sm:text-3xl bg-blue-900">
        E
      </span>
      commerce
    </Link>
  )
}
