const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const db = require("../config/db");
const Logger = require("../utils/logger");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

class UserController {
  static generateAccessToken(user) {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      Logger.error("JWT_SECRET is not defined in the environment.");
    }

    return jwt.sign(user, secret, { expiresIn: "30d" });
  }

  static removePassword(user) {
    const { password, ...rest } = user;
    return rest;
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(200).json({
          status: false,
          error: "Pedido inválido",
          message: "Email e palavra-passe são obrigatórios",
        });
      }

      const query = "SELECT * FROM users WHERE email = ?";
      const { rows } = await db.query(query, [email]);

      if (rows.length === 0) {
        return res.status(200).json({
          status: false,
          error: "Não autorizado",
          message: "Email ou palavra-passe incorretos",
        });
      }

      const user = rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(200).json({
          status: false,
          error: "Não autorizado",
          message: "Email ou palavra-passe incorretos",
        });
      }

      const accessToken = UserController.generateAccessToken(UserController.removePassword(user));

      return res.json({
        status: true,
        user: UserController.removePassword(user),
        accessToken,
      });
    } catch (ex) {
      Logger.error("Erro durante o login.", ex);
      res.status(500).json({ error: "Erro interno do servidor", message: ex.message });
    }
  }

  static async register(req, res) {
    try {
      const { email, password, phone, fullname, avatar, birthdate, user_type, is_subscribed_to_newsletter, has_fees_paid, fee_expiration_date, username } = req.body;

      if (!email || !password) {
        return res.status(200).json({
          status: false,
          error: "Pedido inválido",
          message: "Email e palavra-passe são obrigatórios",
        });
      }

      const emailQuery = "SELECT * FROM users WHERE email = ?";
      const { rows: emailRows } = await db.query(emailQuery, [email]);

      if (emailRows.length > 0) {
        return res.status(200).json({
          error: "Pedido inválido",
          message: "Email já em utilização",
        });
      }

      if (phone) {
        const phoneQuery = "SELECT * FROM users WHERE phone = ?";
        const { rows: phoneRows } = await db.query(phoneQuery, [phone]);
        if (phoneRows.length > 0) {
          return res.status(200).json({
            error: "Pedido inválido",
            message: "Número de telemóvel já em utilização",
          });
        }
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const formattedBirthdate = birthdate ? new Date(birthdate).toISOString().slice(0, 19).replace("T", " ") : null;

      const insertQuery = `
        INSERT INTO users (
          email, username, password, phone, fullname, avatar, birthdate,
          user_type, is_subscribed_to_newsletter, has_fees_paid, fee_expiration_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const result = await db.query(insertQuery, [
        email,
        username,
        hashedPassword,
        phone || null,
        fullname,
        avatar,
        formattedBirthdate,
        user_type,
        is_subscribed_to_newsletter ? 1 : 0,
        has_fees_paid ? 1 : 0,
        fee_expiration_date || null,
      ]);

      const newUser = {
        id: result.rows.insertId,
        username,
        email,
        phone,
        fullname,
        avatar,
        birthdate,
        user_type,
        is_subscribed_to_newsletter,
        has_fees_paid,
        fee_expiration_date,
      };

      const accessToken = UserController.generateAccessToken(newUser);

      return res.status(201).json({
        status: true,
        user: newUser,
        accessToken,
      });
    } catch (ex) {
      Logger.error("Erro durante o registo.", ex);
      res.status(500).json({ error: "Erro interno do servidor", message: ex.message });
    }
  }

  static async getSingleUser(req, res) {
    try {
      const { id } = req.params;
      if (!id || isNaN(parseInt(id))) {
        return res.status(200).json({ error: "ID de utilizador inválido" });
      }

      const query = "SELECT * FROM users WHERE user_id = ?";
      const { rows } = await db.query(query, [id]);

      if (rows.length === 0) {
        return res.status(200).json({ error: "Utilizador não encontrado" });
      }

      return res.status(200).json(UserController.removePassword(rows[0]));
    } catch (ex) {
      Logger.error(`Erro ao obter utilizador com ID ${req.params.id}.`, ex);
      res.status(500).json({ error: "Erro interno do servidor", message: ex.message });
    }
  }

  static async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 15, orderBy = "user_id", order = "ASC" } = req.body.pagination || {};

      const offset = (page - 1) * limit;
      const baseQuery = "SELECT * FROM users";
      const paginationQuery = `${baseQuery} ORDER BY ${orderBy} ${order} LIMIT ? OFFSET ?`;

      const { rows: users } = await db.query(paginationQuery, [limit, offset]);
      const { rows: countResult } = await db.query("SELECT COUNT(*) as count FROM users");

      return res.status(200).json({
        status: true,
        data: users.map(UserController.removePassword),
        pagination: {
          page,
          limit,
          orderBy,
          order,
          total: parseInt(countResult[0].count),
        },
      });
    } catch (ex) {
      Logger.error("Erro ao obter todos os utilizadores.", ex);
      res.status(500).json({ error: "Erro interno do servidor", message: ex.message });
    }
  }

  static async deleteUser(req, res, next) {
  const userId = req.params.id;

  try {
    if (req.user.user_type !== "admin") {
      return res.status(200).json({ status: false, error: "Proibido", message: "Apenas administradores podem eliminar utilizadores" });
    }

    const deleteQuery = "DELETE FROM users WHERE user_id = ?";
    const { rows } = await db.query(deleteQuery, [userId]);

    if (rows.length === 0) {
      return res.status(200).json({ status: false, error: "Não Encontrado", message: "Utilizador não encontrado" });
    }

    return res.status(200).json({
      status: true,
      message: "Utilizador eliminado com sucesso",
    });
  } catch (ex) {
    Logger.error("Ocorreu um erro ao eliminar o utilizador.", ex);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Erro Interno do Servidor", message: ex.message });
  }
}

  static async updateUser(req, res, next) {
  const userId = req.params.id;
  const { email, fullname, birthdate, user_type = "player", phone } = req.body;

  try {
    if (!req.body) {
      return res.json({ status: false, error: "Pedido Inválido", message: "O corpo do pedido está em falta" });
    }

    if (req.user.user_type !== "admin") {
      return res.json({ status: false, error: "Proibido", message: "Apenas administradores podem atualizar utilizadores" });
    }

    const checkEmailQuery = "SELECT * FROM users WHERE email = ? AND user_id != ?";
    const { rows: emailRows } = await db.query(checkEmailQuery, [email, userId]);

    if (emailRows.length > 0) {
      return res.json({ status: false, error: "Conflito", message: "O email já está em uso" });
    }

    const checkUserQuery = "SELECT * FROM users WHERE user_id = ?";
    const { rows: userRows } = await db.query(checkUserQuery, [userId]);

    if (userRows.length === 0) {
      return res.json({ status: false, error: "Não Encontrado", message: "Utilizador não encontrado" });
    }

    const updateQuery = `
    UPDATE users
    SET email = ?, fullname = ?, phone = ?, birthdate = ?, user_type = ?
    WHERE user_id = ?
  `;
    const formattedBirthdate = birthdate ? new Date(birthdate).toISOString().slice(0, 19).replace("T", " ") : null;
    await db.query(updateQuery, [email, fullname, phone, formattedBirthdate, user_type, userId]);

    return res.status(200).json({
      status: true,
      user: {
        email,
        fullname,
        phone,
        birthdate,
        user_type,
        id: userId,
      },
      message: "Utilizador atualizado com sucesso",
    });
  } catch (ex) {
    Logger.error("Ocorreu um erro ao atualizar o utilizador.", ex);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Erro Interno do Servidor", message: ex.message });
  }
}

  static async updateOwnUser(req, res, next) {
  const userId = req.params.id;
  const { email, fullname, birthdate, password } = req.body;

  try {
    if (parseInt(req.user.id) !== parseInt(userId)) {
      return res.status(200).json({ error: "Permissão Negada", message: "Não tem permissão para atualizar este utilizador" });
    }

    if (!email && !fullname && !birthdate && !password) {
      return res.status(200).json({ error: "Pedido Inválido", message: "Nenhum dado novo fornecido para atualização" });
    }

    if (email) {
      const checkEmailQuery = "SELECT * FROM users WHERE email = ? AND user_id != ?";
      const { rows: emailRows } = await db.query(checkEmailQuery, [email, userId]);

      if (emailRows.length > 0) {
        return res.status(200).json({ error: "Conflito", message: "O email já está em uso por outro utilizador" });
      }
    }

    const updateFields = [];
    const updateValues = [];

    if (email) {
      updateFields.push("email = ?");
      updateValues.push(email);
    }
    if (fullname) {
      updateFields.push("fullname = ?");
      updateValues.push(fullname);
    }
    if (birthdate) {
      updateFields.push("birthdate = ?");
      const formattedBirthdate = new Date(birthdate).toISOString().slice(0, 19).replace("T", " ");
      updateValues.push(formattedBirthdate);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.push("password = ?");
      updateValues.push(hashedPassword);
    }

    if (updateFields.length > 0) {
      updateValues.push(userId);

      const updateQuery = `
        UPDATE users
        SET ${updateFields.join(", ")}
        WHERE user_id = ?
      `;
      await db.query(updateQuery, updateValues);

      return res.status(200).json({ status: true, message: "Configurações atualizadas com sucesso" });
    } else {
      return res.status(200).json({ error: "Pedido Inválido", message: "Nenhum dado novo fornecido para atualização" });
    }
  } catch (ex) {
    Logger.error("Ocorreu um erro ao atualizar as configurações do utilizador.", ex);
    res.status(200).json({ error: "Erro Interno do Servidor", message: ex.message });
  }
}

  static async sendMail(to, subject, text, html) {
    let transporter = nodemailer.createTransport({
      pool: true,
      host: process.env.EMAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SEND_EMAIL,
        pass: process.env.SEND_EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    let mailOptions = {
      from: `"Pro Padel" <${process.env.SEND_EMAIL}>`,
      to: to,
      subject: subject,
      text: text,
      html: html,
    };

    try {
      let info = await transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response);
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }

  static async forgotPassword(req, res) {
    const { email } = req.body;

    try {
      const query = "SELECT * FROM users WHERE email = ?";
      const { rows } = await db.query(query, [email]);

      if (rows.length === 0) {
        return res.status(200).json({ status: false, error: "Pedido Inválido", message: "Email não encontrado" });
      }

      const user = rows[0];
      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 3600000); // Token expira em 1 hora

      const updateQuery = "UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE email = ?";
      await db.query(updateQuery, [token, expires, email]);

      const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

      const subject = "Redefinição de palavra-passe";
      const text = `Foi solicitado uma redefinição de palavra-passe. Por favor, clique no link a seguir ou cole no seu navegador para concluir o processo: ${resetLink}`;
      const html = `<p>Foi solicitado uma redefinição de palavra-passe.</p><p>Por favor, clique no link a seguir ou cole no seu navegador para concluir o processo:</p><a href="${resetLink}">${resetLink}</a>`;

      // Enviar email omitido por simplicidade
      await UserController.sendMail(email, subject, text, html);

      return res.status(200).json({ status: true, message: "Link de redefinição de palavra-passe enviado para o email" });
    } catch (error) {
      Logger.error("Erro ao enviar link de redefinição de palavra-passe", error);
      return res.status(500).json({ error: "Erro Interno do Servidor", message: error.message });
    }
  }

  static async resetPassword(req, res) {
    const { token, newPassword } = req.body;

    try {
      const query = "SELECT * FROM users WHERE reset_password_token IS NOT NULL AND reset_password_expires > NOW()";
      const { rows } = await db.query(query);

      if (rows.length === 0) {
        return res.status(200).json({ status: false, error: "Pedido Inválido", message: "Token inválido ou expirado" });
      }

      const user = rows[0];

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updateQuery = "UPDATE users SET password = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE user_id = ?";
      await db.query(updateQuery, [hashedPassword, user.user_id]);

      return res.status(200).json({ status: true, message: "Palavra-passe redefinida com sucesso" });
    } catch (error) {
      Logger.error("Erro ao redefinir palavra-passe", error);
      return res.status(500).json({ error: "Erro Interno do Servidor", message: error.message });
    }
  }

  static async checkToken(req, res) {
    const { token } = req.params;
    try {
      // Verifica se o token foi fornecido
      if (!token) {
        return res.status(200).json({ status: false, message: "Token não fornecido" });
      }

      const query = "SELECT * FROM users WHERE reset_password_token = ? AND reset_password_expires > NOW()";
      const { rows } = await db.query(query, [token]);

      // Se não houver usuário com o token válido
      if (rows.length === 0) {
        return res.status(200).json({ status: false, message: "Token inválido ou expirado" });
      }

      // Se o token for encontrado e não expirou
      return res.status(200).json({ status: true, message: "Token válido" });
    } catch (error) {
      Logger.error("Erro ao verificar o token", error);
      return res.status(500).json({ error: "Erro Interno do Servidor", message: error.message });
    }
  }
}

module.exports = UserController;
