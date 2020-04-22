// @flow
import * as React from "react";
import ListGroup from "../ListGroup";
import type { ListGroupProps } from "../ListGroup";

function getInitialSelection(children): number {
  const childrenArr = React.Children.toArray(children)
  return childrenArr.findIndex(item => item.props.active);
}

type SingleSelectionListGroupProps = ListGroupProps & {
  onChange?: ({ index: number, value: ?string | null }) => void
};

const SingleSelectionListGroup = (props: SingleSelectionListGroupProps) => {
  const initialSelection = getInitialSelection(props.children);
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

  const injectProps = (listItem, index) =>
    React.cloneElement(listItem, {
      ...listItem.props,
      onClick: getClickHandler(index, listItem.props.children),
      active: index === selectedIndex
    });

  return <ListGroup>{React.Children.map(props.children, injectProps)}</ListGroup>;
};

export default SingleSelectionListGroup;