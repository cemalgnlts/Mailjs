# Include Into Your Project

[![](https://data.jsdelivr.com/v1/package/gh/cemalgnlts/Mailjs/badge)](https://www.jsdelivr.com/package/gh/cemalgnlts/Mailjs)

You can link directly to the latest version by adding the following script tag inside your head tags:

```
https://cdn.jsdelivr.net/gh/cemalgnlts/Mailjs@latest/mailjs.min.js
https://cdn.jsdelivr.net/gh/cemalgnlts/Mailjs@latest/eventsource.min.js
```

```html
<script src="https://cdn.jsdelivr.net/gh/cemalgnlts/Mailjs@2.0/mailjs.min.js"></script>
```

Include `EventSourcePolyfill` if you want to listen when new messages arrive:

```html
<script src="https://cdn.jsdelivr.net/gh/cemalgnlts/Mailjs@latest/eventsource.min.js"></script>
```

# Demo

## Basic

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Page Title</title>
        <script src="https://cdn.jsdelivr.net/gh/cemalgnlts/Mailjs@2.0/mailjs.min.js"></script>
    </head>
    <body>
        <p>
            Domain name: <span id="domain">Loading...</span>
        </p>
        
        <script>
            const mailjs = new Mailjs();
            mailjs.getDomains()
            .then((res) => {
                console.log(res);

                if(!res.status) {
                    return;
                    alert(res.message);
                }
                
                document.querySelector("#domain").innerText = res.data[0].domain;
            });
        </script>
    </body>
</html>
```

## Listener
[listener.html](listener.html)