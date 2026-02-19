import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;


function Products(){
  const navigate = useNavigate();

   const [products, setProducts] = useState([]);
   useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/${API_PATH}/products`);
        // console.log(response.data.products);
        setProducts(response.data.products);
      } catch (error) {
        console.error(error.response);
      }
    };
  
    getProducts();
  }, []);

    const handleView = async(id) => {
      navigate(`/product/${id}`)
    // try {
    //   const response= await axios.get(`${API_BASE}/api/${API_PATH}/product/${id}`);
    //   navigate(`/product/${id}`, { state: { productData: response.data } });
    //   console.log(response.data);
    // } catch (error) {
    //   console.error( error.response);
    // }
  };
    return( 
    <div className="container mt-4">
      <div className="row">
        {
        products.map((product) => (
        <div className="col-md-4" key={product.id}>
          <div className="card mb-3">
            <img src={product.imageUrl} className="card-img-top" alt={product.title}/>
            <div className="card-body">
              <h5 className="card-title">{product.title}</h5>
              <p className="card-text">{product.description}</p>
              <p className="card-text"><strong>價格:</strong> {product.price} 元</p>
              <p className="card-text"><small>{product.unit}</small></p>
              <button className="btn btn-primary" onClick={() => handleView(product.id)}>
                  查看更多
                </button>
            </div>
          </div>
        </div>
        ))}
      </div>
    </div>

      
    )
}

export default Products;