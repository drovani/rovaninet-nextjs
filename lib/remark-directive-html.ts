/** @typedef {import('remark-directive')} */

import { h } from 'hastscript';
import { visit } from 'unist-util-visit';

function remarkDirectiveHtml() {
    return (tree) =>
        visit(tree, (node) => {
            if (
                node.type === 'textDirective' ||
                node.type === 'leafDirective' ||
                node.type === 'containerDirective'
            ) {
                const data = node.data || (node.data = {})
                const hast = h(node.name, node.attributes)

                data.hName = hast.tagName
                data.hProperties = hast.properties
            }
        })
}

export default remarkDirectiveHtml
