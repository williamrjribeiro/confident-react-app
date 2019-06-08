// @flow
import * as React from 'react';

type ListGroupItemProps = {
  children: string,
  active?: boolean,
  onClick?: (SyntheticEvent<HTMLButtonElement>) => void
};

export function ListGroupItem ({ children, active, onClick }: ListGroupItemProps) {
  let classes = "list-group-item" + (active ? " active" : "")

  if(onClick) {
    classes += " list-group-item-action";
    return (
      <button type="button" className={classes} onClick={onClick}>
        {children}
      </button>
    );
  } else {
    return <li className={classes}>{children}</li>;
  }
}

type ListGroupProps = {
  children: React.ChildrenArray<React.Element<typeof ListGroupItem>>
};

export function ListGroup (props: ListGroupProps) {
  return <ul className='list-group'>{props.children}</ul>
}
