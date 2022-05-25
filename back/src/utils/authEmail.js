export function generateRandomNumberString(n) {
  let result = "";
  for (let v = 0; v < n; v++) {
    let number = Math.floor(Math.random() * 10);
    result += number;
  }
  return result;
}

export function getInfoFromNaver(profile) {
  const { id, nickname, profile_image, email } = profile.response;
  return { id, name: nickname, email, imageLink: profile_image };
}
export function getInfoFromKakao(profile) {
  const userProfile = profile.kakao_account.profile;
  const { nickname, profile_image_url } = userProfile;
  const email = profile.kakao_account.email;
  const id = profile.id;
  return { id, name: nickname, email, imageLink: profile_image_url };
}

export function getInfoFromGoogle(profile) {
  const { id, email, name, picture } = profile.data;
  return { id, name, email, imageLink: picture };
}
