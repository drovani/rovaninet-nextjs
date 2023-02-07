import {
  faDev,
  faGithub,
  faLinkedin,
  faMastodon,
  faStackOverflow,
  faStrava,
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
            <Link href="/">Rovani&apos;s Sandbox</Link>
          </span>
        </div>
        <div className="w-full block flex-grow sm:flex sm:items-center sm:w-auto border border-grey-600 p-2 mt-2 rounded sm:border-t-0 sm:border-l-0 sm:rounded-t-none sm:rounded-l-none">
          <div className="text-sm sm:flex-grow">
            <Link
              href="/about/"
              className="block mt-0 sm:inline-block text-black mr-4"
            >
              About Me
            </Link>
            <a
              href="https://hsmercs.rovani.net/"
              className="block mt-4 sm:inline-block sm:mt-0 text-black mr-4"
            >
              HS Mercs
            </a>
          </div>
        </div>
      </nav>
      <main className="font-sans antialiased">{children}</main>
      <footer className="mt-4 pt-2 text-4xl space-x-1 text-center sm:space-x-2 md:space-x-4 border-t rounded-t">
        <Link href="/" title="Rovani's Sandbox">
          <FontAwesomeIcon icon={faHome} />
        </Link>
        <Link
          href="https://github.com/drovani"
          title="drovani GitHub profile"
          target="_blank"
          rel="noreferrer noopener me"
          className="text-[#25292f]"
        >
          <FontAwesomeIcon icon={faGithub} />
        </Link>
        <Link
          href="https://linkedin.com/in/drovani"
          title="drovani LinkedIn profile"
          target="_blank"
          rel="noreferrer noopener me"
          className="text-[#0c66c0]"
        >
          <FontAwesomeIcon icon={faLinkedin} />
        </Link>
        <Link
          href="https://www.strava.com/athletes/22474662"
          title="David Rovani Strava profile"
          target="_blank"
          rel="noreferrer noopener me"
          className="text-[#f25a1d]"
        >
          <FontAwesomeIcon icon={faStrava} />
        </Link>
        <Link
          href="https://hachyderm.io/@drovani"
          title="@drovani@hackyderm.io Mastodon profile"
          target="_blank"
          rel="noreferrer noopener me"
          className="text-[#4444b0]"
        >
          <FontAwesomeIcon icon={faMastodon} />
        </Link>
        <Link
          href="https://stackoverflow.com/users/28310/drovani"
          title="drovani Stack Overlow profile"
          target="_blank"
          rel="noreferrer noopener me"
          className="text-[#eb9048]"
        >
          <FontAwesomeIcon icon={faStackOverflow} />
        </Link>
        <Link
          href="https://twitter.com/davidrovani"
          title="@davidrovani Twitter profile"
          target="_blank"
          rel="noreferrer noopener me"
          className="text-[#4499ee]"
        >
          <FontAwesomeIcon icon={faTwitter} />
        </Link>
        <Link
          href="https://dev.to/drovani"
          title="drovani dev.to profile"
          target="_blank"
          rel="noreferrer noopener me"
        >
          <FontAwesomeIcon icon={faDev} />
        </Link>
        <Link href="/about" title="About David Rovani">
          <FontAwesomeIcon icon={faUserTie} />
        </Link>
      </footer>
    </div>
  );
}
