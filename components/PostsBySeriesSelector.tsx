import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import { Fragment } from "react";

const PostsBySeriesSelector = ({ seriesCollection }) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex justify-center items-center rounded border border-chicagoblue px-4 py-2 shadow-sm hover:bg-gray-50">
        Posts By Series
        <FontAwesomeIcon icon={faChevronDown} className="ml-4" />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-85"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-85"
      >
        <Menu.Items className="absolute left-0 sm:left-auto sm:right-0 z-10 mt-2 w-56 origin-top-left sm:origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {seriesCollection.map((s) => (
              <Menu.Item key={s.seriesSlug}>
                <Link
                  href={`/series/${s.seriesSlug}`}
                  className="block px-4 py-2 text-sm"
                >
                  {s.series}
                </Link>
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default PostsBySeriesSelector
