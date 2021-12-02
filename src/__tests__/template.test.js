import { fillTemplate } from "../template";

describe("fillTemplate", () => {
  it.each`
    input                               | params                                 | output
    ${"/root[/{tenant}][/object-{id}]"} | ${{}}                                  | ${"/root"}
    ${"/root[/{tenant}][/object-{id}]"} | ${{ tenant: "moskva" }}                | ${"/root/moskva"}
    ${"/root[/{tenant}][/object-{id}]"} | ${{ id: "12345" }}                     | ${"/root/object-12345"}
    ${"/root[/{tenant}][/object-{id}]"} | ${{ tenant: "moskva", id: "12345" }}   | ${"/root/moskva/object-12345"}
    ${"Концерты[ в городе {city}]"}     | ${{}}                                  | ${"Концерты"}
    ${"Концерты[ в городе {city}]"}     | ${{ city: "Москва" }}                  | ${"Концерты в городе Москва"}
    ${"Концерт[ {title}][ в {city}]"}   | ${{}}                                  | ${"Концерт"}
    ${"Концерт[ {title}][ в {city}]"}   | ${{ city: "Москве" }}                  | ${"Концерт в Москве"}
    ${"Концерт[ {title}][ в {city}]"}   | ${{ title: "Qwerty" }}                 | ${"Концерт Qwerty"}
    ${"Концерт[ {title}][ в {city}]"}   | ${{ city: "Москве", title: "Qwerty" }} | ${"Концерт Qwerty в Москве"}
    ${"Концерт {title} в {city}"}       | ${{}}                                  | ${"Концерт  в "}
    ${"Концерт {title} в {city}"}       | ${{ city: "Москве", title: "Qwerty" }} | ${"Концерт Qwerty в Москве"}
    ${"Просто строка без переменных"}   | ${{ city: "Москве", title: "Qwerty" }} | ${"Просто строка без переменных"}
  `(
    "fill template '$input' with params $params should be equal '$output'",
    ({ input, params, output }) => {
      expect.hasAssertions();
      expect.assertions(1);

      expect(fillTemplate(input, params)).toBe(output);
    }
  );
});
