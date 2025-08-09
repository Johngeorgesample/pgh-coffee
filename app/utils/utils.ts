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

const parseYMDLocal = (ymd: string) => {
  const [y, m, d] = ymd.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const fmtYMD = (ymd?: string) =>
  ymd
    ? new Intl.DateTimeFormat(undefined, { dateStyle: 'short' }).format(parseYMDLocal(ymd))
    : ''
