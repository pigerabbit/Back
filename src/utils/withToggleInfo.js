export function withToggleInfo(toggleList, arr) {
  let answer = arr.map((v) => {
    if (toggleList.includes(v._id)) {
      v["toggle"] = 1;
    } else {
      v["toggle"] = 0;
    }
    return v;
  });

  return answer;
}
