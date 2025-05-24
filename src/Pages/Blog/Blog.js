import React, { useEffect, useState } from "react";
import Host from "../../Components/Host/Host";
import { MdDelete, MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Blog = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    const res = await fetch(`${Host}/api/blogs`);
    const data = await res.json();
    setBlogs(data);
  };

  const deleteBlog = async (id) => {
    const res = await fetch(`${Host}/api/blogs/${id}`, {
      method: "DELETE",
    });
    if (res.ok) fetchBlogs();
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="Gochar">
      <div className="Gochar-button">
        <h3>Blogs</h3>
      </div>
      <div className="Gochar-box">
        {blogs.map((blog) => (
          <div key={blog._id} className="Gochar-card">
            <div className="Gochar-card-head">
              <h5>{blog.title}</h5>
              <div className="gochar-card-button">
                <p onClick={() => navigate(`/blog/edit/${blog._id}`)}>
                  <MdEdit />
                </p>
                <p onClick={() => deleteBlog(blog._id)}>
                  <MdDelete />
                </p>
              </div>
            </div>
            <div className="gochar-card-box">
                <img src={blog.blogImage} alt="" />
              <p>{blog.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
