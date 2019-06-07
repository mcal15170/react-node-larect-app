import React, { Component } from "react";
import { Link } from "react-router-dom";
import { list } from "./apiPost";
import DefaultPost from "../images/defaultPost.png";
import LoaderImg from "../images/loader.gif";

class Post extends Component {
  constructor() {
    super();
    this.state = {
      posts: []
    };
  }

  componentDidMount() {
    list().then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ posts: data });
      }
    });
  }

  renderPosts = posts => {
    return (
      <div className="row">
        <div className="col-md-12">
          {this.state.loader && (
            <img className="rounded mx-auto d-block" src={LoaderImg} />
          )}
        </div>
        {posts.map((post, i) => {
          const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
          const posterName = post.postedBy ? post.postedBy.name : "Unkown";

          return (
            <div className="col-md-4" key={i}>
              <div className="card" style={{ marginBottom: "30px" }}>
                <img
                  src={`${process.env.REACT_APP_API_URL}/post/photo/${
                    post._id
                  }`}
                  onError={i => {
                    i.target.src = `${DefaultPost}`;
                  }}
                  className="img-thumbnail"
                  style={{ width: "100%", height: "15vw", objectFit: "cover" }}
                  alt={post.title}
                />
                <div className="card-body">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text">{post.body.substring(0, 80)}</p>
                  <p className="font-italic mark">
                    <i className="far fa-calendar-alt" />
                    &nbsp;&nbsp;Posted by&nbsp;
                    <Link to={`${posterId}`}>{posterName} </Link>
                    on {new Date(post.created).toDateString()}
                  </p>
                  <Link
                    to={`/post/${post._id}`}
                    className="btn btn-raised btn-primary btn-sm"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    const { posts } = this.state;
    return (
      <div>
        <div className="container">
          <h2 className="mt-5 mb-5">
            {!posts.length ? "Loading Posts" : "Recent Posts"}
          </h2>
          {!posts.length ? (
            <p className="text-center">
              <img src={LoaderImg} />
            </p>
          ) : (
            this.renderPosts(posts)
          )}
        </div>
      </div>
    );
  }
}
export default Post;
