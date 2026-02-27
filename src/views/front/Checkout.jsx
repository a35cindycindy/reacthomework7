import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { RotatingLines } from "react-loader-spinner";
import * as bootstrap from "bootstrap";
import { useRef } from "react";
import SingleProductModal from "../../components/SingleProductModal";
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Checkout(){
    const [cart, setCart] = useState({});
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(null);
    const [loadingProducts, setLoadingProducts] = useState(null);
    const [product, setProduct] = useState([]);
    const productModalRef= useRef(null);

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

            // 初始化 Bootstrap Modal
            productModalRef.current = new bootstrap.Modal("#productModal",{
                keyboard: false
            });
             // Modal 關閉時移除焦點
            document
                .querySelector("#productModal")
                .addEventListener("hide.bs.modal", () => {
                if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                }
                });
        }, []);

        


    //
    const{
        register,
        handleSubmit,
        formState: { errors }, 
    } = useForm({   
        mode: "onChange"
    });

   // 取得購物車列表
     const getCart = async () => {
        try {
        const url = `${API_BASE}/api/${API_PATH}/cart`;
        const response = await axios.get(url);
        setCart(response.data.data);
        } catch (error) {
        console.log(error.response);
        }
    };
        useEffect(() => {
            (async () => {
            try {
                await getCart();
            } catch (error) {
                console.log(error.response);
            }
            })();
        }, []);

    // 更新商品數量
        const updateCart = async (cartId, productId, qty = 1) => {
        try {
            const url = `${API_BASE}/api/${API_PATH}/cart/${cartId}`;

            const data = {
            product_id: productId,
            qty,
            };
            await axios.put(url, { data });
            getCart();
        } catch (error) {
            console.log(error.response.data);
        }
        };
    // 清除單一筆購物車
        const deleteCart = async (id) => {
        try {
            const url = `${API_BASE}/api/${API_PATH}/cart/${id}`;
            await axios.delete(url);
            getCart();
        } catch (error) {
            console.log(error.response.data);
        }
        };
    // 清空購物車
        const deleteCartAll = async () => {
        try {
            const url = `${API_BASE}/api/${API_PATH}/carts`;
            await axios.delete(url);
            getCart();
        } catch (error) {
            console.log(error.response.data);
        }
        };

     //加入購物車
        const addCart = async (id, qty = 1) => {
            setLoading(id)
            try {
            const data = {
                product_id: id,
                qty,
            };
            const response = await axios.post(`${API_BASE}/api/${API_PATH}/cart`, { data });
            console.log(response.data);
            await getCart();
            } catch (error) {
            console.error("加入購物車失敗", error);
            } finally {
            setLoading(null);
            }
        };   

    //送出訂單
        const onSubmit = async (formData) => {
        console.log(formData);
        try {
            const data = {
                user:formData,
                message: formData.message,
            };
            const response = await axios.post(`${API_BASE}/api/${API_PATH}/order`, {data});
            console.log(response,data);
            await getCart();
        } catch (error) {
            console.log(error.response);
        }
    }

    // 查看單一產品資料
        const handleView = async(id) => {
            setLoadingProducts(id)
        try {
          const response = await axios.get(`${API_BASE}/api/${API_PATH}/product/${id}`);
          console.log(response.data);
          setProduct(response.data.product);
        } catch (error) {
          console.error(error.response);
        } finally {
            setLoadingProducts(null);
        } 
        productModalRef.current.show();
      };
      const closeModal = () => {
        productModalRef.current.hide();
      }
      

    return(
            <div className="container">
                {/* 產品列表 */}
                <table className="table align-middle">
                <thead>
                    <tr>
                    <th>圖片</th>
                    <th>商品名稱</th>
                    <th>價格</th>
                    <th></th>
                    </tr>
                </thead>
                <tbody>
                {
                    products.map((product) => (
                     <tr key={product.id}>
                    <td style={{ width: "200px" }}>
                        <div
                        style={{
                            height: "100px",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundImage: `url(${product.imageUrl})`,
                        }}
                        ></div>
                    </td>
                    <td>{product.title}</td>
                    <td>
                        <del className="h6">原價：{product.origin_price}</del>
                        <div className="h5">特價：{product.price}</div>
                    </td>
                    <td>
                        <div className="btn-group btn-group-sm">
                        <button type="button" className="btn btn-outline-secondary"
                         onClick={() => handleView(product.id)}
                         disabled={loadingProducts === product.id}
                        >
                        {
                            loadingProducts === product.id ? (
                                <RotatingLines width={80} height={16} Color="grey" />
                            ) : (
                                "查看產品"
                            )
                        }
                        </button>
                        <button type="button" className="btn btn-outline-danger"
                         onClick={() => addCart(product.id)}
                         disabled={loading === product.id}
                            >
                        {
                            loading === product.id ? (
                                <RotatingLines width={80} height={16} Color="grey" />
                            ) : (
                                "加到購物車"
                            )
                        }
                        </button>
                        </div>
                    </td>
                    </tr>
                    ))}
                    </tbody>
                </table>

            <h2>購物車列表</h2>
            <div className="text-end mt-4">
                <button type="button" className="btn btn-outline-danger" onClick={() => deleteCartAll()}>
                清空購物車
                </button>
            </div>
            <table className="table">
                <thead>
                <tr>
                    <th scope="col"></th>
                    <th scope="col">品名</th>
                    <th scope="col">數量/單位</th>
                    <th scope="col">小計</th>
                </tr>
                </thead>
                <tbody>
                     { cart?.carts &&
                        cart?.carts.map((item) => (
                 <tr key={item.id}>
                    <td>
                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => deleteCart(item.id)}>
                        刪除
                    </button>
                    </td>
                    <th scope="row">{item.product.title}</th>
                    <td>                 
                        <div className="input-group input-group-sm">
                            <input type="number" aria-label="sizing example input" aria-describedby="input-group-sm" className="form-control" min="1"  defaultValue={item.qty} onChange={(e) => updateCart(item.id, item.product.id, e.target.value)}/>
                            <div className="input-group-text" id ="">{item.product.unit}</div>
                        </div>
                    </td>
                    <td className="text-end">{item.final_total}</td>
                </tr>))}
                </tbody>
                <tfoot>
                <tr>
                    <td className="text-end" colSpan="3">
                    總計
                    </td>
                    <td className="text-end">{cart.final_total}</td>
                </tr>
                </tfoot>
            </table>
            {/* 結帳頁面 */}
                <div className="my-5 row justify-content-center">
                <form className="col-md-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        className="form-control"
                        placeholder="請輸入 Email"
                        {...register("email", {
                            required: "請輸入 Email",
                            pattern: {
                                value: /^\S+@\S+$/i,
                                message: "Email 格式不正確",
                            },
                            })}
                    />
                    {
                        errors.email && (
                            <p className="text-danger">
                                {errors.email.message}</p>)
                    }
                    </div>

                    <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                        收件人姓名
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        className="form-control"
                        placeholder="請輸入姓名"
                        {...register("name", {
                            required: "請輸入收件人姓名",
                            minLength: { value: 2, message: "姓名至少 2 個字" },
                            })}                        
                    />
                    {
                        errors.name && (
                            <p className="text-danger">
                                {errors.name.message}</p>)
                    }
                    </div>

                    <div className="mb-3">
                    <label htmlFor="tel" className="form-label">
                        收件人電話
                    </label>
                    <input
                        id="tel"
                        name="tel"
                        type="tel"
                        className="form-control"
                        placeholder="請輸入電話"
                        {...register("tel", {
                            required: "請輸入收件人電話",
                            minLength: { value: 8, message: "電話至少 8 碼" },
                            pattern: {
                                value: /^\d+$/,
                                message: "電話僅能輸入數字",
                            },
                            })}
                    />
                    {
                        errors.tel && (
                            <p className="text-danger">
                                {errors.tel.message}</p>)
                    }
                    </div>

                    <div className="mb-3">
                    <label htmlFor="address" className="form-label">
                        收件人地址
                    </label>
                    <input
                        id="address"
                        name="address"
                        type="text"
                        className="form-control"
                        placeholder="請輸入地址"
                        {...register("address", {
                            required: "請輸入收件人地址",
                            })}
                    />
                    {
                        errors.address && (
                            <p className="text-danger">
                                {errors.address.message}</p>)
                    }
                    </div>

                    <div className="mb-3">
                    <label htmlFor="message" className="form-label">
                        留言
                    </label>
                    <textarea
                        id="message"
                        className="form-control"
                        cols="30"
                        rows="10"
                        {...register("message")}
                        
                    ></textarea>
                    </div>
                    <div className="text-end">
                    <button type="submit" className="btn btn-danger">
                        送出訂單
                    </button>
                    </div>
                </form>
                </div>
                <SingleProductModal 
                product={product} 
                closeModal={closeModal}
                addCart={addCart}
                />
            </div>
            
    )
}

export default Checkout;