export function getRequiredInfoFromData(data) {
  return {
    id: data.id,
    email: data.email,
    name: data.name,
    address: data.address,
    business: data.business,
    location: data.location,
    distance: data.distance,
    type: data.type,
    imageLink: data.imageLink,
    reporter: data.reporter,
  };
}
