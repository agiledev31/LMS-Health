const fs = require("fs");
const express = require("express");
const cors = require("cors");
const path = require("path");
const { auth } = require("express-oauth2-jwt-bearer");
require("dotenv").config();
const app = express();

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

require("./config/db");

const authRouter = require("./routes/auth");
const matiereRouter = require("./routes/matiere");
const itemRouter = require("./routes/item");
const sessionRouter = require("./routes/session");
const tagRouter = require("./routes/tag");
const questionRouter = require("./routes/question");
const dpRouter = require("./routes/dp");
const answerRouter = require("./routes/answer");
const progressRouter = require("./routes/progress");
const cardRouter = require("./routes/card");
const playlistRouter = require("./routes/playlist");
const quickAccessRouter = require("./routes/quickaccess");
const statusRouter = require("./routes/status");
const reportRouter = require("./routes/report");
const scheduleRouter = require("./routes/schedule");
const annalesRouter = require("./routes/annales");
const historyRouter = require("./routes/past_exams");

app.use(express.json({ limit: 10000000 }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*", credentials: false }));

const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_DOMAIN,
  tokenSigningAlg: "RS256",
});

// enforce on all endpoints
app.use(jwtCheck);

app.get("/api", function (req, res) {
  res.json({ status: "Server Running ...." });
});

app.use("/api/auth", authRouter);

app.use("/api/annales", annalesRouter);
app.use("/api/matiere", matiereRouter);
app.use("/api/item", itemRouter);
app.use("/api/status", statusRouter);
app.use("/api/report", reportRouter);
app.use("/api/session", sessionRouter);
app.use("/api/tag", tagRouter);
app.use("/api/question", questionRouter);
app.use("/api/dp", dpRouter);
app.use("/api/card", cardRouter);
app.use("/api/playlist", playlistRouter);
app.use("/api/quickaccess", quickAccessRouter);
app.use("/api/answer", answerRouter);
app.use("/api/progress", progressRouter);
app.use("/api/schedule", scheduleRouter);
app.use("/api/history", historyRouter);

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server is running on port: ${port}`));
