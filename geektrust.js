const fs = require("fs"),
  filename = process.argv[2],
  dayjs = require("dayjs"),
  customParseFormat = require("dayjs/plugin/customParseFormat"),
  { runner } = require("./helpers"),
  TOPUP_COST_FOUR_DEVICES = 50,
  TOPUP_COST_TEN_DEVICES = 100,
  MUSIC_PERSONAL_PLAN_COST = 100,
  MUSIC_PREMIUM_PLAN_COST = 250,
  VIDEO_PERSONAL_PLAN_COST = 200,
  VIDEO_PREMIUM_PLAN_COST = 500,
  PODCAST_PERSONAL_PLAN_COST = 100,
  PODCAST_PREMIUM_PLAN_COST = 300;

dayjs.extend(customParseFormat);

fs.readFile(filename, "utf8", (err, data) => {
  if (err) throw err;
  let inputLines = data.toString().split("\n");
  // console.log(inputLines)

  let startDate,
    subscriptions = [],
    topups = [],
    amount = 0,
    isDateValid = true,
    outputString = "";

  // Add your code here to process input commands

  for (const line of inputLines) {
    if (line.startsWith("START_SUBSCRIPTION")) {
      // checks for valid date
      if (!dayjs(line.split(" ")[1], "DD-MM-YYYY", true).isValid()) {
        console.error("INVALID_DATE");
        isDateValid = false;
      }

      // date parsing
      if (isDateValid) {
        let date = line.split(" ")[1].split("-");
        startDate = new Date(
          parseInt(date[2]),
          parseInt(date[1]),
          parseInt(date[0])
        );
      }
    }

    if (line.startsWith("ADD_SUBSCRIPTION")) {
      let category = line.split(" ")[1],
        type = line.split(" ")[2];

      if (subscriptions.includes(category)) {
        console.log("ADD_SUBSCRIPTION_FAILED DUPLICATE_CATEGORY");
      } else {
        let result;
        switch (category) {
          case "MUSIC":
            result = runner(
              isDateValid,
              category,
              type,
              startDate,
              MUSIC_PERSONAL_PLAN_COST,
              MUSIC_PREMIUM_PLAN_COST
            );
            amount += result.amount;
            outputString += result.output;
            break;

          case "VIDEO":
            result = runner(
              isDateValid,
              category,
              type,
              startDate,
              VIDEO_PERSONAL_PLAN_COST,
              VIDEO_PREMIUM_PLAN_COST
            );
            amount += result.amount;
            outputString += result.output;
            break;

          case "PODCAST":
            result = runner(
              isDateValid,
              category,
              type,
              startDate,
              PODCAST_PERSONAL_PLAN_COST,
              PODCAST_PREMIUM_PLAN_COST
            );
            amount += result.amount;
            outputString += result.output;
            break;
        }
        isDateValid ? subscriptions.push(category) : null;
      }
    }

    if (line.startsWith("ADD_TOPUP")) {
      let devices = line.split(" ")[1],
        months = line.split(" ")[2];

      if (topups.length > 0) {
        console.log("ADD_TOPUP_FAILED DUPLICATE_TOPUP");
      } else if (!isDateValid) {
        console.log("ADD_TOPUP_FAILED INVALID_DATE");
      } else {
        switch (devices) {
          case "FOUR_DEVICE":
            amount += TOPUP_COST_FOUR_DEVICES * months;
            break;

          case "TEN_DEVICE":
            amount += TOPUP_COST_TEN_DEVICES * months;
            break;
        }
        topups.push(devices);
      }
    }

    if (line.startsWith("PRINT_RENEWAL_DETAILS")) {
      if (subscriptions.length === 0) {
        console.log("SUBSCRIPTIONS_NOT_FOUND");
        return;
      } else {
        console.log(outputString + "RENEWAL_AMOUNT " + `${amount}`);
      }
    }
  }
});
