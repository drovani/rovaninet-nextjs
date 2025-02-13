import {
  faDev,
  faGithub,
  faLinkedin,
  faMastodon,
  faStackOverflow,
  faStrava,
} from "@fortawesome/free-brands-svg-icons";
import {
  faChartGantt,
  faHome,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container max-w-screen-lg mx-auto p-1 sm:p-4 lg:p-8">
      <header className="flex flex-nowrap text-center gap-x-1 sm:gap-x-2 mb-4">
        <section className="flex-1 text-left">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/r-star.png"
              alt="Rovani's Sandbox"
              width="64"
              height="64"
              className="h-16 w-16 select-none"
            />
            <h1 className="leading-none text-2xl sm:text-4xl font-semibold text-raisinblack first-letter:text-transparent first-letter:-mr-4 sm:first-letter:-mr-6">
              Rovani&apos;s Sandbox
            </h1>
          </Link>
        </section>
        <Link
          href="/about/"
          className="w-16 rounded border p-1 border-chicagoblue  hover:bg-gray-50 shadow-md whitespace-nowrap"
        >
          <FontAwesomeIcon
            icon={faUserTie}
            className="text-4xl mx-auto block"
          />
          <div className="text-xs">About Me</div>
        </Link>
        <Link
          href="/side-projects/"
          className="w-16 rounded border p-1 border-chicagoblue hover:bg-gray-50 shadow-md whitespace-nowrap"
        >
          <FontAwesomeIcon
            icon={faChartGantt}
            className="text-4xl mx-auto block"
          />
          <div className="text-xs">Projects</div>
        </Link>
      </header>
      <main className="font-sans antialiased">
        {" "}
        <div className="rounded border p-2 bg-yellow-100">
          If you like what you see (view the <a href="/about" className="underline decoration-from-font">About Me page</a> for more) and you're interested in
          exploring opportunities for us to partner up, please reach out to me
          at <a href="mailto:david@rovani.net" className="decoration-dashed decoration-from-font underline">david@rovani.net</a> or message me on{" "}
          <a href="https://linkedin.com/in/drovani" className="underline decoration-from-font decoration-dashed">LinkedIn</a> #OpenToWork
        </div>
        {children}
      </main>
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
