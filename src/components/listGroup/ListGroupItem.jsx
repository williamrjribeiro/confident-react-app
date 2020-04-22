// @flow
import * as React from "react";

type ListGroupItemProps = {
  children: string,
  active?: boolean,
  onClick?: SyntheticEvent<HTMLButtonElement> => void
};

const ButtonItem = ({ children, active, onClick }: ListGroupItemProps) => (
    <button type="button" className={`list-group-item list-group-item-action${active ? " active" : ""}`} onClick={onClick}>
        {children}
    </button>
);

const ListItem = ({ children, active }: ListGroupItemProps) => (
    <li className={`list-group-item${active ? " active" : ""}`}>{children}</li>
);

const ListGroupItem = (props: ListGroupItemProps) => props.onClick ? ButtonItem(props) : ListItem(props);

export default ListGroupItem;