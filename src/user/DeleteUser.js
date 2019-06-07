import React, { Component } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { isAuthenticated, signOut } from "../auth";
import { remove } from "./apiUser";
import { Redirect} from "react-router-dom";

class DeleteUser extends Component {
  state = {
    redirect: false
  };
  deleteAccount = () => {
    const token = isAuthenticated().token;
    const userId = this.props.userId;
    remove(userId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        // signOut user and redirect
        signOut(() => {
          console.log("user id deleted");
        });
        this.setState({redirect:true});
      }
    });
  };

  deleteConfiremd = () => {
    confirmAlert({
      title: "Are you sure?",
      message: "You want to delete this user?",
      buttons: [
        {
          label: "Yes , Delete it !",
          onClick: () => this.deleteAccount()
        },
        {
          label: "No",
          onClick: () => console.log("delete cancle")
        }
      ]
    });
  };
  
  render() {
      if(this.state.redirect){
         return <Redirect to="/" />
      }
    return (
      <button
        onClick={this.deleteConfiremd}
        className="btn btn-raised btn-danger mr-5"
      >
        Delete
      </button>
    );
  }
}

export default DeleteUser;
