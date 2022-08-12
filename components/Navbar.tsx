import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed z-20 flex h-12 w-screen flex-row items-center justify-between border-b-2 border-black/5 bg-gradient-to-r from-indigo-800 via-blue-800 to-indigo-800 px-6 text-white shadow-md">
      <Link href="/">
        <a className="text-2xl">Traveler</a>
      </Link>
      <div className="space-x-12">
        <Link href="/">Home</Link>
        <Link href="/">Search</Link>
        <Link href="/">Log In</Link>
      </div>
    </nav>
  );
}
