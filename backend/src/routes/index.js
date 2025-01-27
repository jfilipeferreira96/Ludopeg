const express = require("express");
const path = require("path");
const { Router } = require("express");
const { authenticateToken } = require("../middleware/auth.middleware");
const UserController = require("../controllers/user");
const authRoutes = require("./user.routes");
const acessosRoutes = require("./acessos.routes");
const dashboardRoutes = require("./dashboard.routes");
const agendaRoutes = require("./agenda.routes");
const newsRoutes = require("./news.routes");

const routes = Router();

/***************** PUBLIC ROUTES *****************/
const staticHTML = (req, res) => {
  const rootPath = path.resolve(__dirname, "..", "views");
  res.sendFile("/index.html", { root: rootPath });
};
routes.get("/", staticHTML);
routes.get("/api", staticHTML);

authRoutes.post("/register", UserController.register);

authRoutes.post("/login", UserController.login);

authRoutes.post("/forgot-password", UserController.forgotPassword);
authRoutes.post("/reset-password", UserController.resetPassword);
authRoutes.get("/checktoken/:token", UserController.checkToken);

/***************** AUTH ROUTES *****************/
routes.use("/api/auth", authRoutes);

routes.use("/api/acessos", authenticateToken, acessosRoutes);
routes.use("/api/dashboard", authenticateToken, dashboardRoutes);
routes.use("/api/news", authenticateToken, newsRoutes);
routes.use("/api/agenda", authenticateToken, agendaRoutes);

routes.use("/api/uploads", express.static(path.join(__dirname, "../uploads")));

routes.get("/api/download/:folder/:filename", (req, res) => {
  const folder = req.params.folder;
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../uploads", folder, filename);

  res.download(filePath, (err) => {
    if (err) {
      console.log("Erro ao fazer o download:", err);
      res.status(404).json({ message: "Arquivo não encontrado." });
    }
  });
});

module.exports = routes;
