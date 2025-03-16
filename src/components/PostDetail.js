import PropTypes from "prop-types";
import React from "react";

const PostDetail = ({ post }) => {
  return (
    <div>
      <img src={post.image} alt={post.title} />
      <h2>{post.title}</h2>
      <p>Autor: {post.createdBy}</p>
      <p>Tags: {post.tags.join(", ")}</p>
    </div>
  );
};

PostDetail.propTypes = {
  post: PropTypes.shape({
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    createdBy: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
};

export default PostDetail;
