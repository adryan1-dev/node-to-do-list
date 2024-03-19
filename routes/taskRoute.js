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

router.get("/", checkToken, async (req, res) => {
	const userId = req.userid;

	try {
		const tasks = await Task.find({ userId });
		res.status(200).json(tasks);
	} catch (error) {
		console.log(error);

		res.status(500).json({
			msg: "Aconteceu um erro no servidor, tente novamente mais tarde",
		});
	}
});

//Update -atualização de dados (PUT, PATCH)
router.patch("/:id", checkToken, async (req, res) => {
	const userId = req.userid;

	const { status = true, deleted = false } = req.body;

	const task = { status, deleted };

	const existingTask = await Task.findOne({ _id: req.params.id });
	console.log(existingTask);

	if (existingTask.userId !== userId || !existingTask) {
		return res.status(403).json({ msg: "Acesso negado!" });
	}

	try {
		const updatedTask = await Task.updateOne({ _id: req.params.id }, task);

		res.status(200).json(task);
	} catch (error) {
		console.log(error);

		res.status(500).json({
			msg: "Aconteceu um erro no servidor, tente novamente mais tarde",
		});
	}
});

//DELETE - remoção de dados
router.delete("/:id", checkToken, async (req, res) => {
	const userId = req.userid;
	const { status = true, deleted = false } = req.body;

	const task = { status, deleted };

	const deletedTask = await Task.findOne({ _id: req.params.id });
	

	if (!deletedTask) {
		res.status(422).json({ message: "Tarefa não encontrada!" });
	}

	try {
		await Task.deleteOne({ _id: req.params.id });
	} catch (error) {
		console.log(error);

		res.status(500).json({
			msg: "Aconteceu um erro no servidor, tente novamente mais tarde",
		});
	}
});

module.exports = router;
