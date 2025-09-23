import { useEffect, useRef } from "react";
import Reveal from "reveal.js";
import "reveal.js/dist/reveal.css";
import "reveal.js/dist/theme/white.css";
import Highlight from "reveal.js/plugin/highlight/highlight.esm.js";
import "reveal.js/plugin/highlight/monokai.css";
import Markdown from "reveal.js/plugin/markdown/markdown.esm.js";

interface PresentationProps {
    markdownContent: string;
}

function Presentation({ markdownContent }: PresentationProps) {
    const deckDivRef = useRef<HTMLDivElement>(null);
    const deckRef = useRef<Reveal.Api | null>(null);

    useEffect(() => {
        if (deckRef.current) return;

        deckRef.current = new Reveal(deckDivRef.current!, {
            hash: true,
            transition: "slide",
            plugins: [Markdown, Highlight],
            markdown: {
                smartypants: true,
            },
            controls: true,
            progress: true,
            center: true,
            slideNumber: true,
        });

        deckRef.current.initialize().then(() => {
            console.log("Reveal.js initialized successfully!");
        });

        return () => {
            try {
                if (deckRef.current) {
                    deckRef.current.destroy();
                    deckRef.current = null;
                }
            } catch (e) {
                console.warn("Reveal.js destroy call failed.");
            }
        };
    }, [markdownContent]);

    return (
        <div className="reveal" ref={deckDivRef}>
            <div className="slides">
                <section
                    data-markdown=""
                    data-separator="^\n---\n"
                    data-separator-vertical="^\n--\n"
                    data-separator-notes="^Note:"
                >
                    <textarea data-template>
                        {markdownContent}
                    </textarea>
                </section>
            </div>
        </div>
    );
}

export default Presentation;