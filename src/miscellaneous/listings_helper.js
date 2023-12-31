export default class ListingsHelper {
  static extractListingParamsForSubmission(listing, edit) {
    if (!listing) {
      return {};
    }

    let submissionParams = {
      latitude: listing.location.latitude,
      longitude: listing.location.longitude,
      vehicle_variant_id: listing.variant.id,

      on_demand: listing.on_demand,
      on_demand_rates: listing.on_demand_rates,
      amenities: listing.amenities,
      price: listing.price,
      monthly_price: listing.monthly_price,
      cleaning_fee: listing.cleaning_fee,
      license_plate_number: listing.license_plate_number,
      check_in_time: listing.check_in_time,
      check_out_time: listing.check_out_time,
      rules: listing.rules
    };

    if (!edit) {
      submissionParams.images = listing.images;
    }

    return submissionParams;
  }

  static getOnDemandDistances() {
    return Array.apply(null, Array(20)).map(function (_, i) {return (i + 1) * 5;});
  }
}
