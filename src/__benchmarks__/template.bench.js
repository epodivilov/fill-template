import { benchmarkSuite } from "jest-bench";
import { fillTemplate } from "../template";

let inputs = [
  ...Array(1000000)
    .fill(null)
    .map((_, id) => "Text[ with {var}][ {var}]"),
];

benchmarkSuite("fillTemplate", {
  ["fillTemplate execute several templates"]: () => {
    inputs.forEach((t) => fillTemplate(t, { var: "variable" }));
  },
});
