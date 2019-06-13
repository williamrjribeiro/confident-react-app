#NOTES

Kent C. Dodds has written one of the coolest pieces about [software testing](https://kentcdodds.com/blog/unit-vs-integration-vs-e2e-tests) that I've read recently. It's a great overview on the most common types of testing. The "**CONFIDENCE** you must have in the code you deliver" is an original light that he shines on the topic. Before you continue reading this, go read his article first. It's well worth it!

OK, do you feel inspired too? Then let me explain and show you how I make my React codebases reliable and my confidence levels pretty high.

First step is to create our React app. I'll use [Create React App (CRA)](https://facebook.github.io/create-react-app/) since it's super simple and still very popular.

`npx create-react-app confident-react-app`

Let's start by fulfilling the base of Kent's *Testing Trophy* requirements. For that we use a bunch of tools that will save us from most of trivial JS mistakes.

## ESlint
CRA uses [ESLint](https://eslint.org/) by default which is great. From ESLint's website: *"JavaScript, being a dynamic and loosely-typed language, is especially prone to developer error. Without the benefit of a compilation process, JavaScript code is typically executed in order to find syntax or other errors. Linting tools like ESLint allow developers to discover problems with their JavaScript code without executing it."* And here's the exact [ESLint configuration](https://www.npmjs.com/package/eslint-config-react-app) used by CRA. You can see that the configuration also applies [accessibility linting rules](https://github.com/evcohen/eslint-plugin-jsx-a11y) which is a really nice bonus. It helps us create code that respects some of the impaired internet users.

## Static type checking with Flow
JS is a dynamic language and experienced developers can really take advantage of dynamic types and objects. But even experienced developers make silly mistakes, work with other less experienced devs and most of a JS codebase relies on static types anyway. So a codebase that uses a strong type system can benefit from detecting type error mistakes quite early. Facebook created and uses [Flow](https://flow.org/), a static type checker for javascript.

OK, Flow [*is intrusive*](https://flow.org/en/docs/types/). In order to benefit from it, your code will look quite similar to `TypeScript`. To be honest, if you're doing a small library/app and even working with other developers with limited experience, adopting Flow/TypeScript will probably *not* be worth it due to the added entropy. It's a part of the nature of being a JS developer, you get burned many times until you finally learn and embrace. I personally got so used to it that most of the times I find super annoying to write so much type boilerplate.

For this post's effect, lets assume we're building an enterprise multi-national application in a team with dozens of developers spread across the globe. We'll take Flow to the next level by using it in [strict mode](https://flow.org/en/docs/strict/). From now on, every JS file must have `// @flow` in its first line, even tests.

`yarn add flow-bin && yarn flow init`

If you run the `flow` command it should report errors on the tests since it doesn't recognize Jest's global functions - `it`, `describe`, etc. To fix this you must inform [Flow that Jest is a library](https://flow.org/en/docs/libdefs/) with all its interface definitions. Thankfully there's [`flow-typed`](https://github.com/flow-typed/flow-typed) which is a tool for installing community-supported library interface definitions.

`yarn add -D flow-typed && yarn run flow-typed install jest@23.6.0`

Unfortunately these tools do not run by default with CRA's own scripts. Let's validate our code for every action, so this how we setup the scripts in our `package.json`:

```
"scripts": {
    "start": "yarn validate && react-scripts start",
    "build": "yarn validate && react-scripts build",
    "test": "yarn validate && react-scripts test",
    "validate": "yarn lint && yarn flow",
    "lint": "eslint src/**/*.js",
    "flow": "flow",
    "flow-typed": "flow-typed"
  },
```

Phew! A lot of setup and we haven't written any line of code yet. Before we jump to it, let's talk about what we're building.

## The feature
Our customers would like to quickly see the issues reported in our enterprise open-source software so our task is to create a small integration with Github to allow our customers to quickly find the necessary information without switching apps. Our designers opted for using [Twitter Bootstrap](https://getbootstrap.com/docs/4.3/getting-started/introduction/) as the base of the app UI and for this feature we'll use the [List Group component](https://getbootstrap.com/docs/4.3/components/list-group/).
Here's the acceptance criteria that our team wrote with the help of the Project Owner:
```
When the user is in the Issues screen
  it must show a loading indicator while issue data is being fetched
  and issue data is available
    it must show a list of repos
    it must show a summary of all open issues
    and there are open issues in a repo
      it must show the count of opened issues of a repo
    when a repo is clicked
      and its NOT selected
        it selects the clicked item
        it replaces the summary with the list of open repo issues
      and it IS selected
        it deselects the clicked item
        it replaces the list of open repo issues with the summary
```
That's a great work done by the development team: the specs are clear, it has behavior, some loading states and interactions. But we're not ready to code just yet.

## BDD + TDD
I don't need to explain you why testing your code is imporant, right? Good tests are key for having a high level of confidence in your code but that's much easier said than done, [specially in React apps](https://kentcdodds.com/blog/testing-implementation-details).

I've been referencing Kent's posts because I really like his point of view, his writting and explanations. But I also have my own opinions based on my own experiences. It's a nuanced difference in a few specific points and it comes with its own trade-offs. I'll explain them as they appear.

I always follow the [Test-Driven Development](https://books.google.de/books/about/Test_driven_Development.html?id=CUlsAQAAQBAJ) process and adher to ["The Three Laws of TDD"](https://www.youtube.com/watch?v=qkblc5WRn-U):
  - You are not allowed to write any production code unless it is to make a failing unit test pass.
  - You are not allowed to write any more of a unit test than is sufficient to fail; and compilation failures are failures.
  - You are not allowed to write any more production code than is sufficient to pass the one failing unit test.

TDD is really cool and effective but it's easily misused which causes some [resentment](https://softwareengineering.stackexchange.com/questions/98485/tdd-negative-experience). The most common issue I observe is test code that is too coupled with implementation details. Of course changing the public API in a refactor will require changing the test code, but changing private functionality/implementation should result in only minimal changes, ideally none at all, in the tests. Not as easy as it sounds. I suspect that this happens because of the mindset the developer is in when doing tests first: you get frammed on testing everything! 100% test coverage is counter productive because [not every part of you code is equally worth the test hassle](https://dev.to/danlebrero/the-tragedy-of-100-code-coverage) and an [illusion](https://www.javaworld.com/article/2071941/the-fallacy-of-100--code-coverage.html).

The [Behavior Driven Development](https://blog.testlodge.com/what-is-bdd/) mindset is much more powerful: it builds on top of TDD focusing on the `what`, not the `how`. And our acceptance criteria is already written in BDD style, so the devs - we - have a perfect guide.

With all this in mind, time to get coding! Specs first.

## <ListGroup>
I like to start from the bottom, the leaves. They are simple, straight forward and once we move up the tree, the bottom is ready to be used. So we create the two files and fire up the tests:

`mkdir src/components && touch src/components/listGroup.js && touch src/components/listGroup.spec.js`

Don't forget to add `// @flow`. ;-)

I've picked Airbnb's [Enzyme](https://airbnb.io/enzyme/) test renderer out of many available because it has the necessary funcionality for writing the kind of tests I preffer the most. Notably, Kent doesn't like it and he has [his reasons](https://blog.kentcdodds.com/why-i-never-use-shallow-rendering-c08851a68bb7). All good, but I'll explain why I still use `shallow`. To add the tools we need:

`yarn add -D enzyme enzyme-adapter-react-16 jest-enzyme && yarn flow-typed install enzyme@3`

And the `setupTests.js` file:
```
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-enzyme';

configure({ adapter: new Adapter() });
```

- component for managing selection state: single & multiple with render props.
- Implement List Group component from Twitter's Bootstrap: https://getbootstrap.com/docs/4.3/components/list-group/
- Why testing the component render is important: a lot of CSS relies on classes and native tags. Since your markup is tighly coupled with the CSS, it might as well be tested








==========================================================================================================================================
In my new job in VW's SDC:LX we do software development in a very peculiar way. Among other quirks we do Pair Programming, Test-driven development (TDD) and every commit that passes our strict pipeline goes live to production. This is completely new to me but it really captivated my mind and is conquering my heart as well. And like any other new thing, it's a bit strange and scary in the beginning. Today I'll focus on TDD and some of the challenges I faced when trying to make a React app.

I've studied and practiced it in college many years ago but this is the first time I work in a company that *actually* does it. The jist of TDD is: a development method that utilizes repetition of a short development cycle (red-green-refactor) for designing and implementing high quality software. The cycle is roughtly: write tests that fail (red). Write code that passes the test (green). Refactor. Repeat.

Sounds cool, right? Because it is but it's much easier said than done. There are [so many ways](https://softwareengineering.stackexchange.com/questions/98485/tdd-negative-experience) that TDD can be done incorrectly that it even becomes damaging. The method has many nuances that is hard to miss when translated to code. It takes some hands-on experience and guidance to master it. Thankfully, there's a lot of great material out there *specially* from [Kent Beck](https://www.kentbeck.com/), [Martin Fowler](https://martinfowler.com/articles/is-tdd-dead/) and [Uncle Bob](https://blog.cleancoder.com/).

Very recently, while reading some texts about [testing React apps by the amazing Kent C. Dodds](https://kentcdodds.com/blog/unit-vs-integration-vs-e2e-tests), I realized that TDD is another way/tool for improving the **CONFIDENCE** you have in the code you deliver. If it's not, then you must stop, take a step back and try to find the reason why and, if not enough, go back even further to the source materials from the gentlemen mentioned in the paragraph above.

- initial commit: Use CRA (cleanup) + Enzyme

`yarn add -D enzyme enzyme-adapter-react-16`

`yarn add -D @types/enzyme @types/react`