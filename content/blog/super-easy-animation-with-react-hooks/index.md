---
title: Super easy react mount/unmount animations with hooks
date: "2019-06-18"
description: Super easy react mount/unmount animations with hooks.
---

One of the main use cases for animations on the web is simply adding and removing elements from the page. However, doing that with react can be a pain in the ass because we cannot directly manipulate the DOM elements. We let react take care of rendering so we have to do animations the react-way. When faced with this revelation, some developers begin to miss the olden days of jQuery where you could just do: 

```js
$("#my-element").fadeIn("slow");
```

I want to show you the simplest way to animate mounting and unmounting of a component using pure CSS and hooks. For the impatient, here's the code: 


```css
/* index.css */

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
```

```javascript
// Fade.js

import React, { useEffect, useState } from "react";

const Fade = ({ show, children }) => {
  const [render, setRender] = useState(show);

  useEffect(() => {
    if (show) setRender(true);
  }, [show]);

  const onAnimationEnd = () => {
    if (!show) setRender(false);
  };

  return (
    render && (
      <div
        style={{ animation: `${show ? "fadeIn" : "fadeOut"} 1s` }}
        onAnimationEnd={onAnimationEnd}
      >
        {children}
      </div>
    )
  );
};

export default Fade;

```

```javascript
// index.js

import React, { useState } from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import Fade from "./Fade";

const App = () => {
  const [show, setShow] = useState(false);

  return (
    <div>
      <button onClick={() => setShow(show => !show)}>
        {show ? "hide" : "show"}
      </button>
      <Fade show={show}>
        <div> HELLO </div>
      </Fade>
    </div>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```


Let's break down what's going on here. 