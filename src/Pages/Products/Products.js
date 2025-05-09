import React, { useEffect, useState } from "react";
import Host from "../../Components/Host/Host";
import { useNavigate } from "react-router-dom"; // Assuming you're using React Router
import { MdDelete, MdEdit, MdExpandMore, MdExpandLess } from "react-icons/md";

const ProductList = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [expandedProductId, setExpandedProductId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 15;

    const fetchProducts = async () => {
        const res = await fetch(`${Host}/api/product/all`);
        const data = await res.json();
        setProducts(data);
    };

    const toggleExpand = (id) => {
        setExpandedProductId(expandedProductId === id ? null : id);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        await fetch(`${Host}/api/product/delete/${id}`, { method: "DELETE" });
        fetchProducts(); // Refresh list
    };

    const totalPages = Math.ceil(products.length / pageSize);
  const paginatedProducts = products.slice((currentPage - 1) * pageSize, currentPage * pageSize);



    return (
        <div className="Gochar">
            <div className="Gochar-button">
                <h3>Products</h3>
            </div>
            <div className="table-container">

                <table className="user-table">
                    <thead>
                        <tr >
                            {/* <th>Image</th> */}
                            <th>Title</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Sub Category</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedProducts.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center p-4">No orders found.</td>
                            </tr>
                        ) : (
                            paginatedProducts.map((product) => (
                                <React.Fragment key={product._id}>
                                    <tr>
                                        {/* <td>{product.mainImage}</td> */}
                                        <td>{product.title}</td>
                                        <td>{product.description}</td>
                                        <td>{product.category}</td>
                                        <td>{product.subcategory}</td>
                                        <td>
                                            {product.salePrice ?? "—"}
                                        </td>
                                        <td>
                                            {product.quantity ?? "—"}
                                        </td>
                                        <td className="product-action">
                                            <p
                                                onClick={() => toggleExpand(product._id)}
                                            >
                                                {expandedProductId === product._id
                                                    ? <MdExpandLess />
                                                    : <MdExpandMore />}
                                            </p>
                                            <p
                                                onClick={() => navigate(`/products/edit/${product._id}`)}
                                            >
                                                <MdEdit />
                                            </p>
                                            <p
                                                onClick={() => handleDelete(product._id)}
                                            >
                                                <MdDelete />
                                            </p>
                                        </td>
                                    </tr>

                                    {/* Expanded Row for Variants */}
                                    {expandedProductId === product._id && product.variants.length > 0 && (
                                        <tr>
                                            <td colSpan="7">
                                                <h6>Variants:</h6>
                                                <table className="user-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Attributes</th>
                                                            <th>Cost Price</th>
                                                            <th>Sale Price</th>
                                                            <th>Quantity</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {product.variants.map((variant, idx) => (
                                                            <tr key={idx}>
                                                                <td>
                                                                    {variant.attributes.map((attr, i) => (
                                                                        <div key={i}>
                                                                            <strong>{attr.key}:</strong> {attr.value}
                                                                        </div>
                                                                    ))}
                                                                </td>
                                                                <td>{variant.costPrice ? variant.costPrice : product.costPrice}</td>
                                                                <td>{variant.salePrice ? variant.salePrice : product.salePrice}</td>
                                                                <td>{variant.quantity ? variant.quantity : product.quantity}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            )))}
                    </tbody>
                </table>
                {/* Pagination Controls */}
                <div className="pagination">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                    >
                        Previous
                    </button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductList;