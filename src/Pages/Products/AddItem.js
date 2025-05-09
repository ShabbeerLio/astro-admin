import React, { useState, useEffect } from "react";
import Host from "../../Components/Host/Host";
import Select from "react-select";
import { MdDelete } from "react-icons/md";
import "./Products.css"
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';


const AddItem = ({ editing }) => {
    const [showVariants, setShowVariants] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        title: "",
        description: "",
        longDescription: "",
        costPrice: "",
        salePrice: "",
        quantity: "",
        category: [],
        subcategory: [],
        variants: [],
        images: [],
    });

    const [variantInput, setVariantInput] = useState({
        attributes: { Gender: [], Size: [], Color: [], Weight: [] },
        costPrice: "",
        salePrice: "",
        quantity: "",
        weightValue: "",
        weightUnit: "g",
    });

    const astroCategoryOptions = [
        { value: "Sun", label: "Sun" },
        { value: "Moon", label: "Moon" },
        { value: "Mars", label: "Mars" },
        { value: "Mercury", label: "Mercury" },
        { value: "Jupiter", label: "Jupiter" },
        { value: "Venus", label: "Venus" },
        { value: "Saturn", label: "Saturn" },
        { value: "Rahu", label: "Rahu" },
        { value: "Ketu", label: "Ketu" },
    ];

    const alphaCategoryOptions = [
        { value: "Box/Remedy kit", label: "Box/Remedy kit" },
        { value: "Gem stone (Bracelet/Pendent)", label: "Gem stone (Bracelet/Pendent)" },
        { value: "Online pooja", label: "Online pooja" },
        { value: "Offline pooja", label: "Offline pooja" },
        { value: "Prasad delivery", label: "Prasad delivery" },
        { value: "Rudraksh", label: "Rudraksh" },
        { value: "Murti", label: "Murti" },
        { value: "Divine booster", label: "Divine booster" },
    ];

    // const subcategoryOptions = [
    //     { value: "sub-A", label: "sub-A" },
    //     { value: "sub-B", label: "sub-B" },
    //     { value: "sub-C", label: "sub-C" },
    //     { value: "sub-D", label: "sub-D" },
    //     { value: "sub-E", label: "sub-E" },
    //     { value: "sub-F", label: "sub-F" },
    // ];

    const handleMultiSelect = (selectedOptions, field) => {
        const values = selectedOptions.map((opt) => opt.value);
        setForm((prev) => ({ ...prev, [field]: values }));
    };
    const handleCategorySelect = (selectedAstro, selectedAlpha) => {
        const combined = [...(selectedAstro || []), ...(selectedAlpha || [])].map(opt => opt.value);
        setForm((prev) => ({ ...prev, category: combined }));
        // console.log(combined, "combined")
    };


    useEffect(() => {
        if (editing) {
            setForm(editing);
        }
    }, [editing]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const totalImages = [...form.images, ...selectedFiles];

        if (totalImages.length > 6) {
            alert("You can upload up to 6 images only.");
            return;
        }

        setForm((prev) => ({
            ...prev,
            images: totalImages,
        }));
    };

    const addVariant = () => {
        const gender = variantInput.Gender || [];
        const size = variantInput.Size || [];
        const color = variantInput.Color || [];
        const weightValue = variantInput.weightValue;
        const weightUnit = variantInput.weightUnit;
        // Take the default values from the form if not provided for variant
        const costPrice = variantInput.costPrice || form.costPrice || 0;
        const salePrice = variantInput.salePrice || form.salePrice || 0;
        const quantity = variantInput.quantity || form.quantity || 0;

        // Create arrays for each selected field or fallback to [null] to maintain combinations
        const genders = gender.length
            ? gender.map((g) => ({ key: "Gender", value: g.value }))
            : [null];
        const sizes = size.length
            ? size.map((s) => ({ key: "Size", value: s.value }))
            : [null];
        const colors = color.length
            ? color.map((c) => ({ key: "Color", value: c.value }))
            : [null];
        const weights =
            weightValue && weightUnit
                ? [{ key: "Weight", value: `${weightValue}${weightUnit}` }]
                : [null];

        const combinations = [];

        genders.forEach((g) =>
            sizes.forEach((s) =>
                colors.forEach((c) =>
                    weights.forEach((w) => {
                        const attributes = [g, s, c, w].filter(Boolean); // remove nulls
                        combinations.push({
                            attributes,
                            costPrice,
                            salePrice,
                            quantity,
                        });
                    })
                )
            )
        );

        setForm((prev) => ({
            ...prev,
            variants: [...prev.variants, ...combinations],
        }));
    };


    const editorExtensions = [
        StarterKit.configure({
            heading: false,
            bulletList: false,
            orderedList: false,
            listItem: false,
        }),
        Underline,
        Heading.configure({ levels: [1, 2, 3] }),
        BulletList,
        OrderedList,
        ListItem,
    ];

    const descriptionEditor = useEditor({
        extensions: editorExtensions,
        content: form.description,
        onUpdate: ({ editor }) => {
            setForm((prevForm) => ({
                ...prevForm,
                description: editor.getHTML(),
            }));
        },
    });

    const longDescriptionEditor = useEditor({
        extensions: editorExtensions,
        content: form.longDescription,
        onUpdate: ({ editor }) => {
            setForm((prevForm) => ({
                ...prevForm,
                longDescription: editor.getHTML(),
            }));
        },
    });
    // Watch for form updates
    useEffect(() => {
        if (descriptionEditor && form.description) {
            descriptionEditor.commands.setContent(form.description);
        }
        if (longDescriptionEditor && form.longDescription) {
            longDescriptionEditor.commands.setContent(form.longDescription);
        }
    }, [form.description, form.longDescription]);

    const renderToolbar = (editor) => {
        if (!editor) return null;
        return (
            <div className="toolbar">
                <button
                    type="button"
                    className={`btn ${editor.isActive('bold') ? 'active' : ''}`}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    Bold
                </button>
                <button
                    type="button"
                    className={`btn ${editor.isActive('italic') ? 'active' : ''}`}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    Italic
                </button>
                <button
                    type="button"
                    className={`btn ${editor.isActive('underline') ? 'active' : ''}`}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                >
                    Underline
                </button>
                <button
                    type="button"
                    className={`btn ${editor.isActive('heading', { level: 1 }) ? 'active' : ''}`}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                >
                    H1
                </button>
                <button
                    type="button"
                    className={`btn ${editor.isActive('heading', { level: 2 }) ? 'active' : ''}`}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                >
                    H2
                </button>
                <button
                    type="button"
                    className={`btn ${editor.isActive('heading', { level: 3 }) ? 'active' : ''}`}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                >
                    H3
                </button>
                <button
                    type="button"
                    className={`btn ${editor.isActive('bulletList') ? 'active' : ''}`}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                    Bullet List
                </button>
                <button
                    type="button"
                    className={`btn ${editor.isActive('orderedList') ? 'active' : ''}`}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    Ordered List
                </button>
            </div>
        );
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (parseFloat(form.salePrice) >= parseFloat(form.costPrice)) {
            alert("cost Price should be greater than or equal to sale Price.");
            return;
        }
        setIsSubmitting(true);

        const data = new FormData();
        Object.entries(form).forEach(([key, val]) => {
            if (key === "variants") {
                data.append("variants", JSON.stringify(val));
            } else if (key === "images") {
                val.forEach((img) => data.append("images", img));
            } else {
                data.append(key, val);
            }
        });

        const url = editing
            ? `${Host}/api/product/edit/${editing._id}`
            : `${Host}/api/product/add`;

        const method = editing ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method,
                body: data,
            });

            if (response.ok) {
                alert(`Product ${editing ? "edited" : "added"} successfully!`);
                setIsSubmitting(false);
            } else {
                const error = await response.text();
                alert(`Failed to ${editing ? "edit" : "add"} product. Server says: ${error}`);
            }
        } catch (err) {
            alert(`Error: ${err.message}`);
        }

        setForm({
            title: "",
            description: "",
            longDescription: "",
            category: [],
            subcategory: [],
            costPrice: "",
            salePrice: "",
            quantity: "",
            variants: [],
            images: [],
        });

    };

    const handleReactSelect = (field, selectedOptions) => {
        setVariantInput((prev) => ({
            ...prev,
            [field]: selectedOptions,
        }));
    };

    console.log(form, "form")

    const genderOptions = [
        { value: "Men", label: "Men" },
        { value: "Women", label: "Women" },
    ];

    const sizeOptions = [
        { value: "28", label: "28" },
        { value: "30", label: "30" },
        { value: "32", label: "32" },
    ];

    const colorOptions = [
        { value: "Red", label: "Red" },
        { value: "Green", label: "Green" },
        { value: "Black", label: "Black" },
        { value: "White", label: "White" },
    ];

    const weightUnitOptions = ["g", "kg", "l"];

    return (
        <div className="Gochar">
            <h3 className="text-lg font-semibold mb-2">
                {editing ? "Edit" : "Add"} Product
            </h3>

            <form onSubmit={handleSubmit} className="product-form">
                <div className="frm-input-box">
                    <label htmlFor="title">Title</label>
                    <input
                        name="title"
                        placeholder="Title"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Description Editor */}
                <div className="product-description">
                    <h5>Description</h5>
                    {renderToolbar(descriptionEditor)}
                    <div className="product-description short">
                        <EditorContent editor={descriptionEditor} />
                    </div>
                </div>

                {/* Long Description Editor */}
                <div className="product-description">
                    <h5>Long Description</h5>
                    {renderToolbar(longDescriptionEditor)}
                    <div className="product-description long">
                        <EditorContent editor={longDescriptionEditor} />
                    </div>
                </div>
                <div className="product-items">
                    <div>
                        <label>Category</label>
                        <Select
                            isMulti
                            options={astroCategoryOptions}
                            value={astroCategoryOptions.filter((opt) =>
                                form.category.includes(opt.value)
                            )}
                            onChange={(selected) => {
                                const alphaSelected = alphaCategoryOptions.filter((opt) =>
                                    form.category.includes(opt.value)
                                );
                                handleCategorySelect(selected, alphaSelected);
                            }}
                            req={true}
                        />
                    </div>

                    <div>
                        <label>Category</label>
                        <Select
                            isMulti
                            options={alphaCategoryOptions}
                            value={alphaCategoryOptions.filter((opt) =>
                                form.category.includes(opt.value)
                            )}
                            onChange={(selected) => {
                                const astroSelected = astroCategoryOptions.filter((opt) =>
                                    form.category.includes(opt.value)
                                );
                                handleCategorySelect(astroSelected, selected);
                            }}
                            req={true}
                        />
                    </div>

                    {/* <div>
                        <label htmlFor="subcategory">Sub Category</label>
                        <Select
                            isMulti
                            name="subcategory"
                            options={subcategoryOptions}
                            value={subcategoryOptions.filter((opt) => form.subcategory.includes(opt.value))}
                            onChange={(selected) => handleMultiSelect(selected, "subcategory")}
                            closeMenuOnSelect={false}
                            req={true}
                        />
                    </div> */}
                </div>


                <div className="product-items">
                    <div className="frm-input-box">
                        <label htmlFor="title">Cost Price</label>
                        <input
                            name="costPrice"
                            placeholder="Cost Price"
                            value={form.costPrice}
                            onChange={handleChange}
                            required
                        />

                    </div>
                    <div className="frm-input-box">
                        <label htmlFor="title">Sale Price</label>
                        <input
                            name="salePrice"
                            placeholder="Sale Price"
                            value={form.salePrice}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="frm-input-box">
                        <label htmlFor="title">Quantity</label>
                        <input
                            name="quantity"
                            placeholder="Quantity"
                            value={form.quantity}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="frm-input-box">
                        <label htmlFor="title">Images (1st Image will be the Main Image)</label>
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            // required
                        />
                        <div className="image-preview">
                            {form.images.map((img, index) => (
                                <div key={index} style={{ display: "inline-block", margin: "5px" }}>
                                    <img
                                        src={img instanceof File ? URL.createObjectURL(img) : img}
                                        alt="preview"
                                        width={100}
                                        height={100}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setForm((prev) => ({
                                                ...prev,
                                                images: prev.images.filter((_, i) => i !== index),
                                            }));
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="frm-input-box">
                    <label className="flex items-center gap-2 mt-4 mb-2">
                        <input
                            type="checkbox"
                            checked={showVariants}
                            onChange={(e) => setShowVariants(e.target.checked)}
                        />
                        Variants
                    </label>
                </div>

                {showVariants && (
                    <div className="product-variants">
                        <h5>Variants</h5>
                        <div className="my-2">
                            {/* Gender */}
                            <Select
                                isMulti
                                options={genderOptions}
                                onChange={(selected) => handleReactSelect("Gender", selected)}
                                placeholder="Select Gender"
                            />

                            {/* Size - disabled if weight is set */}
                            <Select
                                isMulti
                                options={sizeOptions}
                                onChange={(selected) => handleReactSelect("Size", selected)}
                                placeholder="Select Size"
                                isDisabled={!!variantInput.weightValue}
                            />

                            {/* Color */}
                            <Select
                                isMulti
                                options={colorOptions}
                                onChange={(selected) => handleReactSelect("Color", selected)}
                                placeholder="Select Color"
                            />

                            {/* Weight - disabled if Size is selected */}
                            <div className="frm-input-box weight">
                                <input
                                    name="weightValue"
                                    placeholder="Weight Value"
                                    value={variantInput.weightValue}
                                    disabled={Array.isArray(variantInput.Size) && variantInput.Size.length > 0}
                                    onChange={(e) =>
                                        setVariantInput({
                                            ...variantInput,
                                            weightValue: e.target.value,
                                        })
                                    }
                                />
                                <select
                                    name="weightUnit"
                                    value={variantInput.weightUnit}
                                    disabled={Array.isArray(variantInput.Size) && variantInput.Size.length > 0}
                                    onChange={(e) =>
                                        setVariantInput({
                                            ...variantInput,
                                            weightUnit: e.target.value,
                                        })
                                    }
                                >
                                    {weightUnitOptions.map((unit) => (
                                        <option key={unit} value={unit}>
                                            {unit}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="product-items">
                                <div className="frm-input-box">
                                    <label htmlFor="title">Cost Price</label>
                                    <input
                                        name="costPrice"
                                        placeholder="Cost Price"
                                        value={variantInput.costPrice}
                                        onChange={(e) =>
                                            setVariantInput({
                                                ...variantInput,
                                                costPrice: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="frm-input-box">
                                    <label htmlFor="title">Sale Price</label>
                                    <input
                                        name="salePrice"
                                        placeholder="Sale Price"
                                        value={variantInput.salePrice}
                                        onChange={(e) =>
                                            setVariantInput({
                                                ...variantInput,
                                                salePrice: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="frm-input-box">
                                    <label htmlFor="title">Quantity</label>
                                    <input
                                        name="quantity"
                                        placeholder="Quantity"
                                        value={variantInput.quantity}
                                        onChange={(e) =>
                                            setVariantInput({
                                                ...variantInput,
                                                quantity: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={addVariant}
                        >
                            Add Variant
                        </button>

                        {/* Variant Preview Table */}
                        {form.variants.length > 0 && (
                            <div className="table-container">
                                <h4>Variant Preview</h4>

                                <table className="user-table">
                                    <thead>
                                        <tr>
                                            <th>Attributes</th>
                                            <th>Cost Price</th>
                                            <th>Sale Price</th>
                                            <th>Quantity</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {form.variants.map((variant, index) => (
                                            <tr key={index}>
                                                <td>
                                                    {variant.attributes
                                                        .map((attr) => `${attr.key}: ${attr.value}`)
                                                        .join(", ")}
                                                </td>
                                                <td>
                                                    <div className="frm-input-box">
                                                        <input
                                                            type="number"
                                                            value={variant.costPrice}
                                                            onChange={(e) => {
                                                                const updated = [...form.variants];
                                                                updated[index].costPrice = e.target.value;
                                                                setForm((prev) => ({
                                                                    ...prev,
                                                                    variants: updated,
                                                                }));
                                                            }}
                                                        />
                                                    </div>

                                                </td>
                                                <td>
                                                    <div className="frm-input-box">
                                                        <input
                                                            type="number"
                                                            value={variant.salePrice}
                                                            onChange={(e) => {
                                                                const updated = [...form.variants];
                                                                updated[index].salePrice = e.target.value;
                                                                setForm((prev) => ({
                                                                    ...prev,
                                                                    variants: updated,
                                                                }));
                                                            }}
                                                        />
                                                    </div>

                                                </td>
                                                <td>
                                                    <div className="frm-input-box">
                                                        <input
                                                            type="number"
                                                            value={variant.quantity}
                                                            onChange={(e) => {
                                                                const updated = [...form.variants];
                                                                updated[index].quantity = e.target.value;
                                                                setForm((prev) => ({
                                                                    ...prev,
                                                                    variants: updated,
                                                                }));
                                                            }}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <p
                                                        onClick={() => {
                                                            const updated = form.variants.filter(
                                                                (_, i) => i !== index
                                                            );
                                                            setForm((prev) => ({
                                                                ...prev,
                                                                variants: updated,
                                                            }));
                                                        }}
                                                    >
                                                        <MdDelete />
                                                    </p>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
                <button className="product-add-btn" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (editing ? "Updating Product..." : "Adding Product...") : (editing ? "Update Product" : "Add Product")}
                </button>
            </form>
        </div>
    );
};

export default AddItem;
