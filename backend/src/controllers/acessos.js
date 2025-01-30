const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const db = require("../config/db");
const Logger = require("../utils/logger");

class AcessosController {
  static async RegisterEntry(req, res, next) {
    try {
      const { userEmail, userPhone } = req.body;

      if (!userEmail && !userPhone) {
        return res.json({ status: false, message: "O email ou o telefone do utilizador são obrigatórios." });
      }

      // Verificar se o utilizador que faz a requisição é um administrador
      if (req.user.user_type !== "admin") {
        return res.json({ status: false, error: "Forbidden", message: "Apenas os administradores podem registar entradas." });
      }

      let checkExistenceQuery, existenceParams, userIdentifier;

      if (userEmail) {
        checkExistenceQuery = "SELECT user_id FROM users WHERE email = ?";
        existenceParams = [userEmail];
        userIdentifier = { column: "email", value: userEmail };
      } else {
        checkExistenceQuery = "SELECT user_id FROM users WHERE phone = ?";
        existenceParams = [userPhone];
        userIdentifier = { column: "phone", value: userPhone };
      }

      const { rows: userResult } = await db.query(checkExistenceQuery, existenceParams);

      if (userResult.length === 0) {
        return res.json({ status: false, message: "Utilizador não encontrado." });
      }

      const userId = userResult[0].user_id;

      // Verificar se o utilizador tem alguma entrada nos últimos 10 minutos
      const recentEntryQuery = "SELECT entry_id FROM entries WHERE user_id = ? AND entry_time >= NOW() - INTERVAL 10 MINUTE";
      const { rows: recentEntries } = await db.query(recentEntryQuery, [userId]);

      if (recentEntries.length > 0) {
        return res.json({ status: false, message: "O utilizador já registou uma entrada nos últimos 10 minutos." });
      }

      const insertEntryQuery = "INSERT INTO entries (user_id) VALUES (?)";
      console.log(insertEntryQuery)
      const { rows: entrada } = await db.query(insertEntryQuery, [userId]);
      console.log(entrada)
      return res.json({ status: true, message: "Entrada registada com sucesso." });
    } catch (error) {
      Logger.error("Erro ao registar entrada:", error);
      return res.json({ status: false, message: "Erro ao registar entrada." });
    }
  }

  static async ValidateEntries(req, res) {
    try {
      const { entryIds } = req.body;
      const adminId = req?.user?.user_id;

      if (!adminId || !Array.isArray(entryIds) || entryIds.length === 0) {
        return res.json({ status: false, message: "Parâmetros inválidos." });
      }

      if (req.user.user_type !== "admin") {
        return res.json({ status: false, error: "Proibido", message: "Apenas administradores podem validar entradas." });
      }

      const unvalidatedEntryIds = await AcessosController.filterUnvalidatedEntryIds(entryIds);
      
      if (unvalidatedEntryIds.length === 0) {
        return res.json({ status: false, message: "Todas as entradas fornecidas já foram validadas." });
      }

      const placeholders = unvalidatedEntryIds.map(() => "?").join(", ");
      const values = [adminId, ...unvalidatedEntryIds];

      const updateQuery = `UPDATE entries SET validated_by = ?, validated_at = NOW() WHERE entry_id IN (${placeholders}) AND validated_by IS NULL`;
      await db.query(updateQuery, values);

      return res.json({ status: true, message: "Entradas validadas com sucesso." });
    } catch (error) {
      Logger.error("Erro ao validar entradas:", error);
      return res.json({ status: false, message: "Erro ao validar entradas." });
    }
  }

  static async filterUnvalidatedEntryIds(entryIds) {
    const unvalidatedEntryIds = [];
    for (const entryId of entryIds) {
      const { rows: validationStatus } = await db.query("SELECT validated_by FROM entries WHERE entry_id = ?", [entryId]);
      if (validationStatus.length > 0 && !validationStatus[0].validated_by) {
        unvalidatedEntryIds.push(entryId);
      }
    }
    return unvalidatedEntryIds;
  }

  static async RemoveEntry(req, res, next) {
    try {
      const { entryId } = req.params;

      if (!entryId || isNaN(entryId)) {
        return res.json({ status: false, message: "ID de entrada inválido." });
      }

      if (req.user.user_type !== "admin") {
        return res.json({ status: false, message: "Apenas administradores podem remover entradas." });
      }

      const { rows: entryExists } = await db.query("SELECT * FROM entries WHERE entry_id = ?", [entryId]);
      if (entryExists.length === 0) {
        return res.json({ status: false, message: "Entrada não encontrada." });
      }

      await db.query("DELETE FROM entries WHERE entry_id = ?", [entryId]);

      return res.json({ status: true, message: "Entrada removida com sucesso." });
    } catch (error) {
      Logger.error("Erro ao remover entrada:", error);
      return res.json({ status: false, message: "Erro ao remover entrada." });
    }
  }
}

module.exports = AcessosController;
