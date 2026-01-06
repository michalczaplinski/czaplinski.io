---
title: Super easy react mount/unmount animations with hooks
pubDate: 2019-07-05
description: Super easy react mount/unmount animations with hooks.
heroImage: /blog-placeholder-2.jpg
---

One of the main use cases for animations on the web is simply adding and removing elements from the page. However, doing that in react can be a pain in the ass because we cannot directly manipulate the DOM elements! Since we let react take care of rendering, we are forced to do animations the react-way. When faced with this revelation, some developers begin to miss the olden days of jQuery where you could just do:

```js
$("#my-element").fadeIn("slow");
```

In case you are wondering what that the difficulty is exactly, let me illustrate with a quick example:

```css
/* styles.css */

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
```

```js
// index.js

const App = ({ show = true }) =>
  show ? <div style={{ animation: `fadeIn 1s` }}>HELLO</div> : null;
```

This is all we need to animate _mounting_ of the component with a `fadeIn`, but there is no way to animate the _unmounting_, because we remove the the `<div/>` from the DOM as soon as the `show` prop changes to false! The component is gone and there is simply no way animate it anymore. What can we do about it? 🤔

Basically, we need to tell react to:

1. When the `show` prop changes, don't unmount just yet, but "schedule" an unmount.
2. Start the unmount animation.
3. As soon as the animation finishes, unmount the component.

I want to show you the simplest way to accomplish this using pure CSS and hooks. Of course, for more advanced use cases there are excellent libraries like [react-spring](https://www.react-spring.io/).

For the impatient, here's the code, divided into 3 files:

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
      <button onClick={() => setShow((show) => !show)}>
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

```js
// Fade.js

import React, { useEffect, useState } from "react";

const Fade = ({ show, children }) => {
  const [shouldRender, setRender] = useState(show);

  useEffect(() => {
    if (show) setRender(true);
  }, [show]);

  const onAnimationEnd = () => {
    if (!show) setRender(false);
  };

  return (
    shouldRender && (
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

```css
/* styles.css */

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

Let's break down what's going on here, starting with the first file. The interesting part is this:

```js {11-13}
// index.js

const App = () => {
  const [show, setShow] = useState(false);

  return (
    <div>
      <button onClick={() => setShow((show) => !show)}>
        {show ? "hide" : "show"}
      </button>
      <Fade show={show}>
        <div> HELLO </div>
      </Fade>
    </div>
  );
};
```

We simply pass a `show` prop which controls whether to show the children of the `<Fade />` component. The rest of the code in this component is just managing the hiding/showing using the [useState](https://reactjs.org/docs/hooks-state.html) hook.

`<Fade/>` component receives 2 props: `show` and `children`. We use the value of the `show` prop to initialize the `shouldRender` state of the `<Fade />` component:

```js
// Fade.js

const Fade = ({ show, children }) => {
  const [shouldRender, setRender] = useState(show);
  // ...
};
```

This gives use a way to separate the _animation_ from the _mounting/unmounting_.

The `show` prop controls whether we apply the `fadeIn` or `fadeOut` animation and the `shouldRender` state controls the mounting/unmounting:

```js {3,5}
// ...
return (
  shouldRender && (
    <div
      style={{ animation: `${show ? "fadeIn" : "fadeOut"} 1s` }}
      onAnimationEnd={onAnimationEnd}
    >
      {children}
    </div>
  )
);
// ...
```

You can recall from before that our main problem was that react will unmount the component at the same time as we try to apply the animation, which results in the component disappearing immediately. But now we have separated those two steps!

We just need a way to tell react to _sequence_ the `fadeOut` animation and the unmounting and we're done! 💪

For this, we can use the [onAnimationEnd](https://reactjs.org/docs/events.html#animation-events) event. When the animation has ended running _and_ the component should be hidden (`show === false`) then set the `shouldRender` to false!

```js
const onAnimationEnd = () => {
  if (!show) setRender(false);
};
```

The whole example is also on [Codesandbox](https://codesandbox.io/s/react-easy-animation-b658i) where you can play around with it!

### Hey! 👋 Before you go! 🏃‍♂️

If you enjoyed this post, you can follow me on [twitter](https://twitter.com/C_Z_A_P_L_A) for more programming content or drop me an [email](mailto:mmczaplinski@gmail.com) 🙂

I absolutely love comments and feedback!!! ✌️
