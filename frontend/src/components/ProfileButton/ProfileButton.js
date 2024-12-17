import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button/button';
import { Input } from '../ui/input/input';
import { Modal } from '../Modal/Modal';
import { login, register, getProfile, updateGenealogy, getGenealogy } from '../../api/auth';
import './ProfileButton.css';
import {useGenealogy} from "../../context/GenealogyContext";

const ProfileButton = ({}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [isRegistering, setIsRegistering] = useState(false);
    const { genealogy, setGenealogy } = useGenealogy();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            fetchProfile(storedToken);
        }
    }, []);

    const fetchProfile = async (token) => {
        try {
            const userProfile = await getProfile(token);
            setUser(userProfile);
        } catch (err) {
            console.error('Error fetching profile:', err);
            handleLogout();
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await login(email, password);
            setToken(data.token);
            const userProfile = await getProfile(data.token);
            setUser(userProfile);
            setIsOpen(false);
            setError(null);
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        }
    };

    const handleLogout = () => {
        setToken(null);
        setUser(null);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const data = await register(name, email, password);
            setToken(data.token);
            localStorage.setItem('token', data.token);
            setUser(data.user);
            setIsOpen(false);
            setError(null);
        } catch (err) {
            setError('Registration failed. Please try again.');
        }
    };

    const toggleForm = () => {
        setIsRegistering(!isRegistering);
        setError(null);
    };

    const handleLoadGenealogy = async () => {
        if (token) {
            try {
                const loadedGenealogy = await getGenealogy(token);
                setGenealogy(loadedGenealogy); // Now using context
                alert('Genealogy loaded successfully!');
            } catch (err) {
                console.error('Error loading genealogy:', err);
                alert('Failed to load genealogy. Please try again.');
            }
        }
    };

    const handleSaveGenealogy = async () => {
        if (token && genealogy) {
            try {
                await updateGenealogy(token, genealogy);
                alert('Genealogy saved successfully!');
            } catch (err) {
                console.error('Error saving genealogy:', err);
                alert('Failed to save genealogy. Please try again.');
            }
        }
    };

    return (
        <>
            <Button variant="outline" onClick={() => setIsOpen(true)}>
                {user ? user.name : 'Profile'}
            </Button>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                {user ? (
                    <div className="profile-info">
                        <h2 className="modal-title">Welcome, {user.name}!</h2>
                        <p>Email: {user.email}</p>
                        <div className="button-group">
                            <Button onClick={handleLoadGenealogy}>Load Genealogy</Button>
                            <Button onClick={handleSaveGenealogy}>Save Genealogy</Button>
                            <Button onClick={handleLogout}>Logout</Button>
                        </div>
                    </div>
                ) : isRegistering ? (
                    <form onSubmit={handleRegister} className="auth-form">
                        <h2 className="modal-title">Register</h2>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        <Button type="submit">Register</Button>
                        <p className="toggle-form">
                            Already have an account?{' '}
                            <button type="button" onClick={toggleForm}>
                                Login
                            </button>
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleLogin} className="auth-form">
                        <h2 className="modal-title">Login</h2>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        <Button type="submit">Login</Button>
                        <p className="toggle-form">
                            Don't have an account?{' '}
                            <button type="button" onClick={toggleForm}>
                                Register
                            </button>
                        </p>
                    </form>
                )}
            </Modal>
        </>
    );
}

export default ProfileButton;