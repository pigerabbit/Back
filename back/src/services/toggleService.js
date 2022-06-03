import { Toggle } from "../db";
import crypto from "crypto";
import { ToggleModel } from "../db/schemas/toggle";

class toggleService {
  static async addToggle({ userId }) {
    const existToggleInfo = await Toggle.findByUserId({ userId });
    if (existToggleInfo) {
      const errorMessage = "user_id에 대한 toggleInfo가 이미 존재합니다.";
      return { errorMessage };
    }

    const toggleId = crypto.randomUUID();

    const newUser = { userId, toggleId };
    const toggleInfo = await Toggle.create({ newUser });

    return toggleInfo;
  }

  static async setToggleGroup({ userId, toUpdate }) {
    let toggleInfo = await Toggle.findByUserId({ userId });

    if (!toggleInfo) {
      const errorMessage =
        "정보가 없습니다. user_id 값을 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    let groupsInfo = toggleInfo.groups;
    let newValue = {};
    const index = groupsInfo.findIndex((f) => f === toUpdate.groupId);
    if (index > -1) {
      groupsInfo.splice(index, 1);
    } else {
      groupsInfo.push(toUpdate.groupId);
    }
    newValue = groupsInfo;
    const updatedToggle = await ToggleModel.findOneAndUpdate(
      { userId },
      { $set: { groups: newValue } },
      { returnOriginal: false }
    );

    return updatedToggle;
  }

  static async setToggleProduct({ userId, toUpdate }) {
    let toggleInfo = await Toggle.findByUserId({ userId });

    if (!toggleInfo) {
      const errorMessage =
        "정보가 없습니다. user_id 값을 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    let productsInfo = toggleInfo.products;
    let newValue = {};
    const index = productsInfo.findIndex((f) => f === toUpdate.productId);
    if (index > -1) {
      productsInfo.splice(index, 1);
    } else {
      productsInfo.push(toUpdate.productId);
    }
    newValue = productsInfo;
    const updatedToggle = await ToggleModel.findOneAndUpdate(
      { userId },
      { $set: { products: newValue } },
      { returnOriginal: false }
    );

    return updatedToggle;
  }
}

export { toggleService };
