const { StatusCodes } = require("http-status-codes");
const db = require("../config/db");
const Logger = require("../utils/logger");
const fs = require("fs");
const path = require("path");

class AgendaController {
  static async addEvent(req, res, next) {
    try {
      const { event_date, title, location_id } = req.body;

      if (!event_date || !title || !location_id) {
        return res.status(400).json({ status: false, message: "Data do evento, título e local são obrigatórios." });
      }

      const query = `
        INSERT INTO agenda (event_date, title, location_id)
        VALUES (?, ?, ?)
      `;

      const { rows: newEvent } = await db.query(query, [event_date, title, location_id]);

      return res.status(201).json({ status: true, message: "Evento adicionado com sucesso." });
    } catch (ex) {
      Logger.error("Ocorreu um erro ao adicionar o evento.", ex);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Erro Interno do Servidor", message: ex.message });
    }
  }

  static async updateEvent(req, res, next) {
    try {
      const eventId = req.params.id;
      const { event_date, title, location_id } = req.body;

      // Verifica se o evento existe antes de tentar atualizá-lo
      const findEventQuery = `
        SELECT * FROM agenda WHERE event_id = ?
      `;
      const eventResult = await db.query(findEventQuery, [eventId]);

      if (eventResult.rows.length === 0) {
        return res.status(404).json({ status: false, message: "Evento não encontrado." });
      }

      const updateQuery = `
        UPDATE agenda SET event_date = ?, title = ?, location_id = ? WHERE event_id = ?
      `;
      await db.query(updateQuery, [event_date, title, location_id, eventId]);

      return res.status(200).json({ status: true, message: "Evento atualizado com sucesso." });
    } catch (ex) {
      Logger.error("Ocorreu um erro ao atualizar o evento.", ex);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Erro Interno do Servidor", message: ex.message });
    }
  }

  static async deleteEvent(req, res, next) {
    try {
      const eventId = req.params.id;

      const query = `
      DELETE FROM agenda
      WHERE event_id = ?
    `;

      const { rows } = await db.query(query, [eventId]);

      if (rows.length === 0) {
        return res.status(200).json({ status: false, message: "Evento não encontrado." });
      }

      return res.status(200).json({ status: true, message: "Evento eliminado com sucesso." });
    } catch (ex) {
      Logger.error("Ocorreu um erro ao eliminar o evento.", ex);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Erro Interno do Servidor", message: ex.message });
    }
  }
}

module.exports = AgendaController;
