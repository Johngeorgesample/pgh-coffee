export const formatDataToGeoJSON = (shops: any[]) => {
  const myObj = {
    type: 'FeatureCollection',
    features: [],
  }

  shops.forEach(shop => {
    // @ts-ignore-next-line
    myObj.features.push({
      type: 'Feature',
      properties: {
        name: shop.name,
        neighborhood: shop.neighborhood,
        website: shop.website,
        address: shop.address,
        roaster: shop.roaster,
        photo: shop.photo,
      },
      geometry: {
        type: 'Point',
        coordinates: [shop.longitude, shop.latitude],
      },
    })
  })

  return myObj
}