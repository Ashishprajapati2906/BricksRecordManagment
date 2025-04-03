import React, { useState } from 'react';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		// Handle login logic here
		console.log('Email:', email);
		console.log('Password:', password);

		if (!email || password) {
			alert('Please fill in all fields');
		}

		let crad = [
			{
				email: 'user1@gmail.com',
				password: '123456',

			},
			{
				email: 'user2@gmail.com',
				password: '123456',
			},

		]


		if (email && password) {
			crad.forEach((user) => {
				if (user.email === email && user.password === password) {
					localStorage.setItem("role","user")
					window.location.href = "/";
				} else {
					alert('Invalid Email or Password')
				}
			})
		}




	};

	return (
		<div className="login-container">
			<h1>Login</h1>
			<form onSubmit={handleSubmit}>
				<div>
					<label>Email:</label>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Enter your email"
						required
					/>
				</div>
				<div>
					<label>Password:</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Enter your password"
						required
					/>
				</div>
				<button type="submit">Login</button>
			</form>
		</div>
	);
};

export default Login;
