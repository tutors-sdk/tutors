# Note 1

This is an example of a note. 

It can have images:

![](img/01.png)

A code block with syntax highlighting:

### user-api-test.js

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

### Mathematical notation:

$
f(x) = \int_{-\infty}^\infty\hat f(\xi)\,e^{2 \pi i \xi x}\,d\xi
$

This is an inline exampe: $c = \pm\sqrt{a^2 + b^2}$ with text before and after


### Tables

| Option | Description |
| ------ | ----------- |
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |

Right aligned columns

| Option | Description |
| ------:| -----------:|
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |


### Links to Archives

You can link to zipped archives:

- [Solutions](./archives/archive.zip)