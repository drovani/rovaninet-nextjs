import React from "react";
import PageHeader from "./PageHeader";
import PostSnippets from "./PostSnippets";
import PostsPager from "./PostsPager";
import SafeMarkdown from "./SafeMarkdown";
import { PostSummary } from "../lib/posts";

interface PostsSectionProps {
  currentPage?: number;
  maxPages?: number;
  posts: PostSummary[];
  summary?: string | null;
  header?: string;
}

const PostsSection = ({
  currentPage = 0,
  maxPages = 0,
  posts,
  summary = null,
  header,
}: PostsSectionProps) => {
  return (
    <React.Fragment>
      <div className="sm:flex sm:pr-4 mb-5 sm:mb-auto sm:items-center">
        <PageHeader className="sm:flex-1">{header}</PageHeader>
      </div>
      {summary && <SafeMarkdown content={summary} includeDirectives={true} />}
      {maxPages > 0 && (
        <PostsPager currentPage={currentPage} maxPages={maxPages} />
      )}
      <PostSnippets posts={posts} />
    </React.Fragment>
  );
};
export default PostsSection;
