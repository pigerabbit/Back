export function getRequiredInfoFromData(data) {
  return {
    id: data.id,
    email: data.email,
    name: data.name,
    address: data.address,
    nickname: data.nickname,
    seller: data.seller,
    businessName: data.businessName,
    location: data.location,
    distance: data.distance,
    type: data.type,
    imageLink: data.imageLink,
    reportedBy: data.reportedBy,
    alert: data.alert,
  };
}
