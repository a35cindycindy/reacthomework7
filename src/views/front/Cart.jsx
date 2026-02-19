import { useState, useEffect } from "react";
import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Cart(){
    const [cart, setCart] = useState([]);
     // 取得購物車列表
     useEffect(() => {
         const getCart = async () => {
        try {
        const url = `${API_BASE}/api/${API_PATH}/cart`;
        const response = await axios.get(url);
        setCart(response.data.data);
        } catch (error) {
        console.log(error.response);
        }
    };
        getCart();
    }, []);




    return(
            <div className="container">
            <h2>購物車列表</h2>
            <div className="text-end mt-4">
                <button type="button" className="btn btn-outline-danger">
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
                    <button type="button" className="btn btn-outline-danger btn-sm">
                        刪除
                    </button>
                    </td>
                    <th scope="row">{item.product.title}</th>
                    <td>                 
                        <div className="input-group input-group-sm">
                            <input type="number" aria-label="sizing example input" aria-describedby="input-group-sm" className="form-control" min="1" defaultValue={item.qty}/>
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
            </div>
    )
}

export default Cart;