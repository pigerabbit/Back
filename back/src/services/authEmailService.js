import { AuthEmail } from "../db";
import sendMail from "../utils/send-mail";
import { generateRandomNumberString } from "../utils/authEmail.js";

class authEmailService {
  static async addAuthEmail({ email }) {
    const authEmail = await AuthEmail.findByEmail({ email });
    const activateKey = generateRandomNumberString(6);
    let resultAuthEmail;
    if (!authEmail) {
      //기존에  authEmail없다면 새로운것을 만든다.
      resultAuthEmail = await AuthEmail.create({
        email,
        status: 0,
        activateKey,
      });
    } else {
      // 이미 존재한다면 활성화상태는 0,activateKey는 최신것으로 한꺼번에 업데이트하라.
      const setter = {};
      setter.status = 0;
      setter.activateKey = activateKey;
      resultAuthEmail = await AuthEmail.updateAll({
        email,
        setter,
      });
    }
    const message = sendMail(
      email,
      "인증번호입니다.",
      `인증번호는 ${activateKey}입니다.`
    );
    return resultAuthEmail;
  }
  static async activateAuthEmail({ email, userKey }) {
    const authEmail = await AuthEmail.findByEmail({ email });
    if (!authEmail) {
      const errorMessage = "인증번호를 먼저 발급해주세요";
      return { errorMessage };
    }
    if (userKey === authEmail.activateKey) {
      const setter = {};
      setter.status = 1;
      const resultAuthEmail = await AuthEmail.updateAll({
        email,
        setter,
      });
      return resultAuthEmail;
    } else {
      const errorMessage = "인증번호가 일치하지 않습니다.";
      return { errorMessage };
    }
  }
}

export { authEmailService };
