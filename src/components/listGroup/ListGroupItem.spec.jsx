// @flow
import React from "react";
import { shallow } from "enzyme";
import ListGroupItem from "./ListGroupItem";

describe("<ListGroupItem />", () => {
    it("renders according to specification", () => {
      const wrapper = shallow(<ListGroupItem>item 1</ListGroupItem>);
      expect(wrapper).toContainExactlyOneMatchingElement("li.list-group-item");
      expect(wrapper).toHaveText("item 1");
    });
  
    it("renders active when active prop is truthy", () => {
      const wrapper = shallow(<ListGroupItem active>item 1</ListGroupItem>);
      expect(wrapper).toContainExactlyOneMatchingElement("li.list-group-item.active");
    });
  
    describe("when onClick prop is defined", () => {
      it("renders as an action button", () => {
        const wrapper = shallow(<ListGroupItem onClick={() => {}}>item 1</ListGroupItem>);
        expect(wrapper).toContainExactlyOneMatchingElement(
          'button[type="button"].list-group-item.list-group-item-action'
        );
        expect(wrapper).toHaveText("item 1");
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
        expect(wrapper).toHaveText("item 1");
      });
  
      it("calls the given callback when clicked", () => {
        const onClickSpy = jest.fn();
        const wrapper = shallow(<ListGroupItem onClick={onClickSpy}>item 1</ListGroupItem>);
  
        wrapper.simulate("click");
  
        expect(onClickSpy).toHaveBeenCalled();
      });
    });
  });