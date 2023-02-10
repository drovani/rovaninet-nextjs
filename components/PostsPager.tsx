import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const PostsPager = ({
  currentPage,
  maxPages,
  idealLeftCount = 2,
  idealRightCount = 3,
}) => {
  const idealCount = idealLeftCount + idealRightCount;

  const lowend =
    currentPage >= maxPages - idealLeftCount
      ? maxPages - idealCount
      : Math.max(1, currentPage - idealLeftCount);
  const highend =
    currentPage <= idealLeftCount + 1
      ? idealCount + 1
      : Math.min(maxPages, currentPage + idealRightCount);

  return (
    <nav className="text-center text-xl flex flex-row items-center justify-center gap-x-3">
      {currentPage > idealLeftCount + 1 && (
        <Link href="/" aria-label="Go to first page" className="px-1 block">
          <FontAwesomeIcon icon={faAnglesLeft} />
        </Link>
      )}
      {currentPage > 1 && (
        <Link
          href={`/${currentPage - 1}`}
          aria-label="Go to previous page"
          className="px-1 block"
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </Link>
      )}
      {[...Array(currentPage - lowend)].map((_: undefined, i: number) => (
        <Link
          href={`/${lowend + i}`}
          key={i}
          aria-label={`Go to page ${lowend + i}`}
          className="px-1 block"
        >
          {lowend + i}
        </Link>
      ))}
      <Link
        href={`/${currentPage}`}
        aria-label={`Current Page. Page ${currentPage}`}
        className="text-white bg-gray-900 rounded font-semibold px-1 block"
        aria-current="page"
      >
        {currentPage}
      </Link>
      {highend > currentPage &&
        [...Array(highend - currentPage)].map((_: undefined, i: number) => (
          <Link
            href={`/${currentPage + 1 + i}`}
            key={i}
            aria-label={`Go to page ${currentPage + 1 + i}`}
            className="px-1 block"
          >
            {currentPage + 1 + i}
          </Link>
        ))}
      {highend > currentPage && (
        <Link
          href={`/${currentPage + 1}`}
          aria-label={`Go to next Page. Page ${currentPage + 1}`}
          className="px-1 block"
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </Link>
      )}
      {maxPages > highend && (
        <Link
          href={`/${maxPages}`}
          aria-label={`Go to last page. Page ${maxPages}`}
          className="px-1 block"
        >
          <FontAwesomeIcon icon={faAnglesRight} />
        </Link>
      )}
    </nav>
  );
};

export default PostsPager;
