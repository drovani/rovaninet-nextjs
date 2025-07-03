# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production 
- `npm run postbuild` - Generate sitemap (runs automatically after build)
- `npm run lint` - Run ESLint
- `npm run tsc` - TypeScript type checking

## Architecture Overview

This is a Next.js 15 blog/website with markdown-based content management. The site uses Static Site Generation (SSG) for all pages and employs a file-based routing system.

### Content Management System
- **Content Source**: Blog posts managed as git submodule from [rovaninet-posts](https://github.com/drovani/rovaninet-posts)
- **Storage Structure**: Posts stored in `/rovaninet-posts/{year}/{YYYY-MM-DD-slug}.md`
- **Portability**: Content decoupled from implementation, enabling reuse across multiple website frameworks
- **Frontmatter Schema**: `title`, `category`, `series`, `tags`, `excerpt`, `date`, `step`
- **Processing Pipeline**: Advanced markdown processing via unified/remark/rehype with comprehensive feature support

### Key Architectural Patterns
- **Dynamic routing**: `/posts/[year]/[slug]`, `/category/[categorySlug]`, `/tag/[tagSlug]`, `/series/[seriesSlug]`
- **Content aggregation**: Posts grouped by category, tag, and series with pagination
- **Markdown transformation**: Custom remark/rehype plugins for content processing
- **Static generation**: All content pre-built at build time for performance

### Core Dependencies
- **Next.js 15** with React 18 and TypeScript
- **TailwindCSS v4** with typography plugin for styling (uses CSS-first configuration)
- **Turbopack** enabled for development builds (faster compilation and hot reload)
- **Unified ecosystem** (remark/rehype) for markdown processing with advanced features
- **Prism.js** for syntax highlighting (20+ languages supported)
- **KaTeX** for mathematical expressions and LaTeX rendering
- **Mermaid** for interactive diagrams and flowcharts
- **FontAwesome** for icons
- **next-sitemap** for SEO

### Directory Structure
- `/components` - Reusable React components
  - `SafeMarkdown.tsx` - Primary markdown renderer with all advanced features
  - `CodeBlock.tsx` - Prism.js syntax highlighting component
  - `MathBlock.tsx` - KaTeX mathematical expression renderer
  - `MermaidDiagram.tsx` - Interactive diagram component
  - `DynamicMarkdown.tsx` - Performance-optimized wrapper with code splitting
- `/lib` - Core utilities and content processing logic
  - `posts.ts` - Markdown processing pipeline with remark/rehype plugins
- `/pages` - Next.js pages with file-based routing
- `/rovaninet-posts` - **Git submodule** containing markdown blog posts organized by year
- `/public` - Static assets

### Git Submodule Workflow

The content is managed separately to enable framework-agnostic reuse:

#### **Content Repository**: [rovaninet-posts](https://github.com/drovani/rovaninet-posts)
- Contains all blog post markdown files
- Maintains consistent frontmatter schema across implementations  
- Enables content updates independent of website framework changes
- Supports multiple concurrent website implementations using the same content

#### **Submodule Management**:
- **Initialize**: `git submodule update --init --recursive`
- **Update content**: `cd rovaninet-posts && git pull origin main`
- **Commit content updates**: `git add rovaninet-posts && git commit -m "Update content"`

#### **Development Workflow**:
1. Content changes made in the rovaninet-posts repository
2. Submodule updated in this repository to reference new content
3. Website rebuilds automatically pick up new/modified posts
4. Same content can be used by Jekyll, Hugo, Next.js, or other implementations

This architecture enables rapid framework experimentation while maintaining content consistency and simplifying migrations between different website generators.

### Content Processing Flow
1. Markdown files read from filesystem
2. Frontmatter parsed and validated
3. Content transformed through advanced remark/rehype pipeline:
   - GitHub Flavored Markdown (tables, task lists, strikethrough)
   - Mathematical expressions (inline and block)
   - Emoji shortcodes (`:smile:` → 😄)
   - Custom directives support
4. Advanced rendering features applied:
   - Syntax highlighting via Prism.js (20+ languages)
   - Mermaid diagram generation
   - Enhanced typography and styling
5. Static pages generated with optimized React components
6. Performance optimization via code splitting and lazy loading
7. Sitemap generated post-build

### Advanced Markdown Features

When working with content or enhancing markdown processing, be aware of these supported features:

#### Syntax Highlighting
- **Languages**: TypeScript, JavaScript, JSX, TSX, Python, Bash, SQL, YAML, JSON, CSS, SCSS, PHP, Java, C#, Go, Rust, Ruby, Markdown
- **Features**: Line numbers, copy button, responsive design, custom themes
- **Usage**: Standard fenced code blocks with language specification

#### Mathematical Expressions
- **Inline math**: `$E = mc^2$` renders as mathematical notation
- **Block math**: `$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$`
- **Engine**: KaTeX with LaTeX syntax support
- **Error handling**: Graceful fallbacks for invalid expressions

#### Interactive Diagrams
- **Engine**: Mermaid with custom theme integration
- **Types**: Flowcharts, sequence diagrams, state diagrams, pie charts, etc.
- **Usage**: Fenced code blocks with `mermaid` language
- **Responsive**: Automatically scales on mobile devices

#### Enhanced Content
- **Task lists**: `- [x] Completed` / `- [ ] Pending` with interactive checkboxes
- **Emoji shortcodes**: `:rocket:` `:smile:` `:heart:` etc.
- **Tables**: Enhanced styling with borders, hover effects, responsive design
- **Blockquotes**: Improved visual design with gradient backgrounds
- **Images**: Automatic figure captions, lazy loading, responsive sizing

#### Performance Considerations
- **Code splitting**: Heavy components (Prism, KaTeX, Mermaid) loaded dynamically
- **Lazy loading**: Math and diagram rendering triggered on demand
- **Caching**: Processed content cached for faster subsequent builds
- **Bundle optimization**: Strategic imports minimize initial page load

### Deployment
- Configured for Netlify with comprehensive redirect rules
- 164+ redirects handle legacy URL patterns and slug normalization

## GitHub Integration

When creating GitHub issues or pull requests, ALWAYS provide the URL in the response so the user can easily navigate to it.