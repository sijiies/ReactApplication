import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import {httpPost} from "./HttpService/HttpPost";
import { TailSpin  } from 'react-loader-spinner';
import './css/login.css';

function Login() {
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate(); // Initialize navigation

    const handleLogin = async () => {
        if (!username.trim() || !password.trim()) {
            setErrorMessage("Username and Password cannot be empty!");
            return;
        }

        if (password.length < 3) {
            setErrorMessage("Password must be at least 3 characters long!");
            return;
        }

        try {
           
           
            setLoading(true);
            const response = await httpPost({ endpoint:'/api/Login', jsonData: {username:username,password:password} });
            setLoading(false);
            const data = response;
            console.log(data);

            if (data.data.status === "SUCCESS" || data.status === "SUCCESS") {
                sessionStorage.setItem("logindata", JSON.stringify(data.data)); 
                navigate("/dashboard"); 
            } else {
                setErrorMessage("Invalid Username or Password");
                return;
            }

            setErrorMessage("");
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("An unknown error occurred");
            }
        }
    };

    return (
        <>
         {loading && (
                    <div className="overlay">
                      <TailSpin
                        height={150}
                        width={150}
                        color="white"
                        strokeWidth={3}
                     
                      />
                      </div>
                    )}

            {/* <h4 className="text-danger opacity-50">School Vaccination</h4>
            <h5>Login</h5>
            <div className="d-flex justify-content-center">
                <div className="card border-2 rounded-4 w-50 loginCard shadow-lg">
                    {errorMessage && (
                        <div className="alert m-2 ml-3 p-2 alert-danger">{errorMessage}</div>
                    )}

                    <input
                        type="text"
                        className="form-control m-2 rounded-2"
                        name="username"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <input
                        type="password"
                        className="form-control m-2 rounded-2"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <input
                        type="button"
                        className="form-control btn btn-danger m-2 rounded-2"
                        value="Login"
                        onClick={handleLogin}
                    />
                </div>
            </div> */}
            <div className="body">
             <div className="ocean">
                <div className="wave"></div>
                <div className="wave"></div>
             </div>
             <div>
                 <h4 className=" opacity-50 ">School Vaccination</h4>
           
            <div className="d-flex justify-content-center">
          
                <div className="card border-2 rounded-4 w-50 loginCard shadow-lg">
                <h3>Login</h3>
                    {errorMessage && (
                        <div className="alert m-2 ml-3 p-2 alert-danger">{errorMessage}</div>
                    )}

                    <input
                        type="text"
                        className="form-control m-2 rounded-2"
                        name="username"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <input
                        type="password"
                        className="form-control m-2 rounded-2"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <input
                        type="button"
                        className="form-control btn-login m-2 rounded-2"
                        value="Login"
                        onClick={handleLogin}
                    />
                </div>
            </div>
             </div>
            </div>
      


	
        </>
    );
}

export default Login;
