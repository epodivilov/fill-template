# fill-template

Utility for filling string templates with some values. Supported optional blocks in templates.

## Examples

```javascript
import { fillTemplate } from "fill-template";

// Support simple string templates
fillTemplate("Hello, {name}!", { name: "World" }); // Hello, World!
fillTemplate("Hello, {name}!", {}); // Hello, !

// Support string templates with optional groups
fillTemplate("Hello[, {name}]!", { name: "World" }); // Hello, World!
fillTemplate("Hello[, {name}]!", {}); // Hello!
```
