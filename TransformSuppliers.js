export function transformSupplierAcme(data) {
  return {
    id: data.Id,
    destination_id: data.DestinationId,
    name: data.Name,
    location: {
      lat: data.Latitude,
      lng: data.Longitude,
      address: `${data.Address}, ${data.PostalCode}`,
      city: data.City,
      country: data.Country,
    },
    description: data.Description,
    amenities: {
      general: data.Facilities,
      room: null,
    },
    images: {
      rooms: null,
      site: null,
      amenities: null,
    },
    booking_conditions: [],
  };
}

export function transformSupplierPatagonia(data) {
  return {
    id: data.id,
    destination_id: data.destination,
    name: data.name,
    location: {
      lat: data.lat,
      lng: data.lng,
      address: data.address,
      city: null,
      country: null,
    },
    description: data.info,
    amenities: {
      general: data.amenities,
      room: null,
    },
    images: {
      rooms: data.images?.rooms?.map((img) => ({
        link: img.url,
        description: img.description,
      })),
      amenities: data.images?.amenities?.map((img) => ({
        link: img.url,
        description: img.description,
      })),
      site: null,
    },
    booking_conditions: [],
  };
}
export function transformSupplierPaperflies(data) {
  return {
    id: data.hotel_id,
    destination_id: data.destination_id,
    name: data.hotel_name,
    location: {
      lat: null,
      lng: null,
      address: data.location?.address,
      city: null,
      country: data.location?.country,
    },
    description: data.details,
    amenities: {
      general: data.amenities?.general,
      room: data.amenities?.room,
    },
    images: {
      rooms: data.images?.rooms?.map((img) => ({
        link: img.link,
        description: img.caption,
      })),
      site: data.images?.site?.map((img) => ({
        link: img.link,
        description: img.caption,
      })),
      amenities: null,
    },
    booking_conditions: data.booking_conditions,
  };
}
