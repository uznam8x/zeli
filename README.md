# zeli

functional programming visualization

# example

```js
//input
zeli(`[rect = {width: '100'}, rect]
    --> group
    --> svg`);

//output
{
  "node": {
    "rect": {
      "takes": []
    },
    "group": {
      "takes": [
        {
          "rect": {
            "width": "100"
          }
        },
        {
          "rect": {}
        }
      ]
    },
    "svg": {
      "takes": [
        {
          "group": {}
        }
      ]
    }
  },
  "endpoint": "svg"
}
```
