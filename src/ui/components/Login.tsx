import { useState } from 'react';
import './css/Login.css';
import properties from '../data/properties.json';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../contexts/UserContext';

function Login() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isNew, setIsNew] = useState(false);
    const navigate = useNavigate();
    const { updateUser } = getUser();

    const validate = (event: string) => {
        switch (event) {
            case 'login':
                return true;
            case 'new-account':
                if (confirmPassword !== password) {
                    console.error("Password do not match!!!");
                    return false;
                }
                return true;
            default:
                return false;
        }
    }

    const loginUser = async () => {
        try {
            const isValidInput = validate('login');
            if (!isValidInput) {
                console.error("Invalid Input!!!");
                return;
            }
            const payload = {
                username: username,
                password: password
            }
            const loginUrl = properties.serverBaseUrl + properties.loginPath
            const response = await fetch(loginUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const devices = await response.json();
            console.log(devices)
            console.info("Successfully logged In");
            const user = {
                username: username,
                email: email,
                devices: devices
            }
            updateUser(user);
            navigate('/devices');
        } catch (error) {
            console.error("Error while login user", error);
        }
    }

    const switchCreateAccount = () => {
        setIsNew(!isNew);
    }
    const createAccount = async () => {
        try {
            const isValidInput = validate('new-account');
            if (!isValidInput) {
                console.error("Invalid Input!!!");
                return;
            }
            const payload = {
                email: email,
                username: username,
                password: password
            }
            const createAccountUrl = properties.serverBaseUrl + properties.newAccountPath
            const response = await fetch(createAccountUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
            console.info("Successfully Created Account");
        } catch (error) {
            console.error("Error while creating account", error);
        }
    }
    return (
        <>
            {
                !isNew &&
                <div className="login">
                    <input type='text' id='username' onChange={(e) => setUsername(e.target.value)} placeholder='username' />
                    <input type='password' id='password' onChange={(e) => setPassword(e.target.value)} placeholder='password' />
                    <button onClick={loginUser}>Login</button>
                    <p>Create a new account?</p>
                    <button onClick={switchCreateAccount}>Create Account</button>
                </div>
            }
            {
                isNew &&
                <div className='createAccount'>
                    <input type='text' id='email' onChange={(e) => setEmail(e.target.value)} placeholder='Email Id' />
                    <input type='text' id='username' onChange={(e) => setUsername(e.target.value)} placeholder='Username' />
                    <input type='password' id='password' onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
                    <input type='password' id='confirmPassword' onChange={(e) => setConfirmPassword(e.target.value)} placeholder='Confirm Password' />
                    <button onClick={createAccount}>Create Account</button>
                    <button onClick={switchCreateAccount}>Back</button>
                </div>
            }

        </>
    )
}

export default Login;