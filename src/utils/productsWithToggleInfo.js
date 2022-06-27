import { ToggleModel } from "../db/mongodb/schemas/toggle.js";

const productsWithToggleInfo = async (userId, arr) => {
  const toggleInfo = await ToggleModel.findOne({ userId });

  if (!toggleInfo) {
    const errorMessage =
      "userId에 대한 토글 데이터가 없습니다. 다시 한 번 확인해 주세요.";
    return { errorMessage };
  }

  const toggleList = toggleInfo.products;
  let answer = arr.map((v) => {
    if (toggleList.includes(v._id)) {
      v["toggle"] = 1;
    } else {
      v["toggle"] = 0;
    }
    return v;
  });

  return answer;
};

export { productsWithToggleInfo };
