const fs = require("fs"),
  filename = process.argv[2],
  dayjs = require("dayjs"),
  customParseFormat = require("dayjs/plugin/customParseFormat"),
  runner = require("./helpers").runner;

dayjs.extend(customParseFormat);

fs.readFile(filename, "utf8", (err, data) => {
  if (err) throw err;
  let inputLines = data.toString().split("\r\n");
  // console.log(inputLines)

  let startDate,
    topupToAdd = {},
    renewalAmount = 0;

  // Add your code here to process input commands
  // this loop populates the declared varibales above //
  for (const line of inputLines) {
    // console.log(line)
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
      // subsToAdd[line.split(" ")[1]] = line.split(" ")[2];
      let category = line.split(" ")[1],
        type = line.split(" ")[2];

      // console.log(category, type);
      switch (category) {
        case "MUSIC":
          switch (type) {
            case "FREE":
              console.log(runner("MUSIC", startDate, 1, 10));
              break;

            case "PERSONAL":
              renewalAmount += 100;
              console.log(runner("MUSIC", startDate, 1, 10));
            break;

            case "PREMIUM":
              renewalAmount += 250;
              console.log(runner("MUSIC", startDate, 3, 10));   
              break;
          }
          break;

        case "VIDEO":
          switch (type) {
            case "FREE":
              console.log(runner("VIDEO", startDate, 1, 10));
              break;

            case "PERSONAL":
              renewalAmount += 200;
              console.log(runner("VIDEO", startDate, 1, 10));
              break;

            case "PREMIUM":
              renewalAmount += 500;
              console.log(runner("VIDEO", startDate, 3, 10));
              break;
          }
          break;

        case "PODCAST":
          switch (type) {
            case "FREE":
              console.log(runner("PODCAST", startDate, 1, 10));
              break;

            case "PERSONAL":
              renewalAmount += 100;
              console.log(runner("PODCAST", startDate, 1, 10));
              break;

            case "PREMIUM":
              renewalAmount += 300;
              console.log(runner("PODCAST", startDate, 3, 10));
              break;
          }
          break;
      }
    }
    if (line.startsWith("ADD_TOPUP")) {
      topupToAdd[line.split(" ")[1]] = parseInt(line.split(" ")[2]);
    }
  }

  for (const key in topupToAdd) {
    switch (key) {
      case "FOUR_DEVICE":
        renewalAmount += 50 * topupToAdd[key];
        break;

      case "TEN_DEVICE":
        renewalAmount += 100 * topupToAdd[key];
        break;
    }
  }

  console.log("RENEWAL_AMOUNT " + `${renewalAmount}`);
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
