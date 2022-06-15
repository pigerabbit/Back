import { UserModel } from "../db/schemas/user";
import { User } from "../db";
import { getRequiredInfoFromData } from "../utils/user";

class businessAuthService {
  static async setBusiness({ userId, toUpdate }) {
    const userInfo = await User.findById({ userId });

    if (!userInfo) {
      const errorMessage = "현재 아이디에 대한 유저 정보가 존재하지 않습니다.";
      return { errorMessage };
    }

    const businessNameList = await User.findByBusinessName({
      businessName: toUpdate.businessName,
    });

    if (businessNameList.length !== 0) { 
      const errorMessage = "이미 존재하는 상호명입니다. 다른 상호명을 입력해주십시오.";
      return { errorMessage };
    }
    
    const updatedBusiness = await UserModel.findOneAndUpdate(
      { id: userId },
      {
        $set: {
          seller: true,
          business: toUpdate,
        },
      },
      { returnOriginal: false }
    );

    const resultBusiness = getRequiredInfoFromData(updatedBusiness);
    return resultBusiness;
  }
}

export { businessAuthService };
