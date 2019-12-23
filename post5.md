POST 5!

Here we go again! The "Confident React App" series of posts is finally back after a long period away.
You can follow from the start [here](http://williamrjribeiro.com/?p=163).

From the feature specs - defined in the 1st post of the series - we can observe some important information regarding interactions:
  1. list item selection is toggled when clicked.
  1. the list group works with single selection of list items.

The second point was not explicit from the specs (and it was intentional so that you could comment on it. Did you see it?) but we discovered it after some (imaginary) team discussion (backlog grooming, pre-iteration meeting, etc). Even though the team communicates and writes a lot in preparation for the implementation, many questions rise when the code gets written specially in the early stages of development. As the team knowledge of the product/feature and technical details grows, they can foresee more cases and make sure the specs are not missing anything critical. Effective communication is key!

With that in the clear, it's time to start coding the user interactaction of our app. We're going to follow the [Container component pattern](https://reactpatterns.com/#container-component) for separating state management from the rendering/behavior.

## Please, behave
We're introducing a new component which whole's responsability is to handle interactinons and state: `<SingleSelectionListGroup>`.

Just to shorten up a bit this post, here's the whole component's test without its implementation. By reading it, you were supposed to understand what's the puropose/responsability of the component:

```
describe("<SingleSelectionListGroup />", () => {
  it('renders according to specification', () => {});

  describe('and when an item is clicked', () => {

    describe('and it is NOT selected', () => {
      it('selects the clicked item', () => {});

      it('deselects any other selected item - single selection', () => {});
    });

    describe('and it IS selected', () => {
      it('deselects the clicked item', () => {});
    });

    it('calls the given onChange callback with the current selected index and value', () => {});
  });
});
```

Now it's the tricky part: *implement the tests in a way that it's not coupled with the component's implementation.* This is important because we want to be able to refactor our code in ways that better suit the implementation needs *without* having to modify any of its tests. Attention: if the public API changes, that's not a refactor! Code refactoring is the process of restructuring existing computer code without changing its external behavior.

You may ask yourself, "What **is** knowing implementation details?". If the test code looks for an internal `id` or CSS `class`, is it implementation detail? How about looking for dependent component? Maybe a function from a 3rd party library? If the test knows one private implementation detail, does it mean that it can use any other private implementation detail as well? To be honest, I don't have a definitive answer for this dilema. There are as many answers as there are development teams out there. Mine is as follows.

We want to test the functionality of `<SingleSelectionListGroup>` component and we know that it must render according to Bootstrap's style so it must use `<ListGroup>` and `<ListGroupItem>` since they already implement/abstract the HTML details. So we must verify/test that the container component uses the render components correctly to represent its internal state and changes based on user's input. Considering this, it's OK for the test to know some implementation details: (`<ListGroup>` and `<ListGroupItem>`).

Let's do a quick thought exercise. Imagine that we didn't want to know the rendering details above. Instead, we would look for text labels that we already know in the context of the test. We would be able to implement a few tests but one of the most important use cases would be impossible to test: item selection. Since there's no native HTML attribute for `<li>` tags for representing selection, we would need to rely on the `active` CSS class used by the render component. I believe this would be a worse approach since it's not a detail of the component under tests. All of the rendering details have been tested in `<ListGroupItem>` unit tests already.

To me, the approach that gives the most confidence is testing that `<SingleSelectionListGroup>` uses `<ListGroup>` and `<ListGroupItem>` correctly, passing the right props. Yes, the test will know some implementation details but it won't know the details of its internal components. This approach also protects `<SingleSelectionListGroup>`'s tests from any changes internal to `<ListGroup>` and `<ListGroupItem>`.

More on this topic later. Here's a test implementation that follows our guidelines. **Red:**
```
// src/components/listGroup.spec.js
// @flow

describe("<SingleSelectionListGroup />", () => {
  it("renders according to specification", () => {
    const wrapper = shallow(
      <SingleSelectionListGroup>
        <ListGroupItem>Item 1</ListGroupItem>
        <ListGroupItem>Item 2</ListGroupItem>
      </SingleSelectionListGroup>
    );

    const listGroup = wrapper.find(ListGroup);
    expect(listGroup).toExist();
    expect(listGroup.find(ListGroupItem)).toHaveLength(2)
  });

  describe("and when an item is clicked", () => {
    describe("and it is NOT selected", () => {
      it("selects the clicked item", () => {
        const wrapper = shallow(
          <SingleSelectionListGroup>
            <ListGroupItem>Item 1</ListGroupItem>
            <ListGroupItem>Item 2</ListGroupItem>
          </SingleSelectionListGroup>
        );

        wrapper.find(ListGroupItem).first().simulate("click");

        expect(
          wrapper.find(ListGroupItem).first()
        ).toHaveProp("active", true);
      });

      it("deselects any other selected item - single selection", () => {
        const wrapper = shallow(
          <SingleSelectionListGroup>
            <ListGroupItem active>Item 1</ListGroupItem>
            <ListGroupItem>Item 2</ListGroupItem>
          </SingleSelectionListGroup>
        );

        expect(
          wrapper.find(ListGroupItem).first()
        ).toHaveProp("active", true);

        wrapper.find(ListGroupItem).last().simulate("click");

        expect(
          wrapper.find(ListGroupItem).first()
        ).toHaveProp("active", false);

        expect(
          wrapper.find(ListGroupItem).last()
        ).toHaveProp("active", true);
      });
    });

    describe("and it IS selected", () => {
      it("deselects the clicked item", () => {
        const wrapper = shallow(
          <SingleSelectionListGroup>
            <ListGroupItem>Item 1</ListGroupItem>
            <ListGroupItem active>Item 2</ListGroupItem>
          </SingleSelectionListGroup>
        );

        expect(
          wrapper.find(ListGroupItem).last()
        ).toHaveProp("active", true);

        wrapper.find(ListGroupItem).last().simulate("click");

        expect(
          wrapper.find(ListGroupItem).last()
        ).toHaveProp("active", false);

        expect(
          wrapper.find(ListGroupItem).first()
        ).toHaveProp("active", false);
      });
    });

    it("calls the given onChange callback with the current selected index and value", () => {
      const changeSpy = jest.fn();
      const wrapper = shallow(
        <SingleSelectionListGroup onChange={changeSpy}>
          <ListGroupItem>Item 1</ListGroupItem>
          <ListGroupItem>Item 2</ListGroupItem>
        </SingleSelectionListGroup>
      );

      wrapper.find(ListGroupItem).first().simulate("click");

      expect(changeSpy).toHaveBeenCalledWith({
        index: 0,
        value: "Item 1",
      });

      wrapper.find(ListGroupItem).first().simulate("click");

      expect(changeSpy).toHaveBeenCalledWith({
        index: -1,
        value: null,
      });
    });
  });
});
```

Notice how the test above never looks for HTML specific details like tags or CSS classes. Those details are for the render components. The new tests only care about what the component really is supposed to do: handle selection, user interactions and use the propper render components correctly.

Now go ahead and make all tests turn **green**. It's a pretty cool challenge. You can check my solution on Github. Don't forget to add a new story with the new component to see it in action.

This is it for today's entry! I hope the confidence in your code is has increased a little bit more with my explanations.
