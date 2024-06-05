const fs = require("fs");
const cron = require("node-cron");
const chalk = require("chalk");
const moment = require("moment");

const axios = require("axios");

console.log(
  chalk.blue("-------------------------------------------------------------")
);
console.log(chalk.bgBlue(`CRON BERJALAN SETIAP HARI PADA JAM  11:59 | 23:59 `));
console.log(
  chalk.blue("-------------------------------------------------------------")
);

// Mendapatkan tanggal hari ini dalam format yang sesuai dengan format tanggal di
const todayDate = moment().format("YYYY-MM-DD");

cron.schedule("* * * * *", function () {
  console.log(
    chalk.bgGreen(
      "---------------------- START / CONNECTED-------------------------\n"
    )
  );

  setTimeout(() => {
    // Menjalankan fungsi untuk mengupdate status dokumen MOU
    UpdateMou();
  }, 2000);

  setTimeout(() => {
    console.log("\n");
    // Menjalankan fungsi untuk mengupdate status dokumen MOA
    UpdateMoa();
  }, 4000);

  setTimeout(() => {
    console.log(
      chalk.bgRed(
        "\n---------------------- END / DISCONNECTED-------------------------"
      )
    );
  }, 6000);
});

// Function untuk mengupdate status dokumen MOU
function UpdateMou() {
  //   let api_url = "http://localhost/LARAVEL/akamou/public/api/updateDataMou"; // lokal
  let api_url = "https://hello-ivy.id/AGUNG-MOU/public/api/updateDataMou"; // public
  axios
    .get(api_url)
    .then((response) => {
        return response
      console.log(chalk.green("MOU update response: " + response.data));
    })
    .catch((error) => {
      console.log(chalk.red("Error updating MOU: " + error.message));
    });
}

// Function untuk mengupdate status dokumen MOA
function UpdateMoa() {
  //   let api_url = "http://localhost/LARAVEL/akamou/public/api/updateDataMoa"; // lokal
  let api_url = "https://hello-ivy.id/AGUNG-MOU/public/api/updateDataMoa"; // public
  axios
    .get(api_url)
    .then((response) => {
      console.log(chalk.green("MOA update response: " + response.data));
    })
    .catch((error) => {
      console.log(chalk.red("Error updating MOA: " + error.message));
    });
}
