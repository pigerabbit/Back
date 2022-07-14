import { addressToXY } from "../utils/addressToXY.js";

/** 주소를 위도 경도로 변환해주는 함수
 * 
 * @query addrss - 주소
 */
const locationController = {
  getLocation: async (req, res, next) => {
    try {
      const address = req.query.address;
      const data = await addressToXY(address);
      const body = {
        success: true,
        payload: data,
      };

      return res.status(200).json(body);
    } catch (error) {
      next(error);
    }
  },
};

export { locationController };