import { useState} from "react";

export const RecoveryPasswordUser =() =>{

    const [email, setEmail] = useState("")

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!email){
            alert("Favor ingresar un correo válido")
            return
        }

        const urlbackend = import.meta.env.VITE_BACKEND_URL;
        
        const response = await fetch(`${urlbackend}/reset-password`, {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(email)
        })
        if (response.ok) {
            alert("Link enviado exitosamente")
        }
    }

    return (
        <div className= "container">
            <div className="row justify-content-center">
                <h2 className="text-center my-3 text-primary">Recuperar Contraseña</h2>
                <div className="col-12 col-md-6 border pb-4 bg-light rounded">
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
                            onChange={(event) => setEmail(event.target.value)}
                            value={email}
                            />
                        </div>
                        <button
                            className="btn btn-outline-primary w-100">Enviar link de recuperación</button>
                    </form>
                </div>
            </div>
        </div>
    )
}