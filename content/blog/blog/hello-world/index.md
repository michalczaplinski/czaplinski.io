---
title: Make your own MobX-like state management library in 40 LOC
date: "2019-02-22"
description: Make your own MobX-like state management library in 40 LOC
---

⚠️ **NOTE: This post assumes a good familiarity with react**. You don't need to be an expert, if you've used it to make UIs before, you're gonna be fine, I promise 🙂.

If you prefer a video version, check out my [meetup talk](https://youtu.be/S2x4WrbVYEk?t=5167) that this blog post is based on.

### What the big deal is about ?

Have you been using MobX or a similar state-management library and wondering how it just "knows" how and when to update your components when some of your data changes? Well, wonder no more because today, I ll show you how to make your own state management library that will approximate how MobX works. Of course, this is just for fun and education, so don't use this code in any production app! Let's go!

#### Caveats:

- We're using react as a view library but there's no reason why it would not work with other component-based libs (Vue, Angular).
- It will only work with react's class components. There is no reason why it would not work with functional components, but we're trying to keep the implementation as minimal as possible.
- We will only allow one data store per application. This means that we will have to store all of our state in one JS object. Again, this is an arbitrary limitation which I set in order to focus on the core algorithm.

### Our API

What do we want our API to look like? I would like to keep things as simple as possible so inspired by [react-easy-state](https://github.com/solkimicreb/react-easy-state/) I want to create 2 functions: `store` and `view`:

- The `store` function will be used to create objects that store our state.
- The `view` function will be used to wrap a component and make it reactive to changes in our state.

Let's call our library `observablabla`. This is what a "Hello World" application using `observablabla` is going to look like:

```jsx
import React from "react"
import { store, view } from "observablabla"

const state = store({ number: 42 })

class Hello extends React.Component {
  render() {
    return <div> {state.number} </div>
  }
}
```

However, before we go on to actually build this thing, we need to take a little detour and understand how javascript [Proxies](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy) work.

### Proxies

Proxies were added to javascript with the ES2015 standard but unlike [classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/class) or [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions), they have not been very talked about, so if you never heard of them don't feel bad 🙂.

Proxies allow you to customize the behaviour of an object. You might the familiar with the [getters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get) and [setters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set) that allow you to define custom functions that are called when an object's property is looked up (getters) or set (setters). Proxies are like getters and setters on steroids. They allow you to modify every aspect of an object's behaviour not only setting and getting of properties. Let's see what this means with a simple code example:

```javascript
const target = {
  number: 42,
}

const handler = {}

const proxy = new Proxy(target, handler)
console.log(proxy.number) // 42
```

This is the "Hello World!" of Proxies - the **target** and **proxy** objects are structurally identical. Thus:

```javascript
JSON.stringify(proxy) === JSON.stringify(target) // true
```

We can make our proxy a little more interesting by adding **traps** to our `handler` object. Traps are just regular methods (functions) that customize the behaviour of `get`, `set`, `delete` operations, etc. Let's modify the code example:

```javascript
const target = {
  number: 42,
}

const handler = {
  get: (obj, prop) => {
    return obj[prop] + 1
  },
}

const proxy = new Proxy(target, handler)

console.log(target.number) // This is still 42
console.log(proxy.number) // This now returns 43 !
```

Our original object is unmodified, but now when we use our `proxy` object it "proxies" every property access through the `get` trap. We can now do the same for the `set` operation:

```javascript
const handler = {
  get: (obj, prop) => {
    return obj[prop] + 1
  },
  set: (obj, prop, value) => {
    obj[prop] = value
    obj.greeting = `Hello, ${value}!`
  },
}

proxy.name = "Steve"
console.log(proxy.name) // Steve
console.log(proxy.greeting) // Hello, Steve!
```
