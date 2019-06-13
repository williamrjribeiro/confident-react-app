Welcome again to the continuation of the Confident React App blog post series. We've covered some considerable ground
so take your time reading the series from the [beginning](http://williamrjribeiro.com/?p=163).

In this post we'll add a tool to our arsenal for quickly testing our components in the browser.

## Telling component stories
We already applied some important tools and techniques to our code base to increase our confidence:
 - automated tests
 - static type checking
 - Behavior Driven Development

But can you spot a what's missing so far? Well, it's the application running in a browser, just like the end user will. A dummy app for testing the components would be fairly easy create but there a few downsides for this approach:
  - The real app depends on external APIs/resources so its slower.
  - It could be impossible to test some components due to unavailability of the external APIs/resources.
  - App code is more complex since it integrates many parts which makes it hard to verify components in isolation.
  - Apps can have many complex states which makes it hard to verify all use cases, specially error states.

A common way to avoid the pitfalls above is to create a separate app for the purpose of showcasing components and app states in a more structured and isolated way. Enter [Storybook](https://storybook.js.org/docs/basics/introduction/): it's the tool of choice for the question at hand. Let's add it to our project:

```
npx -p @storybook/cli sb init
yarn flow-typed install @storybook/react@5 @storybook/addon-actions@3
```

If everything goes well after the long install, there will be a bunch of new files in our project. Storybook is also already running with some demo content. I recommend reading [Storybook's documentation](https://storybook.js.org/docs/basics/writing-stories/) for more details. Let's write our first story.

Edit the file `src/stories/index.js` and add the following code:

```
// @flow
import React from 'react';
import { storiesOf } from '@storybook/react';
import { ListGroup, ListGroupItem } from '../components/listGroup';

storiesOf('ListGroup', module)
  .add('with items', () => (
    <ListGroup>
      <ListGroupItem>item 1</ListGroupItem>
      <ListGroupItem>item 2</ListGroupItem>
    </ListGroup>
  ))
```

Now if you go to [http://localhost:9009/?path=/story/listgroup--with-items](http://localhost:9009/?path=/story/listgroup--with-items) you can actualy *see for the first time* the component! 

// PIC OF COMPONENT WITHOUT STYLES

... And it sucks. Even though the generated HTML is perfectly valid, it doesn't look at all to the Bootstrap version:

// PIC OF STYLED COMPONENT

This is *exactly why* we always need to test the application, or parts of it, in the browser. Even with all the tools and techniques added so far, we're still very far off from desired outcome.

## You gotta have style
We've been talking a lot about Bootstrap and even implemented some code that relies on it but we never added it as a dependency to our project.

There are many ways of fulfilling this step. For simplicity, we're adding Bootstrap as a runtime dependency so only its CSS is loaded to Storybook.

To do this, simply create a file called `preview-head.html` inside the Storybook config directory and add tags like this:
```
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
```

Bootstrap's CSS will be loaded from a CDN inside of Storybook. Just restart Storybook and profit!

# Improving the leaves
OK, we have very simple list of items but there still two important functionalitites missing:
  1. Active list items to represent a selection.
  1. Clickable items so that they can be selected/activated.

The components `<ListGroup>` and `<ListGroupItem>` should only deal with rendering and very basic interactions. The selection/activation logic will be handled by a different container component. With that in mind we start with a new **red** test:

```
// src/components/listGroup.spec.js

it('renders active when active prop is truthy', () => {
  const wrapper = shallow(<ListGroupItem active>item 1</ListGroupItem>);
  expect(wrapper).toContainExactlyOneMatchingElement('li.list-group-item.active');
})
```

And implement it to get a **green** test:

```
// src/components/listGroup.js

type ListGroupItemProps = {
  children: string,
  active?: boolean
};

export function ListGroupItem (props: ListGroupItemProps) {
  const classes = "list-group-item" + (props.active ? " active" : "")
  return <li className={classes}>{props.children}</li>;
}
```

Finally, a new story needs to be added so we can see the final result:

```
// src/stories/index.js

.add('with active items', () => (
  <ListGroup>
    <ListGroupItem active>item 1</ListGroupItem>
    <ListGroupItem active>item 2</ListGroupItem>
  </ListGroup>
))
```

For the clicking, the specification define two options: either an `<a>` or a `<button>`. Since we don't need page navigation, the `<button>` is the right choice. Also, whenever an item is clicked, it must execute the given callback if any. **Red** tests:

```
// src/components/listGroup.spec.js

describe('when onClick prop is defined', () => {
  it('renders as an action button', () => {
    const wrapper = shallow(<ListGroupItem onClick={() => {}}>item 1</ListGroupItem>);
    expect(wrapper).toContainExactlyOneMatchingElement('button[type="button"].list-group-item.list-group-item-action');
  });

  it('renders as an active action button when active prop is truthy', () => {
    const wrapper = shallow(<ListGroupItem active onClick={() => {}}>item 1</ListGroupItem>);
    expect(wrapper).toContainExactlyOneMatchingElement('button[type="button"].list-group-item.list-group-item-action.active');
  });

  it('calls the given callback when clicked', () => {
    const onClickSpy = jest.fn()
    const wrapper = shallow(<ListGroupItem onClick={onClickSpy}>item 1</ListGroupItem>);
    
    wrapper.simulate("click");

    expect(onClickSpy).toHaveBeenCalled();
  });
});
```

Which can easily be turned into **green** with:

```
// src/components/listGroup.js

type ListGroupItemProps = {
  children: string,
  active?: boolean,
  onClick?: Function
};

export function ListGroupItem (props: ListGroupItemProps) {
  let classes = "list-group-item" + (props.active ? " active" : "")

  if(props.onClick) {
    classes += " list-group-item-action";
    return (
      <button type="button" className={classes} onClick={props.onClick}>
        {props.children}
      </button>
    );
  } else {
    return <li className={classes}>{props.children}</li>;
  }
}
```

And finally verified in the browser with the story:

```
// src/stories/index.js

import { action } from '@storybook/addon-actions';

.add('with actionable items', () => (
  <ListGroup>
    <ListGroupItem active onClick={action("Item 1 clicked!")}>action item 1</ListGroupItem>
    <ListGroupItem onClick={action("Item 2 clicked!")}>action item 2</ListGroupItem>
  </ListGroup>
))
```

There you go: our React implementation of the Bootstrap's list group component is finally complete. *But what do we do with it*? There are many interaction/behavior options for this kind of components like selecting an item when it's clicked, multiple or single selection, deselecting...All these behaviors could either be implemented within the app’s core logic or segregated to more reusable components.

In the next post, we'll implement the behavior and do a deeper discussion on how to test components in a way that makes us confident.