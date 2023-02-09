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
import Image from "next/image";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container max-w-screen-lg mx-auto p-2 sm:p-4">
      <header className="flex flex-row flex-nowrap mb-4 justify-between">
        <section className="flex-grow-1">
          <Link href="/" className=" flex items-center">
            <Image
              src="/images/r-star.png"
              alt="Rovani's Sandbox"
              width="64"
              height="64"
              className="h-16 w-16"
            />
            <h1 className="text-2xl sm:text-4xl font-semibold text-raisinblack first-letter:text-transparent first-letter:-mr-4 sm:first-letter:-mr-6">
              Rovani's Sandbox
            </h1>
          </Link>
        </section>
        <Link
          href="/about/"
          className="flex-initial justify-self-end rounded border p-1 border-chicagoblue"
        >
          <FontAwesomeIcon
            icon={faUserTie}
            className="text-4xl mx-auto block"
          />
          <div className="text-xs">About Me</div>
        </Link>
      </header>
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
