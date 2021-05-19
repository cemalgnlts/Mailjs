# Include Into Your Project

You can link directly to the latest version by adding the following script tag inside your head tags:

```
https://cdn.jsdelivr.net/gh/cemalgnlts/Mailjs/Mailjs.min.js
```

```html
<script src="https://cdn.jsdelivr.net/gh/cemalgnlts/Mailjs/Mailjs.min.js"></script>
```

# Demo

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Page Title</title>
        <script src="https://cdn.jsdelivr.net/gh/cemalgnlts/Mailjs/Mailjs.min.js"></script>
    </head>
    <body onload="onLoad()">
        <p>
            Domain name: <span id="domain">Loading...</span>
        </p>
        
        <script>
            function onLoad() {
                const mailjs = new Mailjs();
                mailjs.getDomains().then((res) => {
                    console.log(res)
                    document.querySelector("#domain").innerText = res.data[0].domain;
                });
            }
        </script>
    </body>
</html>

```
