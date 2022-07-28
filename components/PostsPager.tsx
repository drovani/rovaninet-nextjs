import Link from "next/link";

const idealLeftCount = 2;
const idealRightCount = 3;
const idealCount = idealLeftCount + idealRightCount;

const PostsPager = ({ currentPage, maxPages }) => {
  const lowend =
    currentPage >= maxPages - idealLeftCount
      ? maxPages - idealCount
      : Math.max(1, currentPage - idealLeftCount);
  const highend =
    currentPage <= idealLeftCount + 1
      ? idealCount + 1
      : Math.min(maxPages, currentPage + idealRightCount);

  return (
    <nav className="text-center">
      {currentPage >= 4 && (
        <Link href="/">
          <a aria-label="Go to first page" className="mx-1 p-1">
            «
          </a>
        </Link>
      )}
      {currentPage > 1 && (
        <Link href={currentPage - 1 <= 1 ? `/` : `/${currentPage - 1}`}>
          <a aria-label="Go to previous page" className="mx-1 p-1">
            ‹
          </a>
        </Link>
      )}
      {[...Array(currentPage - lowend)].map((_: undefined, i: number) => (
        <Link href={lowend + i <= 1 ? `/` : `/${lowend + i}`} key={i}>
          <a aria-label={`Go to page ${lowend + i}`} className="mx-1 p-1">
            {lowend + i}
          </a>
        </Link>
      ))}
      <Link href={currentPage <= 1 ? `/` : `/${currentPage}`}>
        <a
          aria-label={`Current Page. Page ${currentPage}`}
          className="text-white bg-gray-900 rounded font-semibold mx-1 p-1"
          aria-current="page"
        >
          {currentPage}
        </a>
      </Link>
      {highend > currentPage &&
        [...Array(highend - currentPage)].map((_: undefined, i: number) => (
          <Link href={`/${currentPage + 1 + i}`} key={i}>
            <a
              aria-label={`Go to page ${currentPage + 1 + i}`}
              className="mx-1 p-1"
            >
              {currentPage + 1 + i}
            </a>
          </Link>
        ))}
      {highend > currentPage && (
        <Link href={`/${currentPage + 1}`}>
          <a
            aria-label={`Go to next Page. Page ${currentPage + 1}`}
            className="mx-1 p-1"
          >
            ›
          </a>
        </Link>
      )}
      {maxPages > highend && (
        <Link href={`/${maxPages}`}>
          <a
            aria-label={`Go to last page. Page ${maxPages}`}
            className="mx-1 p-1"
          >
            »
          </a>
        </Link>
      )}
    </nav>
  );
};

export default PostsPager;
