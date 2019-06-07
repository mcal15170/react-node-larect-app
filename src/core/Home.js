import React from "react";
import Posts from "../post/Posts.js";

export default function Home() {
  return (
    <React.Fragment>
      <div className="jumbotron">
        <h2>Home</h2>
        <h5><b>React Bootstrap Masonry</b> </h5>
        <p className="lead">
          React Masonry - Bootstrap 4 & Material Design React Bootstrap masonry
          is a grid layout based on columns. Unlike other grid layouts, it
          doesn’t have fixed height rows. Basically, Masonry layout optimizes
          the use of space inside the web page by reducing any unnecessary gaps.
          Without this type of layout, certain restrictions are required to
          maintain the structure of layout.
        </p>
      </div>
      <div className="container">
        <div className="row">
          <Posts />
        </div>
      </div>
    </React.Fragment>
  );
}
