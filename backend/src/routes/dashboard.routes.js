const express = require("express");
const DashboardController = require("../controllers/dashboard");

const dashboardRoutes = express.Router();

// Entradas
dashboardRoutes.post("/entries", DashboardController.GetAllEntries);

module.exports = dashboardRoutes;