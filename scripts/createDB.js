const fs = require("fs");

const filePath = "dev.sqlite3";

fs.access(filePath, fs.constants.F_OK, (err) => {
  if (err) {
    // Le fichier n'existe pas, donc créer le fichier
    fs.writeFile(filePath, "", (err) => {
      if (err) {
        console.error("Error while create the file :", err);
      } else {
        console.log("The file has been successfullt created..");
      }
    });
  } else {
    console.log("dev.sqlite3 already exists.");
  }
});
