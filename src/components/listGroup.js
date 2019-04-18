// @flow
import * as React from 'react';

type ListGroupItemProps = {
  children: string,
};

export function ListGroupItem (props: ListGroupItemProps) {
  return <li className="list-group-item">{props.children}</li>;
}

type ListGroupProps = {
  children: React.ChildrenArray<React.Element<typeof ListGroupItem>>
};

export function ListGroup (props: ListGroupProps) {
  return <ul className='list-group'>{props.children}</ul>
}
