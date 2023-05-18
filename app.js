require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const multer = require("multer")
const path = require("path")
const app = express();
const morganBody = require("morgan-body");
const routes = require("./routes");
const cors = require("cors");
app.use
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(express.json({ limit: "5mb" }));
const corsOptions = {
  origin: true, //included origin as true
  credentials: true, //included credentials as true
};
app.use(cors(corsOptions))
// app.use(cors({ credentials: true, origin: 'www' }))

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + '-' + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}
app.use('/images', express.static(path.join(__dirname, 'images')))
morganBody(app);
app.use((error, req, res, next) => {
  return error instanceof SyntaxError
    ? res.status(500).send({ message: "Invalid data structure" })
    : next();
});
app.use(cookieParser())
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'))
app.disable("x-powered-by");
app.use(routes);

const PORT = process.env.SERVICE_PORT || 8080;
const SERVICE = process.env.SERVICE_NAME || "Express JS";
app.listen(PORT, () => {
  console.log(`${SERVICE} running on port ${PORT}`);
});
