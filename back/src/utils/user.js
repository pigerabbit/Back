export function getRequiredInfoFromData(data) {
  if (data.seller) {
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      address: data.address,
      nickname: data.nickname,
      seller: data.seller,
      business: data.business,
      location: data.location,
      distance: data.distance,
      type: data.type,
      imageLink: data.imageLink,
      reportedBy: data.reportedBy,
    };
  } else {
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      address: data.address,
      nickname: data.nickname,
      seller: data.seller,
      location: data.location,
      distance: data.distance,
      type: data.type,
      imageLink: data.imageLink,
      reportedBy: data.reportedBy,
    };
  }
}
