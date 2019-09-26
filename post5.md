POST 5!

## Please, behave
From the feature specs we can observe some important information regarding interactions:
  1. list item selection is toggled when clicked.
  1. the list group works with single selection of list items.

The second point was not explicit from the specs (and it was intentional so that you could comment on it. Did you see it?) but we discovered it after some (imaginary) team discussion (backlog grooming, pre-iteration meeting, etc). Even though the team communicates and writes a lot in preparation for the implementation, many specs questions will rise when the code gets written specially in the early stages of development. As the team knowledge of the product/feature and technical details grows, they can foresee more cases and make sure the specs are not missing anything critical. Effective communication is key!

With that in the clear, it's time to start coding the main funcionality of the feature/app. We're going to follow the [Container component pattern](https://reactpatterns.com/#container-component) for separating state management from the rendering/behavior. Let's start with the 

Just to shorten up a bit this post, here's the whole component's test without its implementation. By reading it, you were supposed to understand what's the puropose/responsability of the component:

```
describe("<RepositoryIssuesBrowser />", () => {
  it("shows a list of repository names", () => {});

  it("shows a summary of all open issues", () => {});

  describe("and there are open issues in a repo", () => {
    it("shows the count of opened issues next to the repo name", () => {});
  });

  describe('and when a repo is clicked', () => {

    describe('and it is NOT selected', () => {
      it('selects the clicked item', () => {});

      it('deselects any other selected item - single selection', () => {});
    });

    describe('and it IS selected', () => {
      it('deselects the clicked item', () => {});
    });
  });

  describe('when a repository with open issues is selected', () => {
    it('shows its list of issues', () => {});
  });
});
```

Now it's the tricky part: *implement the tests in a way that it's not coupled with the component's implementation.* This is important because we want to be able to refactor our code in ways that better suit the implementation needs *without* having to modify any of its tests. Attention: if the public API changes, that's not a refactor! Code refactoring is the process of restructuring existing computer code without changing its external behavior.

You may ask yourself, "What's knowing implementation details?" If the test code looks for an internal `id` or CSS `class`, is it too much? How about looking for dependent component? Maybe a function from a 3rd party library? If the test knows one private implementation detail, does it mean that it can use any other private implementation detail as well? To be honest, I don't have a definitive answer for this dilema. There are as many answers as there are development teams out there.

This is just my take. We want to test the *functionality* of `<RepositoryIssuesBrowser />` component. We also know that it must render according to Bootstrap's style so it will use `<ListGroup>` and `<ListGroupItem>` since they already implement/abstract the HTML details. So we must verify/test that the container component uses the render components correctly to represent its internal state and changes based on user's input. Considering this, it's OK for the test to know some implementation details (`<ListGroup>` and `<ListGroupItem >`) to figure out if it's being used correctly.

Let's do a quick thought exercise. Imagine that we didn't want to know the rendering details above. Instead, we could look for text labels that we already know in the context of the test and it would be able to implement a few tests but we would run into trouble when tackling an important one: item selection. Since there's no native HTML attribute for `<li>` tags that represents selection or active, we would need to rely on the `active` CSS class set by the render component. I believe that relying in that kind of detail is worse since *it's not a detail of the component under tests*. But if it wasn't, then it would be fair.

Here's a test implementation that follows our guidelines. **Red:**

```
describe("<RepositoryIssuesBrowser />", () => {
  describe("when repository data is available", () => {
    it("shows a list of repository names", () => {
      const repos: Repository[] = [{ name: "Repo 1" }, { name: "Repo 2" }];
      const wrapper = shallow(<RepositoryIssuesBrowser repositories={repos} />);

      expect(wrapper.find(ListGroupItem).first().props().children).toEqual("Repo 1");
      expect(wrapper.find(ListGroupItem).last().props().children).toEqual("Repo 2");
    });
  });
});
```

// TODO: Write about advantages of using shallow and checking for props! Write example of using mount and checking for HTML. Raise the questions which one they preffer.

We have to use `mount` because we don't know yet how the component is implemented so the string we're looking for might be somewhere down the render tree.
Let's also practice the theory we have learned so far, starting with rule #1: *You are not allowed to write any production code unless it is to make a failing unit test pass.*
The minimal implementation to make it *green*:

```
// src/components/repositoryIssuesBrowser.js
// @flow

export default function RepositoryIssuesBrowser({ repositories: any } : any) {
  return (
    <div>
      <div>Repo 1</div>
      <div>Repo 2</div>
    </div>
  )
};
```
It seems a bit dumb, right? But this is only the beginning a cool TDD cycle. Rule #2 states: *You are not allowed to write any more of a unit test than is sufficient to fail; and compilation failures are failures.* so we can re-write the tests in a more clever way that forces the correct usage of the given repositories props. **Red:**

```
type Repository = {
  name: string
};

/**
  * @returns a `Repository[]` with random length between 1 and 9.
  */
function getRandomRepos() : Repository[] {
  const rand = Math.max(1, Math.floor(Math.random() * 10));
  return return Array(rand).fill(rand).map((v:number, i:number) => ({ name: `Repo${v} - ${i}` }));
}

it("shows a list of repository names", () => {
  const repos:Repository[] = getRandomRepos();
  const wrapper = mount(<RepositoryIssuesBrowser repositories={repos} />);

  repos.forEach( (repo:Repository) => {
    expect(findByText(repo.name, wrapper)).toExist();
  });
});
```

Now, the easiest implementation is the correct one. **Green:**

```
// Moved the Repository type definition to where it belongs and make it public (export).
export type Repository = {
  name: string
};

type RepositoryIssuesBrowserProps = {
  repositories: Repository[]
};

export default function RepositoryIssuesBrowser({ repositories }: RepositoryIssuesBrowserProps) {
  return (
    <div>
      {
        repositories.map((repo, idx) => <div key={idx}>{repo.name}</div>)
      }
    </div>
  )
};
```

Before we move any further with the tests, let's check our progress in the browser with a new story:

```
// src/stories/index.js
import RepositoryIssuesBrowser from "../components/repositoryIssuesBrowser";

storiesOf("RepositoryIssuesBrowser", module)
  .add("with repositories", () => {
    const repos = [{ name: "Repo 1" }, { name: "Repo 2" }];
    return <RepositoryIssuesBrowser repositories={repos} />;
  });
```

Now you should be seeing something 
















Here's an example of a perfectly valid test case which's implementation is coupled with the components private parts:

```
it("shows a list of repository names", () => {
  const repos: Repository[] = [{ name: "Repo 1" }, { name: "Repo 2" }];
  const wrapper = mount(<RepositoryIssuesBrowser repositories={repos} />);

  // Uh oh! How do I know <ListGroupItem> internally by <RepositoryIssuesBrowser>?!
  const item1 = wrapper.find('ListGroupItem').first();
  expect(item1).toHaveText("Repo 1");

  // What happens if <RepositoryIssuesBrowser> is refactored and stops using <ListGroupItem>?
  const item2 = wrapper.find('ListGroupItem').last();
  expect(item2).toHaveText("Repo 2");
});
```

The code comments above says it all: knowing that `<RepositoryIssuesBrowser>` uses `<ListGroupItem>` internally is a violation the Black-box testing. Writting tests like this is also testing its implementation details. Tests should not care about implementation details. The list of repository names should be rendered and the tests doesn't care how! 
