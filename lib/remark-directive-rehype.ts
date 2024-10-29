import { h } from 'hastscript';
import type { Directives as DirectiveNode } from 'mdast-util-directive';
import type { Plugin, Transformer } from 'unified';
import type { Node } from 'unist';
import type { MapFunction } from 'unist-util-map';
import { map } from 'unist-util-map';


const isDirectiveNode = (node: Node): node is DirectiveNode => {
    const { type } = node;
    return type === 'textDirective' || type === 'leafDirective' || type === 'containerDirective';
}

const mapDirectiveNode: MapFunction = (node) => {
    if (isDirectiveNode(node)) {
        const { properties, tagName } = h(node.name, node.attributes);
        return {
            ...node,
            data: {
                hName: tagName,
                hProperties: properties
            }
        }
    }
    return node;
}

const transformNodeTree: Transformer = (nodeTree) => map(nodeTree, mapDirectiveNode);
const remarkDirectiveRehype: Plugin = () => transformNodeTree;
export default remarkDirectiveRehype;
