export function getRequiredInfoFromData(data) {
  return {
    id: data.id,
    email: data.email,
    name: data.name,
    address: data.address,
    business: data.business,
    type: data.type,
  };
}
