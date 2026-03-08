import { Link, Outlet } from "react-router";

function AdminLayout(){
    return(
        <>        
        <header>
            <ul className="nav">
                <li className="nav-item">
                    <Link className="nav-link" to="/Admin/Products">Admin Products</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/Admin/Orders">Admin Orders</Link>
                </li>                             
            </ul>
        </header>
        <main>
            <Outlet />


        </main>
        <footer>

        </footer>
        </>



       
    )
}

export default AdminLayout;