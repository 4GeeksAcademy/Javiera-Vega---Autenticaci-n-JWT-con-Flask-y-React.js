import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer"

export const Navbar = () => {

	const {store, dispatch} = useGlobalReducer()

	const navigate = useNavigate()

	return (
		<nav className="navbar navbar-light">
			<div className="container">
				<div className="d-flex w-100 justify-content-end">
					{
						store.token ?
						<>
							<button
								className="btn btn-primary"
								onClick={() =>{
									dispatch({type:"LOGOUT"})
									localStorage.removeItem("token");
									navigate("login")
								}}>Cerrar sesión</button>											
						</> :
						<Link to="/Signup">
							<button className="btn btn-primary">Crear cuenta</button>
						</Link>
					}
				</div>
			</div>
		</nav>
	);
};