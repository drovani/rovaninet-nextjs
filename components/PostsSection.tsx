import React from "react";
import PageHeader from "./PageHeader";
import PostsBySeriesSelector from "./PostsBySeriesSelector";
import PostSnippets from "./PostSnippets";
import PostsPager from "./PostsPager";

const PostsSection = ({
  currentPage = 0,
  seriesCollection,
  maxPages = 0,
  posts,
  summary = null,
  header,
}) => {
  return (
    <React.Fragment>
      <div className="sm:flex sm:pr-4 mb-5 sm:mb-auto sm:items-center">
        <PageHeader className="sm:flex-1">{header}</PageHeader>
        <PostsBySeriesSelector seriesCollection={seriesCollection} />
      </div>
      {summary && <div dangerouslySetInnerHTML={{ __html: summary }}></div>}
      {maxPages > 0 && (
        <PostsPager currentPage={currentPage} maxPages={maxPages} />
      )}
      <PostSnippets posts={posts} />
    </React.Fragment>
  );
};
export default PostsSection;
