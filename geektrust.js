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

      if (subscriptions.includes(category)) {
        console.log("ADD_SUBSCRIPTION_FAILED DUPLICATE_CATEGORY");
      } else {
        switch (category) {
          case "MUSIC":
            amount += runner(
              category,
              type,
              startDate,
              MUSIC_PERSONAL_PLAN_COST,
              MUSIC_PREMIUM_PLAN_COST
            );
            break;

          case "VIDEO":
            amount += runner(
              category,
              type,
              startDate,
              VIDEO_PERSONAL_PLAN_COST,
              VIDEO_PREMIUM_PLAN_COST
            );
            break;

          case "PODCAST":
            amount += runner(
              category,
              type,
              startDate,
              PODCAST_PERSONAL_PLAN_COST,
              PODCAST_PREMIUM_PLAN_COST
            );
            break;
        }
        subscriptions.push(category);
      }
    }

    if (line.startsWith("ADD_TOPUP")) {
      let devices = line.split(" ")[1],
        months = line.split(" ")[2];

      if (topups.length > 0) {
        console.log("ADD_TOPUP_FAILED DUPLICATE_TOPUP");
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
        console.log("RENEWAL_AMOUNT " + `${amount}`);
      }
    }
  }
});
