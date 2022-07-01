import { oauthService } from "../services/oauthService";
import { User } from "../db";

const oauthController = {
  login: async (req, res, next) => {
    try {
      const email = req.body.email;
      const isEmailValid = req.body.is_email_valid;

      const user = await User.findByEmail({ email });
      let newUser = "";

      if (!user) {
        // 이름, 비밀번호, 주소, 전화번호는 임시로 지정
        newUser = await oauthService.addUser({
          email,
        });
      }

      if (newUser.errorMessage) {
        throw new Error(newUser.errorMessage);
      }

      const userInfo = await oauthService.getUser({ email });

      if (userInfo.errorMessage) {
        throw new Error(userInfo.errorMessage);
      }

      const body = {
        success: true,
        payload: userInfo,
      };

      res.status(201).json(body);
    } catch (error) {
      next(error);
    }
  },
};

export { oauthController };
