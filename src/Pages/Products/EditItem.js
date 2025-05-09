import { useParams } from "react-router-dom";
import Host from "../../Components/Host/Host";
import AddItem from "./AddItem";
import { useEffect, useState } from "react";

const EditProductWrapper = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
  
    useEffect(() => {
      fetch(`${Host}/api/product/all`)
        .then((res) => res.json())
        .then((data) => {
          const found = data.find((p) => p._id === id);
          if (found) setProduct(found);
        });
    }, [id]);
  
    return product ? <AddItem editing={product} onSuccess={() => window.history.back()} /> : <p>Loading...</p>;
  };

  export default EditProductWrapper