import React from "react";

import UserItem from "./UserItem";
import Card from "../../shared/components/UIElements/Card";

import './UserList.css';

const UserList = props =>{
    if(props.items.length===0){
        return (<div className="center">
            <Card>
                <h2>No Users Found!</h2>
            </Card>
        </div>);
    };
    return(
        <ul className="users-list">
            {props.items.map(users=>(
                <UserItem
                key = {users.id}
                id = {users.id}
                image = {users.image}
                name = {users.name}
                placeCount = {users.places.length}
                />
            ))}
        </ul>
    )
};

export default UserList;