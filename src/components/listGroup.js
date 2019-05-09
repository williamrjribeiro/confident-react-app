// @flow
import * as React from 'react';

type ListGroupItemProps = {
  children: string,
  active?: boolean,
  onClick?: Function
};

export function ListGroupItem (props: ListGroupItemProps) {
  let classes = "list-group-item" + (props.active ? " active" : "")

  if(props.onClick) {
    classes += " list-group-item-action";
    return (
      <button type="button" className={classes} onClick={props.onClick}>
        {props.children}
      </button>
    );
  } else {
    return <li className={classes}>{props.children}</li>;
  }
}

type ListGroupProps = {
  children: React.ChildrenArray<React.Element<typeof ListGroupItem>>
};

export function ListGroup (props: ListGroupProps) {
  return <ul className='list-group'>{props.children}</ul>
}
