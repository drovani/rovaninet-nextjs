import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import Image from "next/image";
import { useMemo, useState } from "react";
import type { MediaItem, MediaStatus, MediaType } from "../lib/media";

type SortField = "title" | "rating" | "status";
type SortDirection = "asc" | "desc";

const STATUS_LABELS: Record<MediaStatus, string> = {
  watching: "Watching",
  waiting: "Waiting",
  watched: "Watched",
  "want-to-watch": "Want to Watch",
};

const STATUS_ORDER: Record<MediaStatus, number> = {
  watching: 0,
  waiting: 1,
  "want-to-watch": 2,
  watched: 3,
};

const TYPE_LABELS: Record<MediaType, string> = {
  tv: "TV Show",
  movie: "Movie",
  miniseries: "Miniseries",
};

function HalfStar() {
  return (
    <span className="relative inline-block">
      <span className="text-gray-400">★</span>
      <span className="absolute inset-0 overflow-hidden w-1/2">
        <span className="text-amber-500">★</span>
      </span>
    </span>
  );
}

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return <span className="text-gray-400 text-sm">--</span>;
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
  return (
    <span className="whitespace-nowrap text-lg leading-none" title={`${rating} out of 5`}>
      <span className="text-amber-500">{"★".repeat(fullStars)}</span>
      {hasHalf && <HalfStar />}
      <span className="text-gray-400">{"★".repeat(emptyStars)}</span>
    </span>
  );
}

function StatusBadge({ status }: { status: MediaStatus }) {
  const colors: Record<MediaStatus, string> = {
    watching: "bg-blue-100 text-blue-800 border-blue-200",
    waiting: "bg-violet-100 text-violet-800 border-violet-200",
    watched: "bg-green-100 text-green-800 border-green-200",
    "want-to-watch": "bg-amber-100 text-amber-800 border-amber-200",
  };
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full border ${colors[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

const SERVICE_SLUGS: Record<string, string> = {
  "Hulu": "hulu",
  "Paramount+": "paramount-plus",
  "Peacock": "peacock",
  "Disney+": "disney-plus",
  "Netflix": "netflix",
  "Prime": "prime",
  "Amazon Prime": "prime",
  "Apple TV+": "apple-tv-plus",
  "HBO": "hbo",
  "ABC": "abc",
  "Bravo": "bravo",
};

function ServiceLogo({ service, onClick }: { service: string | null; onClick?: () => void }) {
  if (!service) return null;
  const slug = SERVICE_SLUGS[service];
  if (!slug) return <span className="text-xs text-gray-400" title={service}>{service}</span>;
  return (
    <button type="button" onClick={onClick} className="cursor-pointer" title={`Filter by ${service}`}>
      <Image
        src={`/images/services/${slug}.svg`}
        alt={service}
        width={24}
        height={24}
        className="rounded"
      />
    </button>
  );
}

const TYPE_ICONS: Record<MediaType, string> = {
  tv: "📺",
  movie: "🎬",
  miniseries: "📖",
};

function TypeIcon({ type, onClick }: { type: MediaType; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="cursor-pointer text-base" title={`Filter by ${TYPE_LABELS[type]}`}>
      {TYPE_ICONS[type]}
    </button>
  );
}

export default function MediaTracker({ media }: { media: MediaItem[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<MediaStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<MediaType | "all">("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [watchingWithFilter, setWatchingWithFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("status");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const uniqueServices = useMemo(
    () => Array.from(new Set(media.map((m) => m.service).filter(Boolean))).sort() as string[],
    [media]
  );

  const uniqueWatchingWith = useMemo(
    () => Array.from(new Set(media.map((m) => m.watchingWith).filter(Boolean))).sort() as string[],
    [media]
  );

  const filtered = useMemo(() => {
    let items = [...media];

    if (search) {
      const terms = search.toLowerCase().split(" ").filter(Boolean);
      items = items.filter((item) => {
        const title = item.title.toLowerCase();
        return terms.every((term) => title.includes(term));
      });
    }
    if (statusFilter !== "all") {
      items = items.filter((item) => item.status === statusFilter);
    }
    if (typeFilter !== "all") {
      items = items.filter((item) => item.type === typeFilter);
    }
    if (serviceFilter !== "all") {
      items = items.filter((item) => item.service === serviceFilter);
    }
    if (watchingWithFilter !== "all") {
      items = items.filter((item) => item.watchingWith === watchingWithFilter);
    }

    items.sort((a, b) => {
      let cmp = 0;
      if (sortField === "title") {
        cmp = a.title.localeCompare(b.title);
      } else if (sortField === "rating") {
        cmp = (a.rating || 0) - (b.rating || 0);
      } else if (sortField === "status") {
        cmp = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
      }
      return sortDirection === "asc" ? cmp : -cmp;
    });

    return items;
  }, [media, search, statusFilter, typeFilter, serviceFilter, watchingWithFilter, sortField, sortDirection]);

  const counts = useMemo(() => {
    const status: Record<string, number> = { all: media.length };
    const type: Record<string, number> = {};
    const service: Record<string, number> = {};
    for (const item of media) {
      status[item.status] = (status[item.status] || 0) + 1;
      type[item.type] = (type[item.type] || 0) + 1;
      if (item.service) {
        service[item.service] = (service[item.service] || 0) + 1;
      }
    }
    return { status, type, service };
  }, [media]);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }

  function SortIndicator({ field }: { field: SortField }) {
    if (sortField !== field) return <span className="text-gray-300 ml-1">↕</span>;
    return <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>;
  }

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search titles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-chicagoblue focus:border-transparent"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as MediaStatus | "all")}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-chicagoblue"
        >
          <option value="all">All Statuses ({counts.status.all})</option>
          {(Object.keys(STATUS_LABELS) as MediaStatus[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]} ({counts.status[s] || 0})
            </option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as MediaType | "all")}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-chicagoblue"
        >
          <option value="all">All Types ({media.length})</option>
          {(Object.keys(TYPE_LABELS) as MediaType[]).map((t) => (
            <option key={t} value={t}>
              {TYPE_ICONS[t]} {TYPE_LABELS[t]} ({counts.type[t] || 0})
            </option>
          ))}
        </select>
        {uniqueServices.length > 0 && (
          <Listbox value={serviceFilter} onChange={setServiceFilter}>
            <div className="relative">
              <ListboxButton className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-chicagoblue w-full sm:w-auto">
                {serviceFilter !== "all" && SERVICE_SLUGS[serviceFilter] && (
                  <Image
                    src={`/images/services/${SERVICE_SLUGS[serviceFilter]}.svg`}
                    alt=""
                    width={16}
                    height={16}
                    className="rounded"
                  />
                )}
                <span>{serviceFilter === "all" ? `All Services (${media.length})` : `${serviceFilter} (${counts.service[serviceFilter] || 0})`}</span>
                <span className="ml-auto text-gray-400">▾</span>
              </ListboxButton>
              <ListboxOptions className="absolute z-10 mt-1 w-full min-w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 focus:outline-none">
                <ListboxOption
                  value="all"
                  className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer data-focus:bg-gray-100 data-selected:font-semibold"
                >
                  All Services ({media.length})
                </ListboxOption>
                {uniqueServices.map((s) => {
                  const slug = SERVICE_SLUGS[s];
                  return (
                    <ListboxOption
                      key={s}
                      value={s}
                      className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer data-focus:bg-gray-100 data-selected:font-semibold"
                    >
                      {slug && (
                        <Image
                          src={`/images/services/${slug}.svg`}
                          alt=""
                          width={20}
                          height={20}
                          className="rounded"
                        />
                      )}
                      {s} ({counts.service[s] || 0})
                    </ListboxOption>
                  );
                })}
              </ListboxOptions>
            </div>
          </Listbox>
        )}
        {uniqueWatchingWith.length > 0 && (
          <select
            value={watchingWithFilter}
            onChange={(e) => setWatchingWithFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-chicagoblue"
          >
            <option value="all">Watching With...</option>
            {uniqueWatchingWith.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
        <span>Showing {filtered.length} of {media.length} items</span>
        {(search || statusFilter !== "all" || typeFilter !== "all" || serviceFilter !== "all" || watchingWithFilter !== "all") && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
              setTypeFilter("all");
              setServiceFilter("all");
              setWatchingWithFilter("all");
            }}
            className="text-blue-700 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="w-10 px-2 py-3"></th>
              <th className="w-8 px-1 py-3"></th>
              <th
                className="px-4 py-3 text-sm font-semibold text-gray-700 cursor-pointer select-none hover:bg-gray-100"
                onClick={() => handleSort("title")}
              >
                Title <SortIndicator field="title" />
              </th>
              <th
                className="px-4 py-3 text-sm font-semibold text-gray-700 cursor-pointer select-none hover:bg-gray-100"
                onClick={() => handleSort("status")}
              >
                Status <SortIndicator field="status" />
              </th>
              <th
                className="px-4 py-3 text-sm font-semibold text-gray-700 cursor-pointer select-none hover:bg-gray-100"
                onClick={() => handleSort("rating")}
              >
                Rating <SortIndicator field="rating" />
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                With
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">Season</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No items match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="w-10 px-2 py-3 text-center">
                    <ServiceLogo service={item.service} onClick={() => item.service && setServiceFilter(item.service)} />
                  </td>
                  <td className="w-8 px-1 py-3 text-center">
                    <TypeIcon type={item.type} onClick={() => setTypeFilter(item.type)} />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{item.title}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-4 py-3">
                    <StarRating rating={item.rating} />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {item.watchingWith || "--"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {item.season || "--"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {item.notes || "--"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
