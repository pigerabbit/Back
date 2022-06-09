import fetch from "node-fetch";
import "dotenv/config";

export async function addressToXY(address) {
  const response = await fetch(
    "https://dapi.kakao.com/v2/local/search/address.json?query=" + `${address}`,
    {
      method: "POST",
      headers: {
        Authorization: process.env.KakaoAK,
      },
    }
  );
  const data = await response.json();
  const x = data?.documents?.[0]?.address?.x ?? null;
  const y = data?.documents?.[0]?.address?.y ?? null;

  if (x === null || y === null) {
    throw Error("fetch error 또는 wrong address");
  }

  return [x, y];
}
