import { useState } from 'react';
import './css/Login.css';
import properties from '../data/properties.json';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isNew, setIsNew] = useState(false);

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

            const responseBody = await response.json();
            console.log(responseBody)
            console.info("Successfully logged In");
        } catch (error) {
            console.error("Error while login user", error);
        }
    }

    const createAccount = async () => {
        if (!isNew) {
            setIsNew(true)
            return;
        }
        const isValidInput = validate('new-account');
        if (!isValidInput) {
            console.error("Invalid Input!!!");
            return;
        }
        const payload = {
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

        await response.json();
        console.info("Successfully Created Account");
    }
    return (
        <>
            {
                !isNew && 
                <div className="login">
                    <input type='text' id='username' onChange={(e) => setUsername(e.target.value)} placeholder='username'/>
                    <input type='text' id='password' onChange={(e) => setPassword(e.target.value)} placeholder='password'/>
                    <button onClick={loginUser}>Login</button>
                    <p>Create a new account?</p>
                    <button onClick={createAccount}>Create Account</button>
                </div>
            }
            {
                isNew &&
                <div className='createAccount'>
                    <input type='text' id='username' onChange={(e) => setUsername(e.target.value)} placeholder='Username'/>
                    <input type='text' id='password' onChange={(e) => setPassword(e.target.value)} placeholder='Password'/>
                    <input type='text' id='confirmPassword' onChange={(e) => setConfirmPassword(e.target.value)} placeholder='Confirm Password'/>
                    <button onClick={createAccount}>Create Account</button>
                </div>
            }
            
        </>
    )
}

export default Login;