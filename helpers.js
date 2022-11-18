const dayjs = require("dayjs"),
  customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

module.exports = {
  runner: (category, date, monthToAdd, daysToSubtract) => {
    console.log(
      "RENEWAL_REMINDER " +
        category +
        " " +
        `${dayjs(date)
          .add(monthToAdd, "month")
          .subtract(daysToSubtract, "days")
          .format("DD-MM-YYYY")}`
    );
    return 0
  },
};
