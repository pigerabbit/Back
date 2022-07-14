import moment from "moment";
import "moment-timezone";
moment.tz.setDefault("Asia/Seoul");

export function nextOneDay() {
  return moment().add(1, "days").format("YYYY-MM-DD HH:mm:ss");
}

export function nowDate() {
  return moment().format("YYYY-MM-DD HH:mm:ss");
}

export function dueDateFtn(term) {
  return moment().add(term, "days").format("YYYY-MM-DD HH:mm:ss");
}

export function getDateDiff(d1, d2) {
  const date1 = new Date(d1);
  const date2 = new Date(d2);

  const diffDate = date2.getTime() - date1.getTime();

  return diffDate;
}
