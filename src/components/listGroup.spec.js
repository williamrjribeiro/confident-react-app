// @flow
import React from 'react';
import { shallow } from 'enzyme';
import { ListGroup, ListGroupItem } from './ListGroup';

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
});
