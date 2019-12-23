// @flow
import React from "react";
import { shallow } from "enzyme";
import {
  ListGroup,
  ListGroupItem,
  SingleSelectionListGroup,
} from "./listGroup";

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

describe("<ListGroupItem />", () => {
  it("renders according to specification", () => {
    const wrapper = shallow(<ListGroupItem>item 1</ListGroupItem>);
    expect(wrapper).toContainExactlyOneMatchingElement("li.list-group-item");
    expect(wrapper).toHaveText("item 1");
  });

  it("renders active when active prop is truthy", () => {
    const wrapper = shallow(<ListGroupItem active>item 1</ListGroupItem>);
    expect(wrapper).toContainExactlyOneMatchingElement(
      "li.list-group-item.active"
    );
  });

  describe("when onClick prop is defined", () => {
    it("renders as an action button", () => {
      const wrapper = shallow(
        <ListGroupItem onClick={() => {}}>item 1</ListGroupItem>
      );
      expect(wrapper).toContainExactlyOneMatchingElement(
        'button[type="button"].list-group-item.list-group-item-action'
      );
    });

    it("renders as an active action button when active prop is truthy", () => {
      const wrapper = shallow(
        <ListGroupItem active onClick={() => {}}>
          item 1
        </ListGroupItem>
      );
      expect(wrapper).toContainExactlyOneMatchingElement(
        'button[type="button"].list-group-item.list-group-item-action.active'
      );
    });

    it("calls the given callback when clicked", () => {
      const onClickSpy = jest.fn();
      const wrapper = shallow(
        <ListGroupItem onClick={onClickSpy}>item 1</ListGroupItem>
      );

      wrapper.simulate("click");

      expect(onClickSpy).toHaveBeenCalled();
    });
  });
});

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
