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
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [showOutOfStock, setShowOutOfStock] = useState(true);

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

    const filteredProducts = products.filter((product) => {
        const matchesCategory =
            selectedCategory === "All" || product.category === selectedCategory;

        const matchesSearch = product.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const isProductInStock =
            (product.variants?.length > 0
                ? product.variants.some((v) => v.quantity > 0)
                : product.quantity > 0);

        const matchesStock = showOutOfStock || isProductInStock;
        // console.log(matchesStock,"matchesStock")

        return matchesCategory && matchesSearch && matchesStock;
    });

    const totalPages = Math.ceil(filteredProducts.length / pageSize);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const toggleStockStatus = async (productId) => {
        await fetch(`${Host}/api/product/toggle-stock/${productId}`, {
            method: "PUT",
        });
        fetchProducts(); // Refresh
    };


    return (
        <div className="Gochar">
            <div className="Gochar-button">
                <h3>Products</h3>
                <div className="planet-filter">
                    <div className="group">
                        <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="search-icon"
                        >
                            <g>
                                <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                            </g>
                        </svg>
                        <input
                            id="query"
                            className="input"
                            type="search"
                            placeholder="Search by title"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // Reset to page 1
                            }}
                        />
                    </div>
                </div>
                <div className="planet-filter">
                    <select
                        value={selectedCategory}
                        onChange={(e) => {
                            setSelectedCategory(e.target.value);
                            setCurrentPage(1); // Reset to page 1
                        }}
                    >
                        <option value="All">All Categories</option>
                        {[...new Set(products.map((p) => p.category))].map((cat, index) => (
                            <option key={index} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="planet-filter">
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <input
                            type="checkbox"
                            checked={showOutOfStock}
                            onChange={() => {
                                setShowOutOfStock(!showOutOfStock);
                                setCurrentPage(1);
                            }}
                        />
                        Show Out of Stock
                    </label>
                </div>
            </div>
            <div className="table-container">

                <table className="user-table">
                    <thead>
                        <tr >
                            {/* <th>Image</th> */}
                            <th>Title</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Status</th>
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
                                        <td>
                                            {product.salePrice ?? "—"}
                                        </td>
                                        <td>
                                            {(product.variants?.length > 0
                                                ? product.variants.reduce((sum, v) => sum + (v.quantity || 0), 0)
                                                : product.quantity || 0) > 0 ? (
                                                product.quantity ?? "—"
                                            ) : (
                                                <span style={{ color: "red", fontWeight: "bold" }}>Out of Stock</span>
                                            )}
                                        </td>
                                        <td >
                                            <p
                                                onClick={() => toggleStockStatus(product._id)}
                                                style={{ cursor: "pointer", color: "green", margin: 0 }}
                                            >
                                                {product.status === "out_of_stock" ? "Mark In Stock" : "Mark Out of Stock"}
                                            </p>
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