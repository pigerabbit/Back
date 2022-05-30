import moment from "moment";

export function nextThreeDay() {
  return moment().add(3, "days").format("YYYY-MM-DD HH:mm:ss");
}
