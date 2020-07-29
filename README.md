# zeli

functional programming visualization

# example

```js
//input
zeli(`[rect, rect] --> group --> svg`);

//output
import rect from './rect';
import group from './group';
import svg from './svg';

export default new Propmise((resolve) => resolve({}))
  .then(pipe(task(rect, {}), task(rect, {})))
  .then(task(group, {}))
  .then(task(svg, {}));
```
