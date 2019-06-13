This is the third post on the series about Confident React App where I show how I build up the confidence in the source code of my React apps. [Here's](http://williamrjribeiro.com/?p=163) the begining of the story.

## Coding confidently with BDD + TDD
[Research has shown that Test Driven Development is one of the most effective measures for increasing the perceived quality of the developed software: from ~40% to ~80% increase. They also measured the increase in effort/cost for applying it.](https://www.computer.org/csdl/magazine/so/2007/03/s3024/13rRUygT7kK)

We can't skip such effective technique, right? But how do we do it? Well, there's the [TDD bible](https://books.google.de/books/about/Test_driven_Development.html?id=CUlsAQAAQBAJ) to study and also
[“The Three Laws of TDD”](https://www.youtube.com/watch?v=qkblc5WRn-U) to follow:

* You are not allowed to write any production code unless it is to make a failing unit test pass.
* You are not allowed to write any more of a unit test than is sufficient to fail; and compilation failures are failures.
* You are not allowed to write any more production code than is sufficient to pass the one failing unit test.

That's much easier said than done. After months of practice, it still takes me a while to get into the TDD flow so I need to be very aware to not break the rules. Because of the accured learning curve and effort it's easy to make mistakes and misuse which causes some [resentment](https://softwareengineering.stackexchange.com/questions/98485/tdd-negative-experience). The most common issue I observe is test code that is too coupled with implementation details, [especially in React apps](https://kentcdodds.com/blog/testing-implementation-details).

I suspect that this happens because of the _mindset_ the developer is in when doing tests first: you get framed on testing everything! 100% test coverage is counterproductive because [not every part of your code is equally worth the test hassle](https://dev.to/danlebrero/the-tragedy-of-100-code-coverage) and is also an [illusion](https://www.javaworld.com/article/2071941/the-fallacy-of-100--code-coverage.html).

The [Behavior Driven Development](https://blog.testlodge.com/what-is-bdd/) approach is my favorite because it sets the best mindset: it builds on top of TDD focusing [on business goals and drive towards shared understanding through conversations](https://hackernoon.com/bdd-is-bigger-than-i-thought-db8d73f1ea41). In other words, it helps improve communication. When we read the test cases out loud, it feels like normal speech so it fits snugly into our minds. [Good software is software that fits in our heads](https://www.youtube.com/watch?v=4Y0tOi7QWqM).

Our acceptance criteria are already written in BDD style, so the devs - we - have a perfect guide to start with.

## Starting from the bottom
For this particular case, I think starting from the bottom/leave components will be easier since its basically the `list-group` component from Bootstrap. We won't need to implement all the described features but make sure to [get familiar with it](https://getbootstrap.com/docs/4.3/components/list-group/).

We quickly realize that `list-group` is composed of multiple `list-group-item`. A list of items! So the leaf component should be `<ListGroupItem>`. Since the two are closely related, let's keep their implementation in the same file.

So we create the two files and fire up the tests:

`mkdir src/components && touch src/components/listGroup.js && touch src/components/listGroup.spec.js`

Don't forget to add `// @flaw`. ;-)

I've picked Airbnb's [Enzyme](https://airbnb.io/enzyme/) test renderer because it has the necessary funcionality for writing the kind of tests I preffer the most. Notably, Kent doesn't like it and he has [his reasons](https://blog.kentcdodds.com/why-i-never-use-shallow-rendering-c08851a68bb7). I'll explain why I still use `shallow` soon enough. 

To add the tools we need:

`yarn add -D enzyme enzyme-adapter-react-16 jest-enzyme && yarn flow-typed install enzyme@3`

And add the new file `src/setupTests.js`:

```js
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-enzyme';

configure({ adapter: new Adapter() });
```

## A Component's purpose
We start by describing what we're testing, in this case the new `<ListGroupItem />` component. Its sole purpose is to return valid JSX compliant with the component contract. The HTML + CSS defined by our external dependency, Bootstrap, is the contract that our React component must fulfil. It should be fairly simple to test because our component is just a pure function.

For now, [Enzyme's `shalow`](https://airbnb.io/enzyme/docs/api/shallow.html) is the right tool for the job.

```js
// src/components/listGroup.spec.js
// @flaw
import React from 'react';
import { shallow } from 'enzyme';
import ListGroup from './ListGroup';

describe('<ListGroupItem />', () => {
  it('renders without crashing', () => {
    shallow(<ListGroupItem />)
  });
});

```

When we run the test watcher...

`yarn test`

 ... we get our first expected **red** of the cycle! This is obvious since there is no implementation yet. Keeping in mind the first rule of TDD, we implement our component to make this test pass:

```js
// src/components/listGroup.js
// @flaw
import React from 'react';

function ListGroupItem () {
  return null
}

export ListGroupItem;
```

Now we're in the first expected **green**! Doesn't that feel good? Let's restart the cycle and get into red again by testing someting more useful.

In order to make our test more meaningful we rename it to `renders according to specification`. It only passes if the component doesn't crash anyway. And the next thing we validate is the generated structure. **Red:**

```js
// src/components/listGroup.spec.js
it('renders according to specification', () => {
  expect(
    shallow(<ListGroupItem />)
  ).toContainExactlyOneMatchingElement('li.list-group-item');
});
```

 The test code above takes advantage of some special [`jest-enzyme` matchers](https://github.com/FormidableLabs/enzyme-matchers/blob/master/packages/jest-enzyme/README.md#matchers) to make our code more readable. **Green:**

```js
// src/components/listGroup.js
function ListGroupItem () {
  return <li className='list-group-item' />
}
```

The specification determines that every list item can have a string or an anchor as child. Let's start with the string and assume it's required. **Red**:

```js
// src/components/listGroup.spec.js
describe('<ListGroupItem />', () => {
  it('renders according to specification', () => {
    const wrapper = shallow(<ListGroupItem>item 1</ListGroupItem>);

    expect(wrapper).toContainExactlyOneMatchingElement('li.list-group-item');
    expect(wrapper).toHaveText('item 1');
  });
});
```

The implementation is more interesting now: in order to guarantee that the component is used correctly, we have to validate the given props. Flow comes in handy for this task. **Green:**

```js
type ListGroupItemProps = {
  children: string,
};

function ListGroupItem (props: ListGroupItemProps) {
  return <li className="list-group-item">{props.children}</li>;
}
```

Note that the Jest watcher does not run Flow on file changes so type errors won't break the tests. You can use [`flow-watch`](https://github.com/jedwards1211/flow-watch#readme) so Flow runs in every file change. Or, if you're using an IDE, adding a Flow extension will come in handy.

This is enough features for this component for now. Let's move on to the next component.

## Red, Green, Red, Green, ...
`<ListGroup>` is the parent component that has many `<ListGroupItem>`s. Just to save some time, here's the whole component **red** tests:

```js
describe('<ListGroup />', () => {
  it('renders according to specification', () => {
    const wrapper = shallow(
      <ListGroup>
        <ListGroupItem>item 1</ListGroupItem>
        <ListGroupItem>item 2</ListGroupItem>
      </ListGroup>
    );

    expect(wrapper).toContainExactlyOneMatchingElement('ul.list-group');
    expect(wrapper.find(ListGroupItem).length).toEqual(2);
  });
});
```

Now we have to put both components to work together and since an empty list item didn't make sense, a list group without list items doesn't either so lets enforce its requirement. **Green:**

```js
type ListGroupProps = {
  children: React.ChildrenArray<React.Element<typeof ListGroupItem>>
};

export function ListGroup (props: ListGroupProps) {
  return <ul className='list-group'>{props.children}</ul>
}
```

## In the shallows, shallows...
`shallow` rendering is the right tool for all the testing the components above. Here's the reasons why:
  1. The components are just pure functions.
  1. Unit tests should be fast and `shallow` is faster than `mount` and `render`.
  1. Unit tests should be isolated. For `<ListGroupItem>` is easy because it's completely independent but `<ListGroup>` depends on `<ListGroupItem>` as defined by the `children` argument type. Using `mount`/`render` would render the `children` breaking the isolation.
  1. A `spy` or a `mock` is very common in situations like the above. `shalow` is a *mock renderer* so it serves our purposes.
  1. [Facebook recognizes the benefits of shallow rendering.](https://reactjs.org/docs/shallow-renderer.html)

Facebook's [`react-dom/test-utils`](https://reactjs.org/docs/test-utils.html) and [`react-test-renderer`](https://reactjs.org/docs/test-renderer.html) are testing libraries and Jest and [Enzyme use them](https://github.com/airbnb/enzyme/blob/master/packages/enzyme-adapter-react-16.3/src/ReactSixteenThreeAdapter.js#L7). Which means that all the render stack from our test environment is **mocked**. How much do you trust these 3rd-party libraries? I sure do a lot.

`shallow` is a powerful tool and you should read its manual and learn its best practices so you don't use indiscrimenaly. *Never* using it is a missed opportunity.

Phew! What a long post. Thanks for reading all the way here. I really appreciate it.

The series is not over though. The feature is far from completed and the "leaves" are not completed yet.
Stay tuned for the next post in the series.
Cheers!