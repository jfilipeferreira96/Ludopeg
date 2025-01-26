const express = require("express");
const AgendaController = require("../controllers/agenda");
const { authenticateToken } = require("../middleware/auth.middleware");

const agendaRoutes = express.Router();

// Rota para adicionar um evento
agendaRoutes.post("/add", authenticateToken, AgendaController.addEvent);

// Rota para atualizar um evento
agendaRoutes.put("/event/:id", authenticateToken, AgendaController.updateEvent);

// Rota para excluir um evento
agendaRoutes.delete("/event/:id", authenticateToken, AgendaController.deleteEvent);

module.exports = agendaRoutes;
