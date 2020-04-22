// @flow
import React from "react";
import { shallow } from "enzyme";
import SingleSelectionListGroup from "./SingleSelectionListGroup";
import ListGroup from "../ListGroup";
import type { ListGroupProps } from "../ListGroup";
import ListGroupItem from "../ListGroupItem";

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
    expect(listGroup.find(ListGroupItem)).toHaveLength(2);
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

        wrapper
          .find(ListGroupItem)
          .first()
          .simulate("click");

        expect(wrapper.find(ListGroupItem).first()).toHaveProp("active", true);
      });

      it("deselects any other selected item - single selection", () => {
        const wrapper = shallow(
          <SingleSelectionListGroup>
            <ListGroupItem active>Item 1</ListGroupItem>
            <ListGroupItem>Item 2</ListGroupItem>
          </SingleSelectionListGroup>
        );

        expect(wrapper.find(ListGroupItem).first()).toHaveProp("active", true);

        wrapper
          .find(ListGroupItem)
          .last()
          .simulate("click");

        expect(wrapper.find(ListGroupItem).first()).toHaveProp("active", false);

        expect(wrapper.find(ListGroupItem).last()).toHaveProp("active", true);
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

        expect(wrapper.find(ListGroupItem).last()).toHaveProp("active", true);

        wrapper
          .find(ListGroupItem)
          .last()
          .simulate("click");

        expect(wrapper.find(ListGroupItem).last()).toHaveProp("active", false);

        expect(wrapper.find(ListGroupItem).first()).toHaveProp("active", false);
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

      wrapper
        .find(ListGroupItem)
        .first()
        .simulate("click");

      expect(changeSpy).toHaveBeenCalledWith({
        index: 0,
        value: "Item 1"
      });

      wrapper
        .find(ListGroupItem)
        .first()
        .simulate("click");

      expect(changeSpy).toHaveBeenCalledWith({
        index: -1,
        value: null
      });
    });
  });
});
