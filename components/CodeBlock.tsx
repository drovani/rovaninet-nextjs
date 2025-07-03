import Prism from 'prismjs';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/themes/prism-tomorrow.css';
import React from 'react';
import log from 'loglevel';

// Import common languages
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-yaml';

interface CodeBlockProps {
  code: string;
  language: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language,
  showLineNumbers = true,
  highlightLines = []
}) => {
  const [highlightedCode, setHighlightedCode] = React.useState<string>('');
  const codeRef = React.useRef<HTMLPreElement>(null);

  React.useEffect(() => {
    const highlightCode = () => {
      try {
        const normalizedLang = language.toLowerCase();
        const supportedLanguage = Prism.languages[normalizedLang] ? normalizedLang : 'text';

        const highlighted = Prism.highlight(
          code,
          Prism.languages[supportedLanguage] || Prism.languages.text,
          supportedLanguage
        );

        setHighlightedCode(highlighted);
      } catch (error) {
        log.error('Error highlighting code:', error);
        setHighlightedCode(code);
      }
    };

    highlightCode();
  }, [code, language]);

  React.useEffect(() => {
    if (showLineNumbers && codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [highlightedCode, showLineNumbers]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (error) {
      log.error('Failed to copy code:', error);
    }
  };

  return (
    <div className="relative group">
      <pre
        ref={codeRef}
        className={`
          language-${language.toLowerCase()}
          ${showLineNumbers ? 'line-numbers' : ''}
          ${highlightLines.length > 0 ? 'highlight-lines' : ''}
          overflow-x-auto rounded-lg
        `}
        data-line={highlightLines.join(',')}
      >
        <code
          className={`language-${language.toLowerCase()}`}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </pre>
      <button
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white px-2 py-1 rounded text-sm hover:bg-gray-700"
        onClick={handleCopy}
        title="Copy code"
      >
        Copy
      </button>
    </div>
  );
};

export default CodeBlock;