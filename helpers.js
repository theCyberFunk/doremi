const dayjs = require("dayjs"),
  customParseFormat = require("dayjs/plugin/customParseFormat"),
  FREE_MONTHS_TO_ADD = 0,
  PRESONAL_MONTHS_TO_ADD = 0,
  PREMIUM_MONTHS_TO_ADD = 2,
  DAYS_TO_SUBTRACT = 10;

dayjs.extend(customParseFormat);

module.exports = {
  runner: (
    category,
    type,
    date,
    personalRenewalAmount,
    premiumRenewalAmount
  ) => {
    switch (type) {
      case "FREE":
        printer(category, date, FREE_MONTHS_TO_ADD, DAYS_TO_SUBTRACT);
        return 0;

      case "PERSONAL":
        printer(category, date, PRESONAL_MONTHS_TO_ADD, DAYS_TO_SUBTRACT);
        return personalRenewalAmount;

      case "PREMIUM":
        printer(category, date, PREMIUM_MONTHS_TO_ADD, DAYS_TO_SUBTRACT);
        return premiumRenewalAmount;
    }
  },
};

const printer = (category, date, monthToAdd, daysToSubtract) => {
  console.log(
    "RENEWAL_REMINDER " +
      category +
      " " +
      `${dayjs(date)
        .add(monthToAdd, "month")
        .subtract(daysToSubtract, "days")
        .format("DD-MM-YYYY")}`
  );
};
