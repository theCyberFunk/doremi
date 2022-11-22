const fs = require("fs"),
  filename = process.argv[2],
  dayjs = require("dayjs"),
  customParseFormat = require("dayjs/plugin/customParseFormat"),
  { runner } = require("./helpers");

dayjs.extend(customParseFormat);

fs.readFile(filename, "utf8", (err, data) => {
  if (err) throw err;
  let inputLines = data.toString().split("\r\n");
  // console.log(inputLines)

  let startDate,
    subscriptions = [],
    topups = [],
    amount = 0;

  // Add your code here to process input commands

  for (const line of inputLines) {
    if (line.startsWith("START_SUBSCRIPTION")) {
      // checks for valid date
      if (!dayjs(line.split(" ")[1], "DD-MM-YYYY", true).isValid()) {
        console.log("ADD_SUBSCRIPTION_FAILED INVALID_DATE");
        return;
      }

      // date parsing
      let date = line.split(" ")[1].split("-");
      startDate = new Date(
        parseInt(date[2]),
        parseInt(date[1]),
        parseInt(date[0])
      );
    }

    if (line.startsWith("ADD_SUBSCRIPTION")) {
      let category = line.split(" ")[1],
        type = line.split(" ")[2];

      switch (category) {
        case "MUSIC":
          amount += runner(category, type, startDate, 100, 250);
          break;

        case "VIDEO":
          amount += runner(category, type, startDate, 200, 500);
          break;

        case "PODCAST":
          amount += runner(category, type, startDate, 100, 300);
          break;
      }
      subscriptions.push(category);
    }

    if (line.startsWith("ADD_TOPUP")) {
      let devices = line.split(" ")[1],
        months = line.split(" ")[2];

      switch (devices) {
        case "FOUR_DEVICE":
          amount += 50 * months;
          break;

        case "TEN_DEVICE":
          amount += 100 * months;
          break;
      }
    }
  }

  console.log("RENEWAL_AMOUNT " + `${amount}`);
});

// // Subscriptions existance check //
// if (!Object.keys(subsToAdd) || Object.keys(subsToAdd).length === 0) {
//   console.log("SUBSCRIPTIONS_NOT_FOUND");
//   return;
// }

// // Subscriptions duplicate check //
// let subsKeys = Object.keys(subsToAdd);
// let subsSet = new Set(subsKeys);
// if (subsKeys.length !== subsSet.length) {
//   console.log("ADD_SUBSCRIPTION_FAILED DUPLICATE_CATEGORY");
//   return;
// }

// // Topup duplicate check //
// if (Object.keys(topupToAdd).length > 1) {
//   console.log("ADD_SUBSCRIPTION_FAILED DUPLICATE_CATEGORY");
//   return;
// }
