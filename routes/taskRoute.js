const router = require("express").Router();

const Task = require("../models/Task");
const checkToken = require("../utils/checkToken");

//Create - Criação de dados

router.post("/", checkToken, async (req, res) => {
	const { name, status = true, deleted = false } = req.body;
	const userId = req.userid;

	if (!name || !status || deleted) {
		return res.status(422).json({ error: "Adicione uma tarefa!" });
	}
	const task = { name, status, deleted, userId };

	try {
		await Task.create(task);

		return res.status(201).json({ msg: "Tarefa adicionada com sucesso!" });
	} catch (error) {
		console.log(error);

		return res.status(500).json({
			msg: "Aconteceu um erro no servidor, tente novamente mais tarde",
		});
	}
});

//Read- Leitura de dados

router.get("/", async (req, res) => {
	try {
		const tasks = await Task.find();
		res.status(200).json(tasks);
	} catch (error) {
		console.log(error);

		res.status(500).json({
			msg: "Aconteceu um erro no servidor, tente novamente mais tarde",
		});
	}
});

//Update -atualização de dados (PUT, PATCH)
router.patch('/', async (req, res) => {
	const userId = req.userid;

	const { name, status = true, deleted = false } = req.body

	const task = { name, status, deleted, userId };

	try {
		
		const updatedTask = await Task.updateOne(userId, task)

		res.status(200).json(task)

	} catch (error) {
		console.log(error);

		res.status(500).json({
			msg: "Aconteceu um erro no servidor, tente novamente mais tarde",
	}
)}
})

module.exports = router;
