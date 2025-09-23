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

            // Add image captions from alt text
            const addImageCaptions = () => {
                const slides = document.querySelectorAll('.reveal .slides section');

                slides.forEach((slide: Element) => {
                    const images = slide.querySelectorAll('img');

                    images.forEach((img: Element) => {
                        const imgElement = img as HTMLImageElement;
                        const altText = imgElement.alt;

                        // Only add caption if alt text exists and no caption already exists
                        if (altText && altText.trim() !== '' && !imgElement.nextElementSibling?.classList.contains('image-caption')) {
                            const caption = document.createElement('div');
                            caption.className = 'image-caption';
                            caption.textContent = altText;

                            // Insert caption after the image
                            imgElement.parentNode?.insertBefore(caption, imgElement.nextSibling);
                        }
                    });
                });
            };

            // Enhanced content analysis and font scaling
            const analyzeAndAdjustSlides = () => {
                const slides = document.querySelectorAll('.reveal .slides section');

                slides.forEach((slide: Element, index: number) => {
                    const slideElement = slide as HTMLElement;

                    // Reset any previous adjustments
                    slideElement.classList.remove('dense-content', 'very-dense-content');
                    slideElement.style.fontSize = '';

                    // Force a layout recalculation
                    slideElement.offsetHeight;

                    // Analyze content density
                    const textContent = slideElement.textContent || '';
                    const listItems = slideElement.querySelectorAll('li').length;
                    const paragraphs = slideElement.querySelectorAll('p').length;
                    const headings = slideElement.querySelectorAll('h1, h2, h3, h4, h5, h6').length;

                    // Content density scoring
                    let densityScore = 0;
                    densityScore += Math.min(textContent.length / 100, 10); // Text length factor
                    densityScore += listItems * 0.5; // List items add to density
                    densityScore += paragraphs * 0.3; // Paragraphs factor
                    densityScore += headings * 0.2; // Headings factor

                    // Apply density classes
                    if (densityScore > 15) {
                        slideElement.classList.add('very-dense-content');
                    } else if (densityScore > 8) {
                        slideElement.classList.add('dense-content');
                    }

                    // Wait for CSS to apply, then check for overflow
                    setTimeout(() => {
                        checkAndAdjustOverflow(slideElement, index);
                    }, 50);
                });
            };

            const checkAndAdjustOverflow = (slideElement: HTMLElement, slideIndex: number) => {
                let fontSize = 100;
                let attempts = 0;
                const maxAttempts = 20; // Prevent infinite loops
                const minFontSize = 55; // Don't go below 55%

                // Function to check if content overflows
                const hasOverflow = () => {
                    const scrollHeight = slideElement.scrollHeight;
                    const clientHeight = slideElement.clientHeight;
                    const scrollWidth = slideElement.scrollWidth;
                    const clientWidth = slideElement.clientWidth;

                    // Add some buffer (10px) to account for minor rendering differences
                    return (scrollHeight > clientHeight + 10) || (scrollWidth > clientWidth + 10);
                };

                // Progressive font size reduction
                while (hasOverflow() && fontSize > minFontSize && attempts < maxAttempts) {
                    fontSize -= 2; // More granular adjustment (2% instead of 5%)
                    slideElement.style.fontSize = `${fontSize}%`;

                    // Force layout recalculation
                    slideElement.offsetHeight;
                    attempts++;

                    // Add delay for complex slides
                    if (attempts > 10) {
                        fontSize -= 3; // Faster reduction for very dense content
                    }
                }

                // Log adjustment for debugging
                if (fontSize < 100) {
                    console.log(`Slide ${slideIndex + 1}: Adjusted font size to ${fontSize}%`);
                }

                // If still overflowing at minimum size, ensure scroll is available
                if (hasOverflow() && fontSize <= minFontSize) {
                    slideElement.style.overflowY = 'auto';
                    console.log(`Slide ${slideIndex + 1}: Content requires scrolling at minimum font size`);
                }
            };

            // Initial analysis with proper timing
            setTimeout(() => {
                addImageCaptions();
                analyzeAndAdjustSlides();
            }, 200); // Increased delay to ensure all content is rendered

            // Re-analyze on slide change with debouncing
            let slideChangeTimeout: NodeJS.Timeout;
            deckRef.current?.on('slidechanged', () => {
                clearTimeout(slideChangeTimeout);
                slideChangeTimeout = setTimeout(() => {
                    const currentSlide = document.querySelector('.reveal .slides section.present') as HTMLElement;
                    if (currentSlide) {
                        const slideIndex = Array.from(currentSlide.parentElement?.children || []).indexOf(currentSlide);
                        checkAndAdjustOverflow(currentSlide, slideIndex);
                    }
                }, 100);
            });

            // Re-analyze on window resize
            let resizeTimeout: NodeJS.Timeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    analyzeAndAdjustSlides();
                }, 300);
            });
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
        <>
            <style jsx global>{`
                /* Viewport constraints with higher specificity */
                .reveal {
                    height: 80vh !important;
                    max-height: 80vh !important;
                    margin: 0 auto !important;
                }

                .reveal .slides {
                    height: 80vh !important;
                    width: 100% !important;
                    max-height: 80vh !important;
                    max-width: 100% !important;
                }

                /* Enhanced slide constraints */
                .reveal .slides section {
                    height: 75vh !important;
                    max-height: 75vh !important;
                    width: 100% !important;
                    max-width: 100% !important;
                    box-sizing: border-box !important;
                    padding: 2vh 5% !important;
                    margin: 0 auto !important;

                    /* Flexbox layout for content management */
                    display: flex !important;
                    flex-direction: column !important;
                    justify-content: flex-start !important;
                    align-items: stretch !important;

                    /* Overflow handling */
                    overflow: hidden !important;

                    /* Custom scrollbar styling */
                    scrollbar-width: thin !important;
                    scrollbar-color: rgba(0,0,0,0.3) transparent !important;
                }

                .reveal .slides section::-webkit-scrollbar {
                    width: 6px !important;
                }

                .reveal .slides section::-webkit-scrollbar-track {
                    background: transparent !important;
                }

                .reveal .slides section::-webkit-scrollbar-thumb {
                    background-color: rgba(0,0,0,0.3) !important;
                    border-radius: 3px !important;
                }

                /* Text and content constraints */
                .reveal .slides section * {
                    max-width: 100% !important;
                    word-wrap: break-word !important;
                    overflow-wrap: break-word !important;
                    box-sizing: border-box !important;
                    margin-left: 0 !important;
                    padding-left: 0 !important;
                }

                /* Image scaling to prevent vertical overflow */
                .reveal .slides section img {
                    max-height: 40vh !important;
                    max-width: 90% !important;
                    height: auto !important;
                    width: auto !important;
                    object-fit: contain !important;
                    display: block !important;
                    margin: 0.5rem auto 0.2rem auto !important;
                }

                /* Image caption styling */
                .reveal .slides section .image-caption {
                    font-size: 0.8rem !important;
                    font-style: italic !important;
                    color: #666 !important;
                    text-align: center !important;
                    margin: 0.2rem auto 0.5rem auto !important;
                    max-width: 90% !important;
                    line-height: 1.3 !important;
                }

                /* Ensure content doesn't get cut off on the left */
                .reveal .slides section > * {
                    margin-left: 0 !important;
                    text-align: left !important;
                }

                /* Typography scaling for dense content */
                .reveal .slides section h1 {
                    font-size: clamp(1.8rem, 4vw, 2.5rem) !important;
                    line-height: 1.2 !important;
                    margin: 0 0 0.5em 0 !important;
                }

                .reveal .slides section h2 {
                    font-size: clamp(1.4rem, 3vw, 2rem) !important;
                    line-height: 1.3 !important;
                    margin: 0.3em 0 0.4em 0 !important;
                }

                .reveal .slides section h3 {
                    font-size: clamp(1.2rem, 2.5vw, 1.6rem) !important;
                    line-height: 1.3 !important;
                    margin: 0.2em 0 0.3em 0 !important;
                }

                .reveal .slides section p {
                    font-size: clamp(0.9rem, 2vw, 1.2rem) !important;
                    line-height: 1.4 !important;
                    margin: 0.3em 0 !important;
                }

                /* Enhanced list styling for dense content */
                .reveal .slides section ul,
                .reveal .slides section ol {
                    font-size: clamp(0.8rem, 1.8vw, 1.1rem) !important;
                    line-height: 1.3 !important;
                    margin: 0.2em 0 0.4em 0 !important;
                    padding-left: 1.2em !important;
                }

                .reveal .slides section li {
                    margin: 0.1em 0 !important;
                    padding: 0.05em 0 !important;
                }

                .reveal .slides section li p {
                    margin: 0.1em 0 !important;
                    font-size: inherit !important;
                }

                /* Nested list handling */
                .reveal .slides section ul ul,
                .reveal .slides section ol ol,
                .reveal .slides section ul ol,
                .reveal .slides section ol ul {
                    font-size: 0.9em !important;
                    margin: 0.1em 0 !important;
                }

                /* Code block optimization */
                .reveal .slides section pre,
                .reveal .slides section code {
                    max-width: 100% !important;
                    overflow-x: auto !important;
                    font-size: clamp(0.7rem, 1.5vw, 0.9rem) !important;
                    line-height: 1.2 !important;
                }

                .reveal .slides section pre {
                    margin: 0.3em 0 !important;
                    padding: 0.5em !important;
                }

                /* Strong/bold text optimization */
                .reveal .slides section strong,
                .reveal .slides section b {
                    font-weight: 600 !important;
                }

                /* Blockquote styling */
                .reveal .slides section blockquote {
                    font-size: clamp(0.85rem, 1.8vw, 1.1rem) !important;
                    line-height: 1.3 !important;
                    margin: 0.3em 0 !important;
                    padding: 0.3em 1em !important;
                }

                /* Content density classes for dynamic adjustment */
                .reveal .slides section.dense-content {
                    font-size: 0.85em !important;
                    justify-content: flex-start !important;
                }

                .reveal .slides section.dense-content h1,
                .reveal .slides section.dense-content h2,
                .reveal .slides section.dense-content h3 {
                    margin-top: 0.2em !important;
                    margin-bottom: 0.3em !important;
                }

                .reveal .slides section.very-dense-content {
                    font-size: 0.75em !important;
                }

                .reveal .slides section.very-dense-content ul,
                .reveal .slides section.very-dense-content ol {
                    margin: 0.1em 0 0.2em 0 !important;
                }

                .reveal .slides section.very-dense-content li {
                    margin: 0.05em 0 !important;
                }
            `}</style>
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
        </>
    );
}

export default Presentation;