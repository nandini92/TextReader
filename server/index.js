const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");

const PORT = process.env.PORT || 8000;

const app = express();

app.use(helmet());
app.use(morgan("tiny"));
app.use(express.json());

app.use(require("./textHandler"));

const server = app.listen(PORT, () => {
    console.log("🌍 Listening on port " + server.address().port);
})