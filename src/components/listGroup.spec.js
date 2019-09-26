// @flow
import React from 'react';
import { shallow } from 'enzyme';
import { ListGroup, ListGroupItem } from './listGroup';

// React Hooks && Testing:
//    https://kevsoft.net/2019/05/28/testing-custom-react-hooks.html
//    https://dev.to/flexdinesh/react-hooks-test-custom-hooks-with-enzyme-40ib

// styled-components and testing:
//    https://medium.com/styled-components/effective-testing-for-styled-components-67982eb7d42b
//    https://www.styled-components.com/docs/api#test-utilities
//    https://github.com/styled-components/jest-styled-components

// Codesandbox comparing Custom Hooks and Render Prop Pattern implementations and tests.

describe('<ListGroup />', () => {
  it('renders according to specification', () => {
    const wrapper = shallow(
      <ListGroup>
        <ListGroupItem>item 1</ListGroupItem>
        <ListGroupItem>item 2</ListGroupItem>
      </ListGroup>
    );

    expect(wrapper).toContainExactlyOneMatchingElement('ul.list-group');
    expect(wrapper.find(ListGroupItem).length).toEqual(2);
  });
});

describe('<ListGroupItem />', () => {
  it('renders according to specification', () => {
    const wrapper = shallow(<ListGroupItem>item 1</ListGroupItem>);
    expect(wrapper).toContainExactlyOneMatchingElement('li.list-group-item');
    expect(wrapper).toHaveText('item 1');
  });

  it('renders active when active prop is truthy', () => {
    const wrapper = shallow(<ListGroupItem active>item 1</ListGroupItem>);
    expect(wrapper).toContainExactlyOneMatchingElement('li.list-group-item.active');
  });

  describe('when onClick prop is defined', () => {
    it('renders as an action button', () => {
      const wrapper = shallow(<ListGroupItem onClick={() => {}}>item 1</ListGroupItem>);
      expect(wrapper).toContainExactlyOneMatchingElement('button[type="button"].list-group-item.list-group-item-action');
    });

    it('renders as an active action button when active prop is truthy', () => {
      const wrapper = shallow(<ListGroupItem active onClick={() => {}}>item 1</ListGroupItem>);
      expect(wrapper).toContainExactlyOneMatchingElement('button[type="button"].list-group-item.list-group-item-action.active');
    });

    it('calls the given callback when clicked', () => {
      const onClickSpy = jest.fn()
      const wrapper = shallow(<ListGroupItem onClick={onClickSpy}>item 1</ListGroupItem>);
      
      wrapper.simulate("click");

      expect(onClickSpy).toHaveBeenCalled();
    });
  });
});
