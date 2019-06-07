import React, { Component } from "react";
import { comment, uncomment } from "./apiPost";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avtar3.jpg";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

class Comments extends Component {
  constructor() {
    super();
    this.state = {
      text: "",
      error: ""
    };
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value, error: false });
  };

  deleteComment = comment => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    const postId = this.props.postId;

    uncomment(userId, token, postId, comment).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.props.updateComments(data.comments);
      }
    });
  };

  deleteConfiremd = comment => {
    confirmAlert({
      title: "Are you sure?",
      message: "You want to delete this Comment?",
      buttons: [
        {
          label: "Yes , Delete it !",
          onClick: () => this.deleteComment(comment)
        },
        {
          label: "No",
          onClick: () => console.log("delete cancle")
        }
      ]
    });
  };

  isValid = () => {
    const { text } = this.state;
    if (!text.length > 0 || text.length > 80) {
      this.setState({
        error: "Comment should not be empty and less then 80 charecters long",
        text: ""
      });
      return false;
    }
    return true;
  };

  addComment = e => {
    e.preventDefault();
    if (!isAuthenticated()) {
      this.setState({ error: "Please SignIn to leave a comment" });
      return false;
    }
    if (this.isValid()) {
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;
      const postId = this.props.postId;

      comment(userId, token, postId, { text: this.state.text }).then(data => {
        if (data.error) {
          console.log(data.error);
        } else {
          this.setState({ text: "", error: false });

          //dispatch fresh list of comment to parent (single Post)
          this.props.updateComments(data.comments);
        }
      });
    } else {
      this.setState({ text: "" });
    }
  };
  render() {
    const { comments } = this.props;
    const { error, text } = this.state;
    return (
      <div className="container">
        <div className="row">
          <div
            style={{ display: error ? "block" : "none" }}
            className="alert alert-danger float-left col-md-12"
            role="alert"
          >
            {error}
          </div>

          <div className="col-md-12 mb-5">
            <h4 className="text-primary float-left">
              {comments.length} Comments
            </h4>
          </div>
          <div className="col-md-12">
            <form onSubmit={this.addComment}>
              <div className="row">
                <div className="col-md-8">
                  <div className="form-group">
                    <input
                      className="form-control"
                      type="text"
                      name="text"
                      placeholder="Leave a Comment ..."
                      onChange={this.handleChange}
                      value={text}
                    />
                  </div>
                </div>
                <div className="col-md-4" />
              </div>
            </form>
          </div>
          <div className="col-md-12">
            {comments.map((comment, i) => (
              <div className="row mb-2" key={i}>
                <div className="col-md-1">
                  <Link
                    to={`/user/${comment.postedBy._id}`}
                    style={{ width: "100%" }}
                  >
                    <img
                      src={`${process.env.REACT_APP_API_URL}/user/photo/${
                        comment.postedBy._id
                      }`}
                      alt={comment.postedBy.name}
                      onError={i => {
                        i.target.src = `${DefaultProfile}`;
                      }}
                      style={{
                        border: "1.5px solid black"
                      }}
                      className="mr-2"
                      height="40px"
                      width="40px"
                    />
                  </Link>
                </div>
                <div className="col-md-11">
                  <div className="row">
                    <div className="col-md-2">
                      <h5 className="float-left" style={{ color: "black" }}>
                        <i className="fa fa-id-card-o" />
                        &nbsp;{comment.postedBy.name}
                      </h5>
                    </div>

                    <div className="col-md-3">
                      <p className="float-left">
                        <i className="fa fa-calendar" />
                        &nbsp;
                        {new Date(comment.created).toDateString()}
                      </p>
                    </div>
                    <div className="col-md-7">
                      <p className="float-left">
                        <i className="fa fa-clock-o" />
                        &nbsp;
                        {new Date(comment.created).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="col-md-12">
                      <div className="row">
                        <div className="col-md-10">
                          <p
                            className="float-left border  border-info"
                            style={{ padding: "5px" }}
                          >
                            <i className="fa fa-pencil" />
                            &nbsp;{comment.text}
                          </p>
                        </div>
                        <div className="col-md-2">
                          {isAuthenticated().user &&
                            isAuthenticated().user._id ===
                              comment.postedBy._id && (
                              <button
                                onClick={() => this.deleteConfiremd(comment)}
                                className="btn btn-raised btn-danger"
                              >
                                <i className="fa fa-trash-o fa-lg" />
                              </button>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
export default Comments;
