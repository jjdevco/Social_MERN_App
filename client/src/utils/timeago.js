import * as timeago from "timeago.js";

const locale = function (number, index, totalSec) {
  return [
    ["now", "right now"],
    ["%ss", "in %s seconds"],
    ["1min", "in 1 minute"],
    ["%smin", "in %s minutes"],
    ["1h", "in 1 hour"],
    ["%sh", "in %s hours"],
    ["1d", "in 1 day"],
    ["%sd", "in %s days"],
    ["1w", "in 1 week"],
    ["%sw", "in %s weeks"],
    ["1m", "in 1 month"],
    ["%sm", "in %s months"],
    ["1y", "in 1 year"],
    ["%sy", "in %s years"],
  ][index];
};

timeago.register("en_EN", locale);

const format = (date) => timeago.format(date, "en_EN");

export default format;
