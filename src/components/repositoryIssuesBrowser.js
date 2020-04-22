// @flow
import * as React from "react";
import { ListGroup, ListGroupItem } from "./listGroup";

export type Issue = {
  title: string,
  isOpen: boolean,
};

export type Repository = {
  name: string,
  issues?: Issue[],
};

type RepositoryIssuesBrowserState = {
  selectedIndex: number
}

type RepositoryIssuesBrowserProps = {
  loading?: boolean,
  repositories?: Repository[],
};

const openIssueFilter = (issue: Issue) => issue.isOpen

export default class RepositoryIssuesBrowser extends React.Component<RepositoryIssuesBrowserProps, RepositoryIssuesBrowserState> {
  state = {
    selectedIndex: -1
  }

  updateSelectedIndex = (clickedIndex:number) => () => {
    const { selectedIndex } = this.state;
    this.setState({
      selectedIndex: clickedIndex === selectedIndex ? -1 : clickedIndex
    });
  }

  render() {
    if (this.props.loading) {
      return <div>loading repository data...</div>;
    }

    const { repositories } = this.props;
    const { selectedIndex } = this.state;

    if (repositories) {
      let items: Array<React.Element<typeof ListGroupItem>> = [];
      let totalOpenIssues = 0;

      for (var i = 0, l = repositories.length; i < l; i++) {
        const repo = repositories[i];
        let repoIssueCount = 0;

        if (repo.issues) {
          repoIssueCount = repo.issues.filter(openIssueFilter).length;
          totalOpenIssues += repoIssueCount;
        }

        const itemText =
          repo.name + (repoIssueCount === 0 ? "" : ` (${repoIssueCount})`);

        items.push(
          <ListGroupItem
            key={i}
            onClick={this.updateSelectedIndex(i)}
            active={selectedIndex === i}
          >
            {itemText}
          </ListGroupItem>
        );
      }

      const selectedRepoIssues: ?Issue[] = (selectedIndex === -1 ? null : repositories[selectedIndex].issues);

      return (
        <>
          Total open issues: {totalOpenIssues}
          <ListGroup>{items}</ListGroup>
          <SelectedRepoIssues issues={selectedRepoIssues || []} />
        </>
      );
    }

    return null;
  }
}

type SelectedRepoIssuesProps = {
  issues: Issue[]
}

function SelectedRepoIssues({ issues }:SelectedRepoIssuesProps) {
  if(issues.length === 0) {
    return null;
  }

  return (
    <ListGroup>
      {
        issues
          .filter((issue: Issue) => issue.isOpen)
          .map(( issue, idx ) => <ListGroupItem key={idx}>{issue.title}</ListGroupItem>)
      }
    </ListGroup>
  );
}
