// @flow
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { ListGroup, ListGroupItem } from '../components/listGroup';

storiesOf('ListGroup', module)
  .add('with items', () => (
    <ListGroup>
      <ListGroupItem>item 1</ListGroupItem>
      <ListGroupItem>item 2</ListGroupItem>
    </ListGroup>
  ))

  .add('with active items', () => (
    <ListGroup>
      <ListGroupItem active>item 1</ListGroupItem>
      <ListGroupItem active>item 2</ListGroupItem>
    </ListGroup>
  ))

  .add('with actionable items', () => (
    <ListGroup>
      <ListGroupItem active onClick={action("Item 1 clicked!")}>action item 1</ListGroupItem>
      <ListGroupItem onClick={action("Item 2 clicked!")}>action item 2</ListGroupItem>
    </ListGroup>
  ))