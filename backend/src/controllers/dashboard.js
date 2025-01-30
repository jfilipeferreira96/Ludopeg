const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const db = require("../config/db");
const Logger = require("../utils/logger");

class DashboardController {
  static async GetAllEntries(req, res) {
    try {
      const { page = 1, limit = 15, orderBy = "e.entry_time", order = "ASC" } = req.body.pagination || {};

      let query = `
      SELECT e.entry_id, e.user_id, e.entry_time, e.validated_by, e.validated_at,  
            u.email AS user_email, u.fullname AS user_fullname, u.phone, u.username AS user_username,
            a.email AS admin_email, a.fullname AS admin_fullname
      FROM entries e
      LEFT JOIN users u ON e.user_id = u.user_id
      LEFT JOIN users a ON e.validated_by = a.user_id
      WHERE 1 = 1
    `;

      let totalCountQuery = `
      SELECT COUNT(*) AS count
      FROM entries e
      LEFT JOIN users u ON e.user_id = u.user_id
      LEFT JOIN users a ON e.validated_by = a.user_id
      WHERE 1 = 1
    `;

      const params = [];

      if (req.body.entry_id !== undefined) {
        query += ` AND e.entry_id = ?`;
        totalCountQuery += ` AND e.entry_id = ?`;
        params.push(req.body.entry_id);
      }

      if (req.body.filters) {
        const { email, username, phone, validated_by } = req.body.filters;
        const searchValue = email || username || phone;
        if (searchValue) {
          query += ` AND (u.email LIKE ? OR u.phone LIKE ? OR u.username LIKE ?)`;
          totalCountQuery += ` AND (u.email LIKE ? OR u.phone LIKE ? OR u.username LIKE ?)`;
          const searchPattern = `%${searchValue}%`;
          params.push(searchPattern, searchPattern, searchPattern);
        }

        if (validated_by !== undefined && validated_by === false) {
          query += ` AND e.validated_by IS NOT NULL`;
          totalCountQuery += ` AND e.validated_by IS NOT NULL`;
        }

        if (validated_by !== undefined && validated_by === true) {
          query += ` AND e.validated_by IS NULL`;
          totalCountQuery += ` AND e.validated_by IS NULL`;
        }
      }

      const offset = (page - 1) * limit;

      query += ` ORDER BY ${orderBy} ${order} LIMIT ? OFFSET ?`;
      params.push(limit, offset);

      const result = await db.query(query, params);
      const totalCountResult = await db.query(totalCountQuery, params.slice(0, -2));
      const totalCount = parseInt(totalCountResult.rows[0].count);

      return res.status(200).json({
        status: true,
        data: result.rows,
        pagination: { page, limit, orderBy, order, total: totalCount },
      });
    } catch (error) {
      Logger.error("Error fetching entries:", error);
      return res.status(200).json({ status: false, message: "Error fetching entries." });
    }
  }
}

module.exports = DashboardController;
