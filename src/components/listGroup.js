// @flow
import * as React from "react";

type ListGroupItemProps = {
  children: string,
  active?: boolean,
  onClick?: (SyntheticEvent<HTMLButtonElement>) => void
};

export function ListGroupItem({ children, active, onClick }: ListGroupItemProps) {
  let classes = "list-group-item" + (active ? " active" : "");

  if (onClick) {
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

export function ListGroup(props: ListGroupProps) {
  return <ul className="list-group">{props.children}</ul>;
}

function getInitialSelect(
  children: React.ChildrenArray<React.Element<typeof ListGroupItem>>
): number {
  const childrenArr = React.Children.toArray(children);
  return childrenArr.findIndex(item => item.props.active);
}

type SingleSelectionListGroupProps = ListGroupProps & {
  onChange?: ({ index: number, value: ?string | null }) => void
};

export function SingleSelectionListGroup(props: SingleSelectionListGroupProps) {
  const initialSelection = getInitialSelect(props.children);
  const [selectedIndex, setSelectedIndex] = React.useState(initialSelection);
  const getClickHandler = (index: number, value: ?string) => () => {
    if (index === selectedIndex) {
      index = -1;
      value = null;
    }
    setSelectedIndex(index);
    props.onChange &&
      props.onChange({
        index,
        value
      });
  };

  const cloneItems = (listItem, index: number) =>
    React.cloneElement(listItem, {
      key: index,
      onClick: getClickHandler(index, listItem.props.children),
      active: index === selectedIndex
    });

  return <ListGroup>{React.Children.map(props.children, cloneItems)}</ListGroup>;
}
