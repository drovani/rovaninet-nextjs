import {
  faDev,
  faGithub,
  faLinkedin,
  faMastodon,
  faStackOverflow,
  faTwitter
} from "@fortawesome/free-brands-svg-icons";
import { faHome, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container max-w-screen-lg mx-auto p-2 sm:p-4">
      <nav className="flex items-center justify-between flex-wrap p-6">
        <div className="flex items-center flex-shrink-0 text-black mr-6">
          <span className="font-semibold text-xl tracking-tight">
            <Link href="/">Rovani in C#</Link>
          </span>
        </div>
        <div className="block sm:hidden">
          <button className="flex items-center px-3 py-2 border rounded text-black border-black hover:text-white hover:bg-black focus:text-white focus:bg-black">
            <svg
              className="fill-current h-3 w-3"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>
        <div className="w-full block flex-grow sm:flex sm:items-center sm:w-auto border border-grey-600 p-2 mt-2 rounded sm:border-t-0 sm:border-l-0 sm:rounded-t-none sm:rounded-l-none">
          <div className="text-sm sm:flex-grow text-right">
            <Link
              href="/about/"
              className="block mt-0 sm:inline-block text-black hover:text-red-900 mr-4"
            >
              About Me
            </Link>
            <Link
              href="https://hsmercs.rovani.net/"
              className="block mt-4 sm:inline-block sm:mt-0 text-black hover:text-red-900 mr-4"
            >
              HS Mercs
            </Link>
          </div>
        </div>
      </nav>
      <main className="font-sans antialiased">{children}</main>
      <footer className="mt-4 pt-2 text-4xl space-x-1 text-center sm:space-x-2 md:space-x-4 border-t rounded-t">
        <Link href="/" title="Rovani in C#" className=" hover:text-red-900">
          <FontAwesomeIcon icon={faHome} />
        </Link>
        <Link
          href="https://github.com/drovani"
          title="drovani GitHub profile"
          target="_blank"
          rel="noreferrer noopener"
          className=" hover:text-red-900"
        >
          <FontAwesomeIcon icon={faGithub} />
        </Link>
        <Link
          href="https://linkedin.com/in/drovani"
          title="drovani LinkedIn profile"
          target="_blank"
          rel="noreferrer noopener"
          className=" hover:text-red-900"
        >
          <FontAwesomeIcon icon={faLinkedin} />
        </Link>
        <Link
          href="https://hachyderm.io/@drovani"
          title="@drovani@hackyderm.io Mastodon profile"
          target="_blank"
          rel="noreferrer noopener"
          className=" hover:text-red-900"
        >
          <FontAwesomeIcon icon={faMastodon} />
        </Link>
        <Link
          href="https://stackoverflow.com/users/28310/drovani"
          title="drovani Stack Overlow profile"
          target="_blank"
          rel="noreferrer noopener"
          className=" hover:text-red-900"
        >
          <FontAwesomeIcon icon={faStackOverflow} />
        </Link>
        <Link
          href="https://twitter.com/davidrovani"
          title="@davidrovani Twitter profile"
          target="_blank"
          rel="noreferrer noopener"
          className=" hover:text-red-900"
        >
          <FontAwesomeIcon icon={faTwitter} />
        </Link>
        <Link
          href="https://dev.to/drovani"
          title="drovani dev.to profile"
          target="_blank"
          rel="noreferrer noopener"
          className=" hover:text-red-900"
        >
          <FontAwesomeIcon icon={faDev} />
        </Link>
        <Link
          href="/about"
          title="About David Rovani"
          className=" hover:text-red-900"
        >
          <FontAwesomeIcon icon={faUserTie} />
        </Link>
      </footer>
    </div>
  );
}
