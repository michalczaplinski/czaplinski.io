---
title: Build your own MobX-like state management library in 40 lines of code
date: "2019-05-31"
description: Build your own MobX-like state management library in 40 lines of code.
---

⚠️ **NOTE: This post assumes good familiarity with react**. You don't need to be an expert, if you've used it to make UIs before, you're gonna be fine, I promise 🙂.

If you prefer a video version, check out my [meetup talk](https://youtu.be/S2x4WrbVYEk?t=5167) that this blog post is based on (video quality is not great, unfortunately).

### What the big deal is about ?

Have you been using MobX or a similar state-management library and wondering how it just "knows" how and when to update your components when some of your data changes? Look at the following code example straight from the MobX [docs](https://mobx.js.org/refguide/observer-component.html):

```jsx
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

 How does react *actually* know that a change in `secondsPassed` should trigger a re-render? Well, wonder no more because today I ll show you how to make your own state management library that will cover 90% of the use cases! Of course, the other 10% is what accounts for numerous edge cases, weird browser bugs, provides helpful error messages to the user and so on. We are not making it production-ready, but just trying to reverse-engineer how state management works and learn something on the way! Let's go!

#### Caveats:

- We're using react as a view library but there's no reason why it would not work with other component-based libs (Vue, Angular, whatever else 🙂).
- It will only work with react's class components. There is no technical reason why it would not work with function components, but we're trying to keep the implementation as minimal as possible. Making it *also* work with function components would actually take twice as much code (keep reading, more details below)
- We will only allow one data store per application. This means that we will have to store all of our state in one JS object. Again, this is an arbitrary limitation which I set in order to focus on the core algorithm. 

### Our API

The first question that a library author should ask themselves is: "What do I want my API to look like?". Ideally, we would like to keep the number of concepts that a user needs to learn to an absolute minimum. With that in mind, to keep things as simple as possible, and inspired by [react-easy-state](https://github.com/solkimicreb/react-easy-state/) I want our library to only consist of 2 functions: `store` and `view`:

- The `store` function wraps an object which contains our state.
- The `view` function wraps a react component and makes it *reactive* to changes in the state.

Let's call our library `observablabla`. This is what a "Hello World" application using `observablabla` is going to look like:

```jsx
import React from "react";
import { store, view } from "observablabla";

const state = store({ text: "Hello World!" });

class Hello extends React.Component {
  render() {
    return <div> {state.text} </div>
  }
};
```

However, before we go on to actually build this thing, we need to take a little detour and understand how javascript [Proxies](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy) work because they are the secret sauce that makes our components *reactive* to changes in our `store`. If you're already familiar with them feel, free to skip ahead to [Implementation](#implementation).

### Proxies

Proxies were added to javascript with the ES2015 standard but unlike [classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/class) or [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions), they have not been very talked about, so if you have never heard of them don't feel bad 🙂. 

They allow you to customize the behaviour of an object. What do we mean by that? You might be familiar with the [getters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get) and [setters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set) that allow you to define custom functions that are called when an object's property is looked up (getters) or set (setters). Proxies are like getters and setters on steroids. They allow you to modify every aspect of an object's behaviour not only setting and getting of properties. Let's see what this means with a simple code example:

```jsx
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

```js
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

You can imagine that the green, blue and red boxes correspond to the render methods of respective react components. The **store** is just a plain object wrapped with a `store` function. Whenever some value in this store gets updated, we want to **re-render** each component that uses that piece of state. How do we do that?

The answer is on the right hand side! We want our library to build up a mapping between every property available in the store and a list of components that should re-render when that property changes. We'll store that mapping in a variable called `reactionsMap`. So, in our diagram, whenever `store.text` is updated, `Component1` and `Component3` should re-render, but *not* `Component3`. 

Armed with this knowledge, we're ready to sketch out the implementation of the library:

```javascript
// highlight-range{3-6}
const reactionsMap = {};

// It will point to a component instance that is being rendered. 
// We are going to use it later on 🙂
let currentlyRenderingComponent;


// The handler currently does nothing so far...
const handler = {
  get: function(target, key) {
    return target[key];   
  },
  set: function(target, key, value) {
    target[key] = value;
    return true;
  }
};

// For now, this just does nothing
export function store(object) {
  return new Proxy(object, handler);
}

// And this also does not do anything yet...
export function view(MyComponent) {
  return MyComponent;
}
```

Let's first augument the `view` function with additional functionality...

```javascript
// highlight-range{19-28}
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
  return class Observer extends MyComponent {
    ID = `${Math.floor(Math.random() * 10e9)}`;

    render() {
      currentlyRenderingComponent = this;
      const renderValue = super.render();
      currentlyRenderingComponent = undefined;
      return renderValue;
    }
  };
}

```

We are using class inheritance to extend the functionality of `MyComponent`. Our `view` function is only going to work if we pass it a class component as an argument. If were writing a "serious" library, we could add code that checks whether `MyComponent` is a function and, if so, automatically wrap it in a class ([which is what MobX actually does under the hood](https://github.com/mobxjs/mobx-react/blob/master/src/observer.js#L339:L341)) but we're not gonna do that now, for no reason other than just trying to keep things simple.

The `ID` that we assign to our component will be needed later on. For now, just know it that we need it so that we can track the identity of our components.

The interesting stuff is happening **inside** of the `render` function. Try to picture what steps are taken when we render a component that has been wrapped with our `view` function. The reason we are **setting** and **un-setting** `currentlyRenderingComponent` is so that we can keep track of which component is being rendered and when. Why do we need to do that? 

It will become clear from looking at the updated implementation of the `store` function:

```javascript
// highlight-range{2-23}
const handler = {
  get: function(target, key) {
    // If there is no component currently rendering it means that 
    // we have accessed the store from outside of a react component. 
    // We can just return the value for the given key
    if (typeof currentlyRenderingComponent === "undefined") {
      return target[key];
    }
    // In case we don't track the `key` yet, start tracking it
    // and set its value to currently rendering component 
    if (!reactionsMap[key]) {
      reactionsMap[key] = [currentlyRenderingComponent];
    }
    // We already track the `key`, so let's check 
    // if we track the currentlyRendering component for that key.
    const hasComponent = reactionsMap[key].find(
      comp => comp.ID === currentlyRenderingComponent.ID
    );
    if (!hasComponent) {
      reactionsMap[key].push(currentlyRenderingComponent);
    }
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
```

Our new implementation has a new interesting side-effect: It checks what component is **currently rendering** whenever we access some property on our store. With this clever trick we can build up our `reactionsMap` by simply checking the value of `currentlyRenderingComponent` for each store property that is being accessed.

Great, now we have built up our map of reactions ( which will happen on the first render). But we still need a way to tell react to update the components whenever we `set` a new property on our store. Remember, we want to only update the component that **uses** that updated property. Well, we just use the data from our `reactionsMap`:


```javascript
// highlight-range{21-25}
const reactionsMap = {};
let currentlyRenderingComponent;

const handler = {
  get: function(target, key) {
    if (typeof currentlyRenderingComponent === "undefined") {
      return target[key];
    }
    if (!reactionsMap[key]) {
      reactionsMap[key] = [currentlyRenderingComponent];
    }
    const hasComponent = reactionsMap[key].find(
      comp => comp.ID === currentlyRenderingComponent.ID
    );
    if (!hasComponent) {
      reactionsMap[key].push(currentlyRenderingComponent);
    }
    return target[key];
  },

  set: function(target, key, value) {
    reactionsMap[key].forEach(component => component.forceUpdate());
    target[key] = value;
    return true;
  }
};

export function store(object) {
  return new Proxy(object, handler);
}

export function view(MyComponent) {
  return class Observer extends MyComponent {
    ID = `${Math.floor(Math.random() * 10e9)}`;

    render() {
      currentlyRenderingComponent = this;
      const renderValue = super.render();
      currentlyRenderingComponent = undefined;
      return renderValue;
    }
  };
}
```

And with this we've actually completed our implementation! 🎉

You can check out a live version on [Codesandbox](https://codesandbox.io/s/v191wkn77) and play around with it.

If you enjoyed this, you can follow me on [twitter](https://twitter.com/c_z_a_p_l_a) for more JS-related things. If you hated it, you can follow me on [twitter](https://twitter.com/c_z_a_p_l_a) and tell me why it sucked 😛. Seriously, I'm always super happy to hear your thoughts and there is no comment too small or too silly! And if you find any mistakes, let me know! The source for this post is right here: https://github.com/michalczaplinski/michalczaplinski.github.io

Last but not least, I wanna give a shout out to both [MobX](https://github.com/mobxjs/mobx/) and [react-easy-state](https://github.com/solkimicreb/react-easy-state) which are awesome state management libraries and main inspirations for this post.