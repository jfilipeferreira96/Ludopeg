const { StatusCodes } = require("http-status-codes");
const db = require("../config/db");
const Logger = require("../utils/logger");
const fs = require("fs");
const path = require("path");

class NewsController {
  static async addNews(req, res, next) {
    try {
      const { title, content, image_path, download_path, is_active, date } = req.body;

      if (!title) {
        return res.status(200).json({ status: false, message: "O título é obrigatório." });
      }

      const query = `
        INSERT INTO news (title, content, image_path, download_path, user_id, is_active, date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const { rows: newNews } = await db.query(query, [title, content, image_path, download_path ?? image_path, req.user?.user_id, is_active, date]);

      const newsId = newNews.insertId;

      // Verifica se há arquivos enviados
      if (Array.isArray(req.files) && req.files.length > 0) {
        req.files.forEach((file) => {
          const fileName = file.originalname;

          const storagePath = `src/uploads/${newsId}`;
          if (!fs.existsSync(storagePath)) {
            fs.mkdirSync(storagePath, { recursive: true });
          }

          const filePath = path.join(storagePath, fileName);
          fs.writeFileSync(filePath, file.buffer);
        });
      }

      return res.status(201).json({ status: true, message: "Notícia adicionada com sucesso." });
    } catch (ex) {
      Logger.error("Ocorreu um erro ao adicionar a notícia.", ex);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Erro Interno do Servidor", message: ex.message });
    }
  }

  static async getAllNews(req, res, next) {
    try {
      const { page = 1, limit = 15, orderBy = "id", order = "ASC" } = req.body.pagination || {};

      let query = `
        SELECT *
        FROM news
        LEFT JOIN users ON news.user_id = users.user_id
        WHERE 1 = 1
      `;

      let totalCountQuery = `
        SELECT COUNT(*) as count
        FROM news
        LEFT JOIN users ON news.user_id = users.user_id
        WHERE 1 = 1
      `;

      const params = [];

      if (req.body.filters) {
        const { title } = req.body.filters;

        if (title) {
          query += ` AND title LIKE ?`;
          totalCountQuery += ` AND title LIKE ?`;
          params.push(`%${title}%`);
        }
      }

      const offset = (page - 1) * limit;

      query += ` ORDER BY ${orderBy} ${order} LIMIT ? OFFSET ?`;
      params.push(limit, offset);

      const { rows } = await db.query(query, params);
      const { rows: totalCountRows } = await db.query(totalCountQuery, params.slice(0, params.length - 2));

      const data = rows.map((row) => ({
        ...row,
        author: `${row.first_name} ${row.last_name}`,
      }));

      return res.status(200).json({
        status: true,
        data,
        pagination: { page, limit, orderBy, order, total: parseInt(totalCountRows[0].count) },
      });
    } catch (ex) {
      Logger.error("Ocorreu um erro ao buscar as notícias.", ex);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Erro Interno do Servidor", message: ex.message });
    }
  }

  static async getNews(req, res, next) {
    try {
      const newsId = req.params.id;

      const query = `
      SELECT *
      FROM news
      WHERE id = ?
    `;

      const result = await db.query(query, [newsId]);

      if (result.rows.length === 0) {
        return res.status(200).json({ status: false, message: "Notícia não encontrada." });
      }

      return res.status(200).json({ status: true, data: result.rows[0] });
    } catch (ex) {
      Logger.error("Ocorreu um erro ao buscar a notícia.", ex);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Erro Interno do Servidor", message: ex.message });
    }
  }

  static async updateNews(req, res, next) {
    try {
      const newsId = req.params.id;

      const findNewsQuery = `
        SELECT * FROM news WHERE id = ?
      `;
      const newsResult = await db.query(findNewsQuery, [newsId]);

      if (newsResult.rows.length === 0) {
        return res.status(404).json({ status: false, message: "Notícia não encontrada." });
      }

      const currentIsActive = newsResult.rows[0].is_active;
      const newIsActive = currentIsActive === 1 ? 0 : 1;

      const updateQuery = `
        UPDATE news SET is_active = ? WHERE id = ?
      `;
      await db.query(updateQuery, [newIsActive, newsId]);

      return res.status(200).json({ status: true, message: "Notícia atualizada com sucesso." });
    } catch (ex) {
      Logger.error("Ocorreu um erro ao atualizar a notícia.", ex);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Erro Interno do Servidor", message: ex.message });
    }
  }

  static async deleteNews(req, res, next) {
    try {
      const newsId = req.params.id;

      const query = `
      DELETE FROM news
      WHERE id = ?
    `;

      const { rows } = await db.query(query, [newsId]);

      if (rows.length === 0) {
        return res.status(200).json({ status: false, message: "Notícia não encontrada." });
      }

      const storagePath = path.join(__dirname, "../uploads", newsId.toString());

      if (fs.existsSync(storagePath)) {
        if (fs.lstatSync(storagePath).isDirectory()) {
          fs.rmdirSync(storagePath, { recursive: true });
        } else {
          Logger.error(`O caminho ${storagePath} não é um diretório.`);
        }
      }

      return res.status(200).json({ status: true, message: "Notícia eliminada com sucesso." });
    } catch (ex) {
      Logger.error("Ocorreu um erro ao eliminar a notícia.", ex);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Erro Interno do Servidor", message: ex.message });
    }
  }
}

module.exports = NewsController;
