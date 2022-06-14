import { addressToXY } from "../utils/addressToXY.js";

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
}

export { locationController };