// @flow
import * as React from "react";
import ListGroupItem from './ListGroupItem';

export type ListGroupProps = {
    children: React.ChildrenArray<React.Element<typeof ListGroupItem>>
};
  
const ListGroup = (props: ListGroupProps) => <ul className="list-group">{props.children}</ul>;

export default ListGroup;