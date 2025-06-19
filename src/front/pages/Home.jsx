import React, { useEffect } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import {Navigate} from "react-router-dom"

export const Home = () => {

	const { store, dispatch } = useGlobalReducer()

	if (!store.token) {
		return <Navigate to="/login" />
	}

	return (
		<div className="container">
			<div>
				<h1 className="text-center text-primary">Home</h1>
			</div>
		</div>
	);
}; 