import { fillTemplate, parse, compose } from "../template";

describe("fillTemplate", () => {
  it.each`
    input                                                          | params                               | output
    ${"/root[/{tenant}][/object-{id}]"}                            | ${{}}                                | ${"/root"}
    ${"/root[/{tenant}][/object-{id}]"}                            | ${{ tenant: "moskva" }}              | ${"/root/moskva"}
    ${"/root[/{tenant}][/object-{id}]"}                            | ${{ id: "12345" }}                   | ${"/root/object-12345"}
    ${"/root[/{tenant}][/object-{id}]"}                            | ${{ tenant: "moskva", id: "12345" }} | ${"/root/moskva/object-12345"}
    ${"Hello[, {name}]"}                                           | ${{}}                                | ${"Hello"}
    ${"Hello[, {name}]"}                                           | ${{ name: "World" }}                 | ${"Hello, World"}
    ${"[{greatening}, ]World"}                                     | ${{}}                                | ${"World"}
    ${"[{greatening}, ]World"}                                     | ${{ greatening: "Hello" }}           | ${"Hello, World"}
    ${"Example[ with {group} groups[ and {variable} variables]]."} | ${{}}                                | ${"Example."}
    ${"Example[ with {group} groups[ and {variable} variables]]."} | ${{ variable: 2 }}                   | ${"Example."}
    ${"Example[ with {group} groups[ and {variable} variables]]."} | ${{ group: 2 }}                      | ${"Example with 2 groups."}
    ${"Example[ with {group} groups[ and {variable} variables]]."} | ${{ group: 2, variable: 2 }}         | ${"Example with 2 groups and 2 variables."}
  `(
    "fill template '$input' with params $params should be equal '$output'",
    ({ input, params, output }) => {
      expect.hasAssertions();
      expect.assertions(1);

      expect(fillTemplate(input, params)).toBe(output);
    }
  );
});

describe("parse", () => {
  it("simple string", () => {
    expect(parse("Test string")).toMatchSnapshot();
  });

  it("string with variable", () => {
    expect(parse("Test string with {var}")).toMatchSnapshot();
  });

  it("string with group", () => {
    expect(parse("Test string[ with group]")).toMatchSnapshot();
    expect(parse("[Test string ]with group")).toMatchSnapshot();
  });

  it("string with group and variable", () => {
    expect(parse("Test string[ with group] and {var}")).toMatchSnapshot();
    expect(parse("Test string[ with group and {var}]")).toMatchSnapshot();
  });

  it("complex string with nested group", () => {
    expect(parse("Test string[ with group[ and {var}]]")).toMatchSnapshot();
    expect(parse("Test string[ with {group}[ and {var}]]")).toMatchSnapshot();
  });
});

describe("compose", () => {
  it("simple ast", () => {
    const ast = {
      children: [
        {
          type: "text",
          value: "Test string",
        },
      ],
      type: "root",
    };
    const values = {};
    expect(compose(ast, values)).toBe("Test string");
  });

  it("ast with variable", () => {
    const ast = {
      children: [
        {
          type: "text",
          value: "Test string with ",
        },
        {
          type: "variable",
          value: "var",
        },
      ],
      type: "root",
    };

    expect(compose(ast)).toBe("Test string with ");
    expect(compose(ast, { var: "<variable>" })).toBe(
      "Test string with <variable>"
    );
  });

  it("ast with group", () => {
    const ast = {
      children: [
        {
          type: "text",
          value: "Test string",
        },
        {
          children: [
            {
              type: "text",
              value: " with group",
            },
          ],
          type: "group",
        },
      ],
      type: "root",
    };

    expect(compose(ast)).toBe("Test string with group");
  });

  it("ast with group and variable", () => {
    const ast = {
      children: [
        {
          type: "text",
          value: "Test string",
        },
        {
          children: [
            {
              type: "text",
              value: " with group and ",
            },
            {
              type: "variable",
              value: "var",
            },
          ],
          type: "group",
        },
      ],
      type: "root",
    };

    expect(compose(ast)).toBe("Test string");
    expect(compose(ast, { var: "<variable>" })).toBe(
      "Test string with group and <variable>"
    );
  });

  it("ast with nested group", () => {
    const ast = {
      children: [
        {
          type: "text",
          value: "Test string",
        },
        {
          children: [
            {
              type: "text",
              value: " with ",
            },
            {
              type: "variable",
              value: "group",
            },
            {
              children: [
                {
                  type: "text",
                  value: " and ",
                },
                {
                  type: "variable",
                  value: "var",
                },
              ],
              type: "group",
            },
          ],
          type: "group",
        },
      ],
      type: "root",
    };

    expect(compose(ast)).toBe("Test string");
    expect(compose(ast, { group: "<group>" })).toBe("Test string with <group>");
    expect(compose(ast, { var: "<variable>" })).toBe("Test string");
    expect(compose(ast, { group: "<group>", var: "<variable>" })).toBe(
      "Test string with <group> and <variable>"
    );
  });
});
