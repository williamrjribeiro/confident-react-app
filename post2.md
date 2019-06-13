This is the second post on the series about Confident React App where I show how I build up the confidence in the source code of my React apps. Please read the [first post](list to first post) if not yet.

## The feature
Our customers would like to quickly see the issues reported in our enterprise open-source software so our task is to create a small integration with Github so that they can find the necessary information without switching apps.

Here's the acceptance criteria that our team wrote with the help of the Project Owner:
```
When the user is in the Repos screen
  it must show a loading indicator while Repos data is being fetched
  and Repos data is available
    it must show a list of repos
    it must show a summary of all open issues
    and there are open issues in a repo
      it must show the count of opened issues of a repo next to the repo name
    when a repo is clicked
      and its NOT selected
        it selects the clicked item
        and there ARE open repo issues
          it replaces the summary with the list of open repo issues
        and there ARE NOT open repo issues
          it shows a message saying that there are no open issues for the repo
      and it IS selected
        it deselects the clicked item
        it replaces the list of open repo issues with the summary
```

 Our designers opted for using [Twitter Bootstrap](https://getbootstrap.com/docs/4.3/getting-started/introduction/) as the base of the app UI and for this feature we'll need the [List Group component](https://getbootstrap.com/docs/4.3/components/list-group/). The Bootstrap component documentation is the specs for its React implementation.

That's a great work done by the development team: the specs are clear, it has behavior, some loading states and interactions. [80% of all software bugs are related to bad interpretation/understanding of the requirements/documentation](REF TO ERIC ELIOT POST ABOUT TYPESCRIPT). Take a moment to let that sink in... That's incredible!

Basically, the quality of your team's documentation and communication skills is by far the best investment you can do in order to reduce bugs in any application. Tools for communication like Slack, whiteboards, Jira, Post-its, Sharpies, company phones, video conference rooms and etc is just the tip of the iceberg. The trickiest part is creating and fostering the culture of safe and productive communication. Where people are motivated and rewarded for sharing their knowledge, teaching other people, learning the jargon and nuances of the multitude of professional disciplines or keeping an organized knowledge base. Even improving the English/foreign language communication skills of a single person can have a better impact than most of other stuff that I write here. Good communication is key. 80% of it all.

So go back and read the requirements and the acceptance criteria for the feature. Try to imagine more use case scenarios or edge cases. I left an important scenario out just so you can exercise it yourself. ;-)

Don't worry, we're very close to start coding, I promise. Just a quick intro to good Test Driven Development.
