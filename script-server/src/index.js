"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const admin_route_1 = __importDefault(require("./routes/admin.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const payment_route_1 = __importDefault(require("./routes/payment.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)({
    origin: [process.env.FRONTEND_URL || "http://localhost:5173"],
    credentials: true,
}));
(0, db_1.default)();
app.get("/", (req, res) => {
    res.send("Welcome!");
});
// Routes
app.use("/api/auth", auth_route_1.default);
app.use("/api/admin", admin_route_1.default);
app.use("/api/user", user_route_1.default);
app.use("/api/payment", payment_route_1.default);
if (process.env.NODE_ENV !== "production") {
    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });
}
exports.default = app;
