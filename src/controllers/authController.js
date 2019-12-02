const express = require("express");
const brycpt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth");

const User = require("../models/User");

const router = express.Router();

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}

router.post("/register", async (req, res) => {
    const { email } = req.body;

    try {
        if (await User.findOne({ email }))

            return res.status(400).send({ error: "Este usuário já existe." });

        const user = await User.create(req.body);

        user.password = undefined;

        return res.send({
            user,
            token: generateToken({ id: user.id }),
        });
    }
    catch (err) {
        return res.status(400).send({ error: "O registro falhou - " + "MENSAGEM DE ERRO: " + err.message });
    }
});

router.post("/authenticate", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+ password");

    if (!user)
        return res.status(400).send({ error: "Usuário não encontrado." });

    if (!await brycpt.compare(password, user.password))
        return res.status(400).send({ error: "Senha Inválida" });

    user.password = undefined;


    res.send({
        user,
        token: generateToken({ id: user.id }),
    });
})

module.exports = app => app.use("/auth", router);