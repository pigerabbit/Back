export function getRequiredInfoFromData(data) {
  return {
    id: data.id,
    email: data.email,
    name: data.name,
    location: data.location,
    distance: data.distance,
    business: data.business,
    type: data.type,
    imageLink: data.imageLink,
  };
}
