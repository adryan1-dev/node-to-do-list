/* imports */
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();

//Config JSON Response
app.use(express.json())

const taskRoute = require('./routes/taskRoute')

app.use('/tasks', taskRoute)

//Register User
const registerUserRoute = require('./routes/registerUserRoute')

app.use('/auth/register', registerUserRoute)

//login user

const loginUserRoute = require('./routes/loginUserRoute')

app.use('/auth', loginUserRoute)


//Credentials
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

mongoose
	.connect(
		`mongodb+srv://${dbUser}:${dbPassword}@cluster0.5kxwn4t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
	)
	.then(() => {
		app.listen(3000);
		console.log("Conectou ao banco!");
	})
	.catch((err) => console.log(err));
