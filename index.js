import { mergeHotels, filterHotels, fetchData } from './HotelDataProcessors.js';
// CLI Application
(async function main() {
  let hotelIds = [];
  const [hotelArg, destinationArg] = process.argv.slice(2);
  if (hotelArg && hotelArg !== 'none') {
    hotelIds = hotelArg.split(','); // Tách các ID khách sạn
  }

  let destinationIds = [];
  if (destinationArg && destinationArg !== 'none') {
    destinationIds = destinationArg.split(','); // Tách các ID điểm đến
  }

  try {
    const hotels = await fetchData();
    // console.log(
    //   'All hotels before filtering: ',
    //   JSON.stringify(hotels, null, 2)
    // );

    const filteredHotels = filterHotels(hotels, hotelIds, destinationIds);
    const mergedHotels = mergeHotels(filteredHotels);
    console.log(JSON.stringify(mergedHotels, null, 2));
  } catch (error) {
    console.error('Error fetching or processing data:', error.message);
    process.exit(1);
  }
})();
