require("dotenv-defaults").config();
require("dotenv").config();

// import app config
const app = require("./core/app");

app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://127.0.0.1:${process.env.PORT}`);
});
