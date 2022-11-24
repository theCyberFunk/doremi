const dayjs = require("dayjs"),
  customParseFormat = require("dayjs/plugin/customParseFormat"),
  FREE_MONTHS_TO_ADD = 0,
  PRESONAL_MONTHS_TO_ADD = 0,
  PREMIUM_MONTHS_TO_ADD = 2,
  DAYS_TO_SUBTRACT = 10;

dayjs.extend(customParseFormat);

module.exports = {
  runner: (
    isDateValid,
    category,
    type,
    date,
    personalRenewalAmount,
    premiumRenewalAmount
  ) => {
    if (!isDateValid) {
      console.log("ADD_SUBSCRIPTION_FAILED INVALID_DATE");
      return 0;
    } else {
      switch (type) {
        case "FREE":
          return {
            amount: 0,
            output: printer(
              category,
              date,
              FREE_MONTHS_TO_ADD,
              DAYS_TO_SUBTRACT
            ),
          };

        case "PERSONAL":
          return {
            amount: personalRenewalAmount,
            output: printer(
              category,
              date,
              PRESONAL_MONTHS_TO_ADD,
              DAYS_TO_SUBTRACT
            ),
          };

        case "PREMIUM":
          return {
            amount: premiumRenewalAmount,
            output: printer(
              category,
              date,
              PREMIUM_MONTHS_TO_ADD,
              DAYS_TO_SUBTRACT
            ),
          };
      }
    }
  },
};

const printer = (category, date, monthToAdd, daysToSubtract) => {
  return (
    "RENEWAL_REMINDER " +
    category +
    " " +
    `${dayjs(date)
      .add(monthToAdd, "month")
      .subtract(daysToSubtract, "days")
      .format("DD-MM-YYYY")}` +
    "\n"
  );
};
