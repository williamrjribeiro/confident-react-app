// @flow
import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { ListGroup, ListGroupItem, SingleSelectionListGroup } from "../components/listGroup";
import RepositoryIssuesBrowser from "../components/repositoryIssuesBrowser";

storiesOf("ListGroup", module)
  .add("with items", () => (
    <ListGroup>
      <ListGroupItem>item 1</ListGroupItem>
      <ListGroupItem>item 2</ListGroupItem>
    </ListGroup>
  ))

  .add("with active items", () => (
    <ListGroup>
      <ListGroupItem active>item 1</ListGroupItem>
      <ListGroupItem active>item 2</ListGroupItem>
    </ListGroup>
  ))

  .add("with actionable items", () => (
    <ListGroup>
      <ListGroupItem active onClick={action("Item 1 clicked!")}>
        action item 1
      </ListGroupItem>
      <ListGroupItem onClick={action("Item 2 clicked!")}>
        action item 2
      </ListGroupItem>
    </ListGroup>
  ));

storiesOf("SingleSelectionListGroup", module)
  .add("with items", () => (
    <SingleSelectionListGroup onChange={action("Selection changed")}>
      <ListGroupItem>item 1</ListGroupItem>
      <ListGroupItem>item 2</ListGroupItem>
    </SingleSelectionListGroup>
  ))
  .add("with initial selection", () => (
    <SingleSelectionListGroup onChange={action("Selection changed")}>
      <ListGroupItem>item 1</ListGroupItem>
      <ListGroupItem active>item 2</ListGroupItem>
    </SingleSelectionListGroup>
  ))

storiesOf("RepositoryIssuesBrowser", module)
  .add("loading repository data", () => (
    <RepositoryIssuesBrowser loading={true} />
  ))
  .add("with repositories", () => {
    const repos = [{ name: "Repo 1" }, { name: "Repo 2" }];
    return <RepositoryIssuesBrowser repositories={repos} />;
  })
  .add("with repositories and open issues", () => {
    const repos = [
      {
        name: "Repo 1",
        issues: [
          { title: "Repo 1 - Issue 1", isOpen: true },
          { title: "Repo 1 - Issue 2", isOpen: true },
        ],
      },
      {
        name: "Repo 2",
        issues: [
          { title: "Repo 2 - Issue 1", isOpen: true },
          { title: "Repo 2 - Issue 2", isOpen: false },
        ],
      },
      {
        name: "Repo 3",
      },
    ];
    return <RepositoryIssuesBrowser repositories={repos} />;
  });
