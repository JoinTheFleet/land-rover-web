export default class Constants {
  static s3BucketFolderName(folder_name) {
    return {
      user_avatar: "user_avatar_direct_upload",
      survey_issue: "survey_issue_direct_upload",
      signature_owner: "signature_owner_direct_upload",
      signature_renter: "signature_renter_direct_upload",
      listing_image: "listing_image_direct_upload",
      driver_license: "driver_license_direct_upload",
      conversation_attachment: "conversation_attachment_direct_upload",
      conversation: "conversation_direct_upload"
    }[folder_name];
  }

  static navigationSections() {
    return {
      home: 'home',
      listings: 'listings',
      profile: 'profile',
      bookings: 'bookings',
      messages: 'messages',
      account: 'account',
      logout: 'logout',
      login: 'login',
      signup: 'signup',
      calendar: 'calendar',
      dashboard: 'dashboard'
    };
  }

  static userRoles() {
    return {
      renter: 'renter',
      owner: 'owner'
    };
  }

  static listingViews() {
    return {
      index: 'index',
      view: 'view',
      new: 'new',
      edit: 'edit'
    };
  }

  static userManagementViews() {
    return {
      profile_details: {
        key: 'profile_details',
        display: 'Profile Details'
      },
      verified_info: {
        key: 'verified_info',
        display: 'Verified Info'
      },
      settings: {
        key: 'settings',
        display: 'Settings'
      },
      support: {
        key: 'support',
        display: 'Support'
      },
      t_and_cs: {
        key: 't_and_cs',
        display: "T's and C's"
      }
    }
  }

  static listingSteps() {
    return {
      registration: 'registration',
      details: 'details',
      location: 'location',
      images: 'images',
      pricing: 'pricing'
    };
  }

  static listingFiltersTypes() {
    let types = Constants.types();

    return {
      body: types.string,
      make: types.string,
      model: types.string,
      year: types.number,
      fuel: types.string,
      transmission: types.string,
      passengers: types.number,
      doors: types.number,
      amenities: types.array
    };
  }

  static listingFiltersDisplayProperties() {
    return ['body', 'name', 'display', 'fuel', 'year', 'seats', 'doors', 'transmission'];
  }

  static types() {
    return {
      string: 'string',
      number: 'number',
      boolean: 'boolean',
      array: 'array'
    };
  }

  static stepDirections() {
    return {
      next: 'next',
      previous: 'previous'
    };
  }
}
