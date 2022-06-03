import { Toggle } from "../db";
import crypto from "crypto";

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
}

export { toggleService };
