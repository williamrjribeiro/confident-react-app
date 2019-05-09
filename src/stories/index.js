// @flow
import React from 'react';
import { storiesOf } from '@storybook/react';
import { ListGroup, ListGroupItem } from '../components/listGroup';

storiesOf('ListGroup', module)
  .add('with items', () => (
    <ListGroup>
      <ListGroupItem>item 1</ListGroupItem>
      <ListGroupItem>item 2</ListGroupItem>
    </ListGroup>
  ))