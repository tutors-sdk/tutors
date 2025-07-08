---
order: 1
---
# Note 5

This is an example of a note. It can have images:

![](img/01.png)

Mathematical notation:

~~~latex
f(x) = \int_{-\infty}^\infty\hat f(\xi)\,e^{2 \pi i \xi x}\,d\xi
~~~

A code blocks:

#### user-api-test.js

~~~javascript
import { playtimeService } from "./playtime-service.js";

suite("User API tests", () => {
  setup(async () => {
  });
  teardown(async () => {
  });

  test("create a user", async () => {
  });
});
~~~

A table if you like:

| Option | Description |
| ------ | ----------- |
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |


#### Exercises & Archives

You can link to zipped archives:

- [Solutions](./archives/archive.zip)