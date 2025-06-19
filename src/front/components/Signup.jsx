import { Link, useNavigate } from "react-router-dom"
import {useState} from "react"

const initialState = {
    name: "",
    email: "",
    avatar: "",
    password: "",
}
export const Signup = () => {

    const [user, SetUser] = useState(initialState)

    const navigate = useNavigate()

    const saveRegister = ({target}) => {
        SetUser({
            ...user,
            [target.name]: target.value
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        const urlbackend = import.meta.env.VITE_BACKEND_URL;

        const response = await fetch(`${urlbackend}/signup`,{
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(user)
        })

        if (response.status === 200){
            SetUser(initialState)
            setTimeout(() => {
                navigate("/login")
            }, 2000)
        }else if (response.status === 400){
            alert("Usuario ya registrado")
        }else{
            alert("Error al registrar el usuario")
        }
            
    }
    return (
        <div className="container">
            <div className="row justify-content-center">
                <h2 className="text-center my-3 text-primary">Creación de cuenta</h2>
                <div className="col-12 col-md-6 border  pb-4 bg-light rounded">
                    <form
                        onSubmit={handleSubmit}>
                        <div className="form-group mb-3 ">
                            <label htmlFor="btnName">Nombre:</label>
                            <input
                                className="form-control"
                                type="text"
                                placeholder="nombre completo"
                                id="btnName"
                                name="name"
                                onChange={saveRegister}
                            />
                        </div>
                        <div className="form-group mb-3 ">
                            <label htmlFor="btnEmail">Correo electrónico:</label>
                            <input
                                className="form-control"
                                type="text"
                                placeholder="nombre@gmail.com"
                                id="btnNEmail"
                                name="email"
                                onChange={saveRegister}
                            />
                        </div>
                        <div className="form-group mb-3 ">
                            <label htmlFor="btnAvatar">Imagen de perfil:</label>
                            <input
                                className="form-control"
                                type="file"
                                placeholder="Carga una imagen de tu ordenador"
                                id="btnNAvatar"
                                name="avatar"
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
                                onChange={saveRegister}
                            />
                        </div>
                        <button
                            className="btn btn-outline-primary w-100">Crear cuenta</button>
                    </form>
                </div>
                <div className="w-100"></div>
                <div className="col-12 col-md-6 d-flex justify-content-between mt-1 p-2">
                    <Link to="/login">Ya tengo una cuenta registrada</Link>
                </div>
            </div>
        </div>
    )
}