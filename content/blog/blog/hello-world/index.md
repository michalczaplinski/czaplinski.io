---
title: Make your own MobX-like state management library in 40 LOC
date: "2019-02-22"
description: Make your own MobX-like state management library in 40 LOC
---

⚠️ **NOTE: This post assumes good familiarity with react**. You don't need to be an expert, if you've used it to make UIs before, you're gonna be fine, I promise 🙂.

If you prefer a video version, check out my [meetup talk](https://youtu.be/S2x4WrbVYEk?t=5167) that this blog post is based on (video quality is not great, unfortunately).

### What the big deal is about ?

Have you been using MobX or a similar state-management library and wondering how it just "knows" how and when to update your components when some of your data changes? Look at the following code example straight from the MobX [docs](https://mobx.js.org/refguide/observer-component.html):

```js
import {observer} from "mobx-react";

var timerData = observable({
  secondsPassed: 0
});

setInterval(() => {
  timerData.secondsPassed++;
}, 1000);

@observer class Timer extends React.Component {
  render() {
    return (
      <span>
        Seconds passed: {this.props.timerData.secondsPassed} 
      </span>
    )
  }
};

ReactDOM.render(<Timer timerData={timerData} />, document.body);
```

 How does react *actually* know that a change in `secondsPassed` should trigger a re-render? Well, wonder no more because today, I ll show you how to make your own state management library that will approximate how MobX works. Of course, this is just for fun and education, so don't use this code in any production app! Let's go!

#### Caveats:

- We're using react as a view library but there's no reason why it would not work with other component-based libs (Vue, Angular).
- It will only work with react's class components. There is no reason why it would not work with functional components, but we're trying to keep the implementation as minimal as possible.
- We will only allow one data store per application. This means that we will have to store all of our state in one JS object. Again, this is an arbitrary limitation which I set in order to focus on the core algorithm.

### Our API

What do we want our API to look like? I would like to keep things as simple as possible so inspired by [react-easy-state](https://github.com/solkimicreb/react-easy-state/) I want to create 2 functions: `store` and `view`:

- The `store` function wraps an object which contains our state.
- The `view` function wraps a react component and makes it *reactive* to changes in the state.

Let's call our library `observablabla`. This is what a "Hello World" application using `observablabla` is going to look like:

```jsx
import React from "react";
import { store, view } from "observablabla";

const state = store({ number: 42 });

class Hello extends React.Component {
  render() {
    return <div> {state.number} </div>
  }
};
```

However, before we go on to actually build this thing, we need to take a little detour and understand how javascript [Proxies](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy) work because it will be the basis for our implementation. If you're already familiar with them feel free to skip ahead to [Implementation](#implementation).

### Proxies

Proxies were added to javascript with the ES2015 standard but unlike [classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/class) or [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions), they have not been very talked about, so if you never heard of them don't feel bad 🙂. 

Proxies allow you to customize the behaviour of an object. You might the familiar with the [getters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get) and [setters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set) that allow you to define custom functions that are called when an object's property is looked up (getters) or set (setters). Proxies are like getters and setters on steroids. They allow you to modify every aspect of an object's behaviour not only setting and getting of properties. Let's see what this means with a simple code example:

```javascript
const target = {
  number: 42,
};

const handler = {};

const proxy = new Proxy(target, handler);
proxy.number;  // 42
```

This is the "Hello World!" of Proxies - the **target** and **proxy** objects are structurally identical. Thus:

```javascript
JSON.stringify(proxy) === JSON.stringify(target) // true
```

We can make our proxy a little more interesting by adding **traps** to our `handler` object. Traps are just regular methods that customize the behaviour of `get`, `set`, `delete` operations, etc. Let's modify the code example:

```javascript
// highlight-range{7-9}
const target = {
  number: 42,
};

const handler = {
  // `obj` is the proxied object, `prop` is the property being accessed.
  get: (obj, prop) => {
    return obj[prop] + 1;
  },
};

const proxy = new Proxy(target, handler);

target.number; //=>  This is still 42
proxy.number;  //=>  This now returns 43 !
```

Our original object is unmodified, but now when we use our `proxy` object it "proxies" every property access through the `get` trap. We can now do the same for the `set` operation:

```javascript
// highlight-range{5-8}
const handler = {
  get: (obj, prop) => {
    return obj[prop] + 1;
  },
  set: (obj, prop, value) => {
    obj[prop] = value;
    obj.greeting = `Hello, ${value}!`;
  },
};

proxy.name = "Michal";
proxy.name;       //=>  Michal
proxy.greeting;   //=>  Hello, Michal!
```

If the proxies still do not click for you, reader, go ahead and read [this article](https://ponyfoo.com/articles/es6-proxies-in-depth), I'll wait here 🙂.

### Implementation

OK, so now that we understand how proxies work, how do we go about implementing this thing? Let's look at a diagram:

![architecture](/architecture.png)

You can imagine that the green, blue and red boxes correspond to the render methods of respective react components. The **store** is just a plain object wrapped with a `store` function. Whenever some value in this store gets updated in that store we want to rerender each component that uses that piece of state. How do we do that?

The answer is on the right hand side! We want our library to build up a mapping between every property available in the store and a list of components that should re-render when that property changes. We'll store that mapping in a variable called `reactionsMap`. So, in our diagram, whenever `store.text` is updated, `Component1` and `Component3` should re-render, but *not* `Component3` (because we don't want to waste doing this). 


```javascript

const reactionsMap = {};
let currentlyRenderingComponent;

const handler = {
  get: function(target, key) {
    return target[key];   
  },
  set: function(target, key, value) {
    target[key] = value;
    return true;
  }
};

export function store(object) {
  return new Proxy(object, handler);
}

export function view(MyComponent) {
  return MyComponent;
}
```