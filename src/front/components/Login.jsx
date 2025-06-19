import {useState} from "react"
import useGlobalReducer from "../hooks/useGlobalReducer"
import {Link, useNavigate} from "react-router-dom"

const initialState = {
    email: "",
    password: ""
}

export const Login = () => {

    const [user, setUser] = useState(initialState)

    const {dispatch, store} = useGlobalReducer()
    const navigate = useNavigate()

    const saveLogin = ({target}) => {
        setUser({
            ... user,
            [target.name]: target.value
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        const urlbackend = import.meta.env.VITE_BACKEND_URL;

        const response = await fetch(`${urlbackend}/login`, {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
        const data = await response.json()
        if (response.ok){
            localStorage.setItem("token", data.token)
            dispatch({
                type: "LOGIN", 
                payload: data.token
            })
            setTimeout(() => {
                navigate("/private")
            }, 2000)
        }else if (response.status === 400){
            alert("Credenciales incorrectas")
        }else{
            alert("Error al iniciar sesión")
        }
    }

    return (
        <div className= "container">
            <div className="row justify-content-center">
                <h2 className="text-center my-3 text-primary">Acceso al Portal</h2>
                <div className="col-12 col-md-6 border  pb-4 bg-light rounded">
                    <form
                        onSubmit={handleSubmit}>
                        <div className="form-group mb-3 ">
                            <label htmlFor="btnEmail">Correo electrónico:</label>
                            <input
                            className="form-control"
                            type="text"
                            placeholder="nombre@gmail.com"
                            id="btnEmail"
                            name="email"
                            onChange={saveLogin}
                            value={user.email}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="btnPass">Contraseña:</label>
                            <input
                            className="form-control"
                            type="password"
                            placeholder="contraseña"
                            id="btnPass"
                            name="password"
                            onChange={saveLogin}
                            value={user.password}                                           
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-outline-primary w-100">Ingresar</button>
                    </form>
                </div>
                <div className="w-100"></div>
                <div className="col-12 col-md-6 d-flex justify-content-start mt-1 p-2">
                    <Link to="/recovery-password">Recuperar contraseña</Link>
                </div>
            </div>
        </div>
    )
}