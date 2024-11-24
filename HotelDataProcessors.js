import {
  transformSupplierAcme,
  transformSupplierPatagonia,
  transformSupplierPaperflies,
} from './TransformSuppliers.js';
import {
  combineArrays,
  combineObjects,
  combineStrings,
} from './CombineData.js';

import axios from 'axios';

//Separates a hotel's general amenities from room-specific amenities by filtering out duplicates
function categorizedAmenities(amenities) {
  const setRoom = new Set(amenities.room);
  const filteredGeneral = amenities.general
    ? amenities.general.filter((item) => !setRoom?.has(item))
    : null;
  return {
    general: filteredGeneral,
    room: amenities.room,
  };
}
//Combines multiple hotel entries with the same ID and destination ID, merging their details
export function mergeHotels(hotels) {
  const mergedHotels = {};

  hotels.forEach((hotel) => {
    const key = `${hotel.id}-${hotel.destination_id}`;

    if (!mergedHotels[key]) {
      mergedHotels[key] = hotel;
    } else {
      mergedHotels[key] = {
        ...mergedHotels[key],
        name: combineStrings(mergedHotels[key].name, hotel.name),
        location: combineObjects(mergedHotels[key].location, hotel.location),
        description: combineStrings(
          mergedHotels[key].description,
          hotel.description
        ),
        amenities: categorizedAmenities({
          general: combineArrays(
            mergedHotels[key].amenities?.general,
            hotel.amenities?.general
          ),
          room: combineArrays(
            mergedHotels[key].amenities?.room,
            hotel.amenities?.room
          ),
        }),
        images: {
          rooms: combineArrays(
            mergedHotels[key].images?.rooms,
            hotel.images?.rooms
          ),
          site: combineArrays(
            mergedHotels[key].images?.site,
            hotel.images?.site
          ),
          amenities: combineArrays(
            mergedHotels[key].images?.amenities,
            hotel.images?.amenities
          ),
        },
        booking_conditions: combineArrays(
          mergedHotels[key].booking_conditions,
          hotel.booking_conditions
        ),
      };
    }
  });

  return Object.values(mergedHotels);
}

//Transforms hotel data into a unified structure based on supplier.

function normalizeHotelData(data, supplier) {
  switch (supplier) {
    case 'SupplierAcme':
      return transformSupplierAcme(data);
    case 'SupplierPatagonia':
      return transformSupplierPatagonia(data);
    case 'SupplierPaperflies':
      return transformSupplierPaperflies(data);
    default:
      throw new Error('Unknown supplier');
  }
}

// Fetches hotel data from multiple suppliers' APIs, normalizes it, and consolidates it into a single array.
export async function fetchData() {
  const urls = new Map([
    [
      'SupplierAcme',
      'https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/acme',
    ],
    [
      'SupplierPatagonia',
      'https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/patagonia',
    ],
    [
      'SupplierPaperflies',
      'https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/paperflies',
    ],
  ]);

  const results = await Promise.all(
    Array.from(urls.entries()).map(async ([supplier, url]) => {
      try {
        const response = await axios.get(url);

        if (Array.isArray(response.data)) {
          return response.data.map((item) =>
            normalizeHotelData(item, supplier)
          );
        } else {
          console.error(`Data from ${supplier} is not an array`);
          return [];
        }
      } catch (error) {
        console.error(`Failed to fetch data from ${supplier}:`, error.message);
        return [];
      }
    })
  );

  return results.flat();
}

// Filter hotels based on arguments
export function filterHotels(hotels, hotelIds, destinationIds) {
  const destinationIdsAsNumbers = destinationIds?.map(Number);
  if (hotelIds.length + destinationIds.length === 0) return hotels;
  return hotels.filter(
    (hotel) =>
      (!hotelIds.length || hotelIds.includes(hotel.id)) &&
      (!destinationIdsAsNumbers.length ||
        destinationIdsAsNumbers.includes(hotel.destination_id))
  );
}
