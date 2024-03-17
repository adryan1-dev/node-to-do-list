const router = require('express').Router()
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const checkToken= require('../utils/checkToken')

router.post("/login", async (req, res) => {
	const { email, password } = req.body;

	//validations
	if (!email) {
		return res.status(422).json({ msg: "O email é obrigatório!" });
	}

	if (!password) {
		return res.status(422).json({ msg: "A senha é obrigatório!" });
	}

	//check if user exists
	const user = await User.findOne({ email: email });

	if (!user) {
		return res.status(404).json({ msg: "Usuário não encontrado" });
	}

	//check if password match
	const checkPassword = await bcrypt.compare(password, user.password);

	if (!checkPassword) {
		return res.status(422).json({ msg: "Senha incorreta!" });
	}

	try {
		const secret = process.env.SECRET;
		const token = jwt.sign(
			{
				id: user._id,
			},
			secret
		);

		res.status(200).json({ msg: "Autenticação realizada com sucesso!", token });
	} catch (error) {
		console.log(error);

		res
			.status(500)
			.json({
				msg: "Aconteceu um erro no servidor, tente novamente mais tarde",
			});
	}
});

router.get("/:id", checkToken, async (req, res) => {
	const id = req.params.id;

	//check if user exists
	const user = await User.findById(id, "-password");

	if (!user) {
		return res.status(404).json({ msg: "Usuário não encontrado" });
	}

	res.status(200).json({ user });
});

module.exports = router