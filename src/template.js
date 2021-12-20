/**
 *
 * @typedef {Object} Node
 * @property {'text'|'variable'} type
 * @property {string} value
 *
 * @typedef {Object} Container
 * @property {'root'|'group'} type
 * @property {Array<Node|Container>} children
 */

/**
 *
 * @param {string} value
 * @returns {Container}
 */
export function parse(string) {
  /** @type {Container} */
  const root = {
    type: "root",
    children: [],
  };

  let stack = [root];
  let type = "text";
  let value = "";

  let idx = 0;
  while (idx < string.length) {
    const ch = string.charAt(idx);

    if (ch === "[" || ch === "]" || ch === "{" || ch === "}") {
      if (value.length > 0) {
        stack[0].children.push({ type, value });
      }
    }

    switch (ch) {
      case "[": {
        const group = { type: "group", children: [] };
        stack[0].children.push(group);
        stack.unshift(group);

        type = "text";
        value = "";
        break;
      }
      case "]": {
        stack.shift();

        type = "text";
        value = "";
        break;
      }
      case "{": {
        type = "variable";
        value = "";
        break;
      }
      case "}": {
        type = "text";
        value = "";
        break;
      }
      default: {
        value += ch;
      }
    }

    idx++;
  }

  if (value.length > 0) {
    stack[0].children.push({ type, value });
  }

  return root;
}

/**
 *
 * @param {Container} ast
 * @returns {string}
 */
export function compose(ast, values = {}) {
  let result = "";

  /** @type {Array<Node|Container>} */
  const nodes = [ast];

  while (nodes.length > 0) {
    const node = nodes.shift();

    if (node.type === "root" && Array.isArray(node.children)) {
      nodes.unshift(...node.children);
      continue;
    }

    if (node.type === "group" && Array.isArray(node.children)) {
      const hasUndefinedVariable = node.children.some(
        (it) => it.type === "variable" && values[it.value] == null
      );

      if (!hasUndefinedVariable) {
        nodes.unshift(...node.children);
      }

      continue;
    }

    if (node.type === "text") {
      result += node.value;
      continue;
    }

    if (node.type === "variable" && values[node.value]) {
      result += values[node.value];
    }
  }

  return result;
}

/**
 * Fill template with variables
 * @param {string} string
 * @param {Record<string,string>} values
 */
export function fillTemplate(string, values = {}) {
  const ast = parse(string);

  return compose(ast, values);
}
