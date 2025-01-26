const express = require("express");
const NewsController = require("../controllers/news");
const { authenticateToken } = require("../middleware/auth.middleware");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

const newsRoutes = express.Router();

// Rota para adicionar uma notícia
newsRoutes.post("/add", authenticateToken, upload.array("files"), NewsController.addNews);

// Rota para obter todas as notícias com paginação
newsRoutes.post("/all", authenticateToken, NewsController.getAllNews);

// Rota para obter uma notícia específica
newsRoutes.get("/:id", authenticateToken, NewsController.getNews);

// Rota para atualizar uma notícia
newsRoutes.put("/:id", authenticateToken, NewsController.updateNews);

// Rota para excluir uma notícia
newsRoutes.delete("/:id", authenticateToken, NewsController.deleteNews);

module.exports = newsRoutes;
