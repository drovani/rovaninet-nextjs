import { useState, useMemo } from "react";
import type { MediaItem, MediaStatus, MediaType } from "../lib/media";

type SortField = "title" | "rating" | "status";
type SortDirection = "asc" | "desc";

const STATUS_LABELS: Record<MediaStatus, string> = {
  watching: "Watching",
  watched: "Watched",
  "want-to-watch": "Want to Watch",
};

const STATUS_ORDER: Record<MediaStatus, number> = {
  watching: 0,
  "want-to-watch": 1,
  watched: 2,
};

const TYPE_LABELS: Record<MediaType, string> = {
  tv: "TV Show",
  movie: "Movie",
};

function StarRating({ rating }: { rating?: number }) {
  if (!rating) return <span className="text-gray-400 text-sm">No rating</span>;
  return (
    <span className="text-yellow-500" title={`${rating} out of 5`}>
      {"★".repeat(rating)}
      {"☆".repeat(5 - rating)}
    </span>
  );
}

function StatusBadge({ status }: { status: MediaStatus }) {
  const colors: Record<MediaStatus, string> = {
    watching: "bg-blue-100 text-blue-800 border-blue-200",
    watched: "bg-green-100 text-green-800 border-green-200",
    "want-to-watch": "bg-amber-100 text-amber-800 border-amber-200",
  };
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full border ${colors[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

function TypeBadge({ type }: { type: MediaType }) {
  const colors: Record<MediaType, string> = {
    tv: "bg-purple-100 text-purple-800 border-purple-200",
    movie: "bg-pink-100 text-pink-800 border-pink-200",
  };
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full border ${colors[type]}`}>
      {TYPE_LABELS[type]}
    </span>
  );
}

export default function MediaTracker({ media }: { media: MediaItem[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<MediaStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<MediaType | "all">("all");
  const [sortField, setSortField] = useState<SortField>("status");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const filtered = useMemo(() => {
    let items = [...media];

    if (search) {
      const q = search.toLowerCase();
      items = items.filter((item) => item.title.toLowerCase().includes(q));
    }
    if (statusFilter !== "all") {
      items = items.filter((item) => item.status === statusFilter);
    }
    if (typeFilter !== "all") {
      items = items.filter((item) => item.type === typeFilter);
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
  }, [media, search, statusFilter, typeFilter, sortField, sortDirection]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: media.length };
    for (const item of media) {
      c[item.status] = (c[item.status] || 0) + 1;
    }
    return c;
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
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search titles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-chicagoblue focus:border-transparent"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as MediaStatus | "all")}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-chicagoblue"
        >
          <option value="all">All Statuses ({counts.all})</option>
          {(Object.keys(STATUS_LABELS) as MediaStatus[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]} ({counts[s] || 0})
            </option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as MediaType | "all")}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-chicagoblue"
        >
          <option value="all">All Types</option>
          {(Object.keys(TYPE_LABELS) as MediaType[]).map((t) => (
            <option key={t} value={t}>
              {TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-3">
        Showing {filtered.length} of {media.length} items
      </p>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                className="px-4 py-3 text-sm font-semibold text-gray-700 cursor-pointer select-none hover:bg-gray-100"
                onClick={() => handleSort("title")}
              >
                Title <SortIndicator field="title" />
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">Type</th>
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
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  No items match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{item.title}</td>
                  <td className="px-4 py-3">
                    <TypeBadge type={item.type} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-4 py-3">
                    <StarRating rating={item.rating} />
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
