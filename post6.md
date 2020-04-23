# Thread safely in the shallows

Hello once again! Today I'll share some more insights regarding Enzyme's `shallow` rendering.
It's a great tool for isolating and controling the rendering of components in unit tests. Imagine an `<App>` component that uses many other children components that also have many other children:
```
import { Router, Route } from "router"
import { useFeed } from "./hooks"
import { Navbar, Spinner, FeedHighlights, HomePage, ProfilePage, Footer } from "./components"

const App = ({userData}) => (
  const [isLoadingFeed, feed] = useFeed(userData.id)
  <Navbar />
  { isLoadingFeed ? <Spinner small /> : <FeedHighlights feed={feed} /> }
  <Router>
    <Route path="/">
      { isLoadingFeed ? <Spinner /> : <HomePage feed={feed} /> }
    </Route>
    <Route path="/me">
      <ProfilePage user={userData} />
    </Route>
  </Router>
  <Footer />
)

export default App
```

How can you isolate and test only the component's funcionality? If you use `mount(<App userData={mockUserData} />)`, the whole component tree is rendered, including the whole component's lyfecycle, so a lot of code not part of the component under test will run. There's a good chance that a bug or a change in one of these dependencies would also break the unit tests of `<App>`. The component itself does not do much but it integrates many other parts so good luck trying to mock everthing that lies beneath and maintain this monster test.

The usual solution for this problem is to apply [Inversion of Control and Dependency Injection](https://stackoverflow.com/questions/3058/what-is-inversion-of-control). Here's how we could re-write `App` using IoC and DI principles:

```
const App = ({userData, useFeed, Navbar, Spinner, FeedHighlights, HomePage, ProfilePage, Footer, Router, Route}) => (
  const [isLoadingFeed, feed] = useFeed(userData.id)
  <Navbar />
  { isLoadingFeed ? <Spinner small /> : <FeedHighlights feed={feed} /> }
  <Router>
    <Route path="/">
      { isLoadingFeed ? <Spinner /> : <HomePage feed={feed} /> }
    </Route>
    <Route path="/me">
      <ProfilePage user={userData} />
    </Route>
  </Router>
  <Footer />
)

export default App
```

So in `App` tests we would need to do something like this:

```
const MockComponent = {children, ...props} => <div {...props}>{children}</div>
const mockUseFeed = useMockHook()

const wrapper = mount(
  <App
    userData={mockUserData}
    useFeed={mockUseFeed}
    Navbar={MockComponent}
    Spinner={MockComponent}
    FeedHighlights={MockComponent}
    HomePage={MockComponent}
    ProfilePage={MockComponent}
    Footer={MockComponent}
    Router={MockComponent}
    Route={MockComponent}
  />
);
// asserts and expectations ...
```

As you can see it's already horrible and now consider adding the proper *interface* and *primitive* type for each prop! It's doable but completely nuts. Not worth demonstrating it.
Since IoC and DI do not work really well in these scenarios, `shallow(<App userData={mockUserData} />)` comes in to save the day! We can keep the initial implementation and still test `App`'s functionality in isolation. Have your cake and eat it!

## The danger lurking in the shallows
Here comes the biggest limitation of `shallow`: your tests can become really attached to implementation details and fragile to harmless refactors. See this implementation of a `<ListGroupItem>` functional component that has no external dependencies to render HTML elements:

```
const ListGroupItem = ({children, onClick}) => {
  if(isFunction(onClick)) {
    return (
      <button onClick={onClick} className="list-button">{children}</button>
    )
  } else {
    return (
      <li className="list-item"><span>{children}</span></li>
    )
  }
)

export default ListGroupItem
```

It's tests could be something like this:
```
let wrapper = shallow(<ListGroupItem>item</ListGroupItem>);
expect(wrapper).toContainExactlyOneMatchingElement("li.list-item");
expect(wrapper).toHaveText("item");

wrapper = shallow(<ListGroupItem onClick={() => {}>clickable item</ListGroupItem>);
expect(wrapper).toContainExactlyOneMatchingElement("button.list-button");
expect(wrapper).toHaveText("clickable item");
```

The tests are all passing so you go and refactor the component's code so that it's a bit easier to read:

```
const ListButton = ({children, onClick}) => <button onClick={onClick} className="list-button">{children}</button>

const ListItem = ({children}) => <li className="list-item"><span>{children}</span></li>

const ListGroupItem = (props) => (
  {
    isFunction(props.onClick)
    ? <ListButton {...props} />
    : <ListItem {...props} />
  }
)

export default ListGroupItem
```

Now your tests fail and you curse because it shouldn't have since you only changed the component's internals. `shallow` is being way too restrictive now. In this case, the right tool for the job is actually `render` or `mount` since the whole component tree is internal to the subject under test. Cool, the tests are passing again but you decide to use the existing external `Button` component because it has everything you need so no need to repeat yourself:

```
import Button from "./Button"

const ListItem = ({children}) => <li className="list-item"><span>{children}</span></li>

const ListGroupItem = (props) => (
  {
    isFunction(props.onClick)
    ? <Button className="list-button" onClick={props.onClick}>{children}</Button>
    : <ListItem {...props} />
  }
)

export default ListGroupItem
```

Now what!? To test the code in isolation you use `shallow` and then verify that `Button` was used with the correct props but in order to verify that the `<li>` was rendered correctly, you have to [dive in the rendering](https://enzymejs.github.io/enzyme/docs/api/ShallowWrapper/dive.html):

```
expect(wrapper.find("ListItem").dive()).toContainExactlyOneMatchingElement("li.list-item");
```

Ok, it works but it doesn't scale well because if the component structure changes, not its rendered elements, the tests would have to dive accordingly. There's a small *sneaky* trick that we can do that would solve the diving issue and still use `shallow`: use the internal component in an *imperative* manner.

```
const ListGroupItem = (props) => (
  {
    isFunction(props.onClick)
    ? <Button className="list-button" onClick={props.onClick}>{children}</Button>
    : ListItem(props)
  }
)
```

That's the beauty of functional components: they are just functions! You can skip declarative programing with JSX and it just works. Now you don't need any `dive` calls in the te- sts since there's effectively no more extra components. Have another cake and eat it too!

## Conclusion
Enzyme's is a like a *power tool* for testing React applications. If used correctly, it can make you very effective and productive. If used carrelessly, you can loose a finger.
- Use `shallow` to limit the rendering of components with many external dependencies so you can test the propper code in isolation.
- Inversion of Control and Dependency Injection principles don't fit very well in React.
- Use `render` or `mount` to test components that don't depend on other external components.
- Avoid render `dive` because it ties the tests to the internal implementation of the component.
- Be sneaky when you can: declarative JSX is cool but optional. Use components in imperative fashion to save some headaches.

I hope this helps. Cheers!