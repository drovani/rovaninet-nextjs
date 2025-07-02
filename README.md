# Rovani.net - Next.js Implementation

## Overview

This repository represents my experimental approach to learning modern web technologies through practical application. Rather than building toy projects, I periodically rewrite my personal blog/website using different frameworks to gain hands-on experience with emerging technologies and architectural patterns.

## Why This Codebase Exists

**Learning Through Production**: This codebase serves as my laboratory for exploring Next.js 15, React 18, and modern web development practices. By rebuilding a real website with actual content and traffic, I encounter and solve authentic problems that don't arise in tutorial projects.

**Framework Exploration History**: This is one iteration in a series of rewrites across different technologies (previous versions used Jekyll, Hugo, custom PHP, and other frameworks). Each rewrite teaches me the strengths, limitations, and architectural decisions inherent to different approaches.

**Experimental Features**: You'll find evidence of experimentation throughout - from advanced markdown processing pipelines to custom routing patterns to performance optimization techniques. This reflects my process of testing ideas and learning what works in practice.

## Technical Implementation Highlights

### Architecture Decisions Worth Noting

- **File-based Content Management**: Chose markdown over a headless CMS to experiment with static generation at scale (500+ posts)
- **Advanced Markdown Processing**: Built a sophisticated content pipeline using the unified/remark/rehype ecosystem to handle complex content transformations
- **Performance-First Approach**: Implemented comprehensive static generation with strategic dynamic routing for optimal Core Web Vitals
- **SEO-Focused Design**: Custom sitemap generation and URL structure designed for search engine optimization

### Modern Tooling Integration

- **Next.js 15 with Turbopack**: Early adoption of cutting-edge build tools
- **TypeScript Configuration**: Pragmatic setup balancing type safety with development velocity
- **TailwindCSS Implementation**: Utility-first CSS with custom design system
- **Deployment Automation**: Netlify integration with sophisticated redirect management

## Code Quality & Patterns

This codebase demonstrates practical software engineering skills:

- **Clean Architecture**: Separation of concerns between content processing, UI components, and routing logic
- **Type Safety**: Strategic TypeScript usage for critical data structures
- **Performance Optimization**: Image optimization, static generation, and build-time optimizations
- **Maintainable Code**: Consistent patterns and conventions throughout the codebase

## Learning Outcomes

Through this project, I've gained practical experience with:
- Server-side rendering and static site generation trade-offs
- Content management system design decisions
- Modern React patterns and Next.js best practices
- Performance optimization in production environments
- SEO implementation in modern web applications

## Future Employers: What This Shows

This repository demonstrates my approach to continuous learning and practical skill development. Rather than just following tutorials, I apply new technologies to real-world problems, learning through experimentation and iteration. The experimental nature reflects my commitment to staying current with evolving web technologies and my ability to rapidly adapt and learn new frameworks.
