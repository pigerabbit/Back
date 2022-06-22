import moment from "moment";

export function nextOneDay() {
  return moment().add(1, "days").format("YYYY-MM-DD HH:mm:ss");
}

export function nowDate() {
  return moment().format("YYYY-MM-DD HH:mm:ss");
}

export function dueDateFtn(term) {
  return moment().add(term, "days").format("YYYY-MM-DD HH:mm:ss");
}
