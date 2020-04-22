// @flow
import React from "react";
import { shallow } from "enzyme";
import ListGroup from "./ListGroup";
import ListGroupItem from "./ListGroupItem";

describe("<ListGroup />", () => {
  it("renders according to specification", () => {
    const wrapper = shallow(
      <ListGroup>
        <ListGroupItem>item 1</ListGroupItem>
        <ListGroupItem>item 2</ListGroupItem>
      </ListGroup>
    );

    expect(wrapper).toContainExactlyOneMatchingElement("ul.list-group");
    expect(wrapper.find(ListGroupItem).length).toEqual(2);
  });
});