POST 6!
```
// src/components/repositoryIssuesBrowser.spec.js
// @flow

type Repository = {
  name: string
};

describe("<RepositoryIssuesBrowser />", () => {
  describe("when repository data is available", () => {
    it("shows a list of repository names", () => {
      const repos: Repository[] = [{ name: "Repo 1" }, { name: "Repo 2" }];
      const wrapper = mount(<RepositoryIssuesBrowser repositories={repos} />);
      const listGroup = wrapper.find(ListGroup)
      const items = listGroup.find(ListGroupItem);
      
      expect(listGroup).toExist();
      expect(items.length).toEqual(repos.length)
      expect(items.first()).toHaveText("Repo 1");
      expect(items.last()).toHaveText("Repo 2");
    });
  });
});
```

Let's also practice the theory we have learned so far, starting with rule #1: *You are not allowed to write any production code unless it is to make a failing unit test pass.*
The minimal implementation to make it *green*:

```
// src/components/repositoryIssuesBrowser.js
// @flow

export default function RepositoryIssuesBrowser({ repositories: Repository[] } : any) {
  return (
    <ListGroup>
      <ListGroupItem>Repo 1</ListGroupItem>
      <ListGroupItem>Repo 2</ListGroupItem>
    </ListGroup>
  )
};
```

It seems a bit dumb, right? But this is only the beginning a cool TDD cycle. Rule #2 states: *You are not allowed to write any more of a unit test than is sufficient to fail; and compilation failures are failures.* so we can re-write the tests in a more clever way that forces the correct usage of the given component props. **Red:**

```
// src/components/repositoryIssuesBrowser.spec.js

/**
  * @returns a `Repository[]` with random length between 1 and 9.
  */
function getRandomRepos() : Repository[] {
  const rand = Math.max(1, Math.floor(Math.random() * 10));
  return return Array(rand).fill(rand).map((v:number, i:number) => ({ name: `Repo${v} - ${i}` }));
}

it("shows a list of repository names", () => {
  const repos: Repository[] = getRandomRepos();
  const wrapper = shallow(<RepositoryIssuesBrowser repositories={repos} />);
  const listGroup = wrapper.find(ListGroup)
  const items = listGroup.find(ListGroupItem);
  
  expect(listGroup).toExist();
  expect(items.length).toEqual(repos.length)

  repos.forEach((repo: Repository, index: number) => {
    expect(items.at(index).prop("children")).toEqual(repo.name);
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
    <ListGroup>
      {
        repositories.map((repo, idx) => <ListGroupItem key={idx}>{repo.name}</ListGroupItem>)
      }
    </ListGroup>
  )
};
```

Before we move any further with the tests, let's check our progress in the browser with a new story:

```
// src/stories/index.js
import RepositoryIssuesBrowser from "../components/repositoryIssuesBrowser";

storiesOf("RepositoryIssuesBrowser", module)
  .add("with repositories", () => {
    const repos: Repository[] = [{ name: "Repo 1" }, { name: "Repo 2" }];
    return <RepositoryIssuesBrowser repositories={repos} />;
  });
```

Now you should be seeing a correctly rendered list of repository names, just like in the "List group with items" story. We're giving confident baby-steps.

