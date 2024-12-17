import React, { useState } from 'react';
import { Button } from '../ui/button/button';
import { Input } from '../ui/input/input';
import { register } from '../../api/auth';
import './RegisterForm.css';


export function RegisterForm({ onRegister, onToggleForm }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await register(name, email, password);
            onRegister(data.token, data.user);
        } catch (err) {
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="register-form">
            <h2 className="form-title">Register</h2>
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
                <button type="button" onClick={onToggleForm}>
                    Login
                </button>
            </p>
        </form>
    );
}

