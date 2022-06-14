import { businessAuthService } from "../services/businessAuthService";
import { addressToXY } from "../utils/addressToXY";
const request = require('request');
require("dotenv").config();

const businessAuthController = {
  isSeller: async (req, res, next) => { 
    const myaddr = `http://api.odcloud.kr/api/nts-businessman/v1/validate?serviceKey=${process.env.OPEN_API_SERVICE_KEY}`;
    const userId = req.currentUserId;
    const id = req.params.id;

    if (userId !== id) {
      const body = {
        success: false,
        error: "사업자 인증은 로그인한 유저, 본인만 가능합니다.",
      }

      return res.status(403).send(body);
    }

    const businessName = req.body.businessName;
    const businessLocation = req.body.businessLocation;
    const b_no = req.body.b_no;
    const p_nm = req.body.p_nm;
    const start_dt = req.body.start_dt;
    const businesses = [{
      "b_no": b_no,
      "p_nm": p_nm,
      "start_dt": start_dt,
    }];

    const options = {
      uri: myaddr,
      method: 'POST',
      body: {
        businesses: businesses,
      },
      json: true
    }

    request.post(options, async function (err, httpResponse, body) {
      if (body.data[0].valid === "01") {
        const coordinates = await addressToXY(businessLocation);
        const locationXY = {
          type: "Point",
          coordinates,
        };
        const toUpdate = {
          ownerName: p_nm,
          businessName,
          businessLocation,
          locationXY,
        };
        const newUser = await businessAuthService.setBusiness({ userId, toUpdate });
        
        if (newUser.errorMessage) {
          const body = {
            success: false,
            errorMessage: newUser.errorMessage,
          };

          return res.status(400).send(body);
        }

        const body = {
          success: true,
          message: "사업자 인증에 성공했습니다.",
          payload: newUser,
        }

        return res.status(200).send(body);
      } else {
        const body = {
          success: false,
          error: "사업자 인증에 실패했습니다.",
        }

        return res.status(400).send(body);
      }
    });
  },
}

export { businessAuthController };
