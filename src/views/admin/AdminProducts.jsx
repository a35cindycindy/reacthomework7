import { useEffect, useState, useRef } from 'react'
import axios from "axios";
import * as bootstrap from 'bootstrap';
import Pagination from '../../components/Pagination';
import ProductModal from '../../components/ProductModal';
import { useDispatch } from "react-redux";
import "../../assets/style.css";
import { createAsyncMessage } from "../../slice/messageSlice";
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const INITIAL_TEMPLATE_DATA = {
  id: "",
  title: "",
  category: "",
  origin_price: "",
  price: "",
  unit: "",
  description: "",
  content: "",
  is_enabled: false,
  imageUrl: "",
  imagesUrl: [],
  size:""
};

function AdminProducts() {

  // 登入狀態管理(控制顯示登入或產品頁）
  const [isAuth, setIsAuth] = useState(false);
  // 產品資料狀態
  const [products, setProducts] = useState([]);
  // 目前選中的產品
  const [templateProduct, setTemplateProduct] = useState(INITIAL_TEMPLATE_DATA);
  const [modalType, setModalType] = useState(""); // create, edit, delete
  // 控制 Modal 顯示與否
  const productModelRef = useRef(null);
  //處理分頁
  const [pagination, setPagination] = useState({});
  //發送訊息相關
  const dispatch = useDispatch();


// 取得產品列表
  const getProducts = async (page=1) => {
    try {
      const response = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products?page=${page}`
      );
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
       dispatch(createAsyncMessage(error.response.data));
    }
  }



// 檢查登入狀態
const checkLogin = async () => {
  try {

      const res = await axios.post(`${API_BASE}/api/user/check`);
      // console.log("Token 驗證結果：", res.data);
      setIsAuth(true);
      getProducts();
    }
   catch (error) {
    console.error("Token 驗證失敗：", error.response?.data);
  }
};
// 頁面載入時檢查登入狀態
 useEffect(() => {
        const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1];

    // console.log("目前 Token：", token);

    if (token) {
      axios.defaults.headers.common.Authorization = token;;
  }
  productModelRef.current = new bootstrap.Modal("#productModal", {
    keyboard: false
  });
  // eslint-disable-next-line react-hooks/set-state-in-effect
  checkLogin();


}, []);

// 開啟 Modal 並設定類型與產品資料
const openModal = (type,product) => {
  setModalType(type);
  setTemplateProduct({
    ...INITIAL_TEMPLATE_DATA,
    ...product,
  } )

  productModelRef.current.show();
}
// 關閉 Modal
const closeModal = () => {
  productModelRef.current.hide();
}


  return (
    <>
           <div className="container">
              <h2>後台產品列表</h2>
              <div className="text-end mt-4">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => openModal("create", INITIAL_TEMPLATE_DATA)}>
                建立新的產品
              </button>
              </div>          
              <table className="table">
                <thead>
                  <tr>
                    <th>分類</th>
                    <th>產品名稱</th>
                    <th>原價</th>
                    <th>售價</th>
                    <th>是否啟用</th>
                    <th>編輯</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item) => (
                    <tr key={item.id}>
                      <td>{item.category}</td>
                      <td>{item.title}</td>
                      <td>{item.origin_price}</td>
                      <td>{item.price}</td>
                      <td className={`${item.is_enabled && "text-success"}`}>
                        {item.is_enabled ? "啟用" : "未啟用"}
                      </td>
                      <td>
                        <div className="btn-group">
                          <button type="button" className="btn btn-outline-primary btn-sm"
                           onClick={() => openModal("edit", item)}>
                            編輯
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => openModal("delete", item)}
                          >
                            刪除
                          </button>
                        </div>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination pagination={pagination} onChangePage={getProducts}  />
           </div>    
            <ProductModal 
              modalType={modalType}
              templateProduct={templateProduct}
              closeModal={closeModal}
              getProducts={getProducts}

            />



    </>
  )
}

export default AdminProducts
