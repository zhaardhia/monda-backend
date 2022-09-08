require("dotenv").config();

const express = require("express");
const app = express();
const morganBody = require("morgan-body");
const routes = require("./routes");
const cors = require("cors");

app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(express.json({ limit: "5mb" }));
app.use(cors())

morganBody(app);
app.use((error, req, res, next) => {
  return error instanceof SyntaxError
    ? res.status(500).send({ message: "Invalid data structure" })
    : next();
});
app.disable("x-powered-by");
app.use(routes);

const PORT = process.env.SERVICE_PORT || 8080;
const SERVICE = process.env.SERVICE_NAME || "Express JS";
app.listen(PORT, () => {
  console.log(`${SERVICE} running on port ${PORT}`);
});
