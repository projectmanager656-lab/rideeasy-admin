const {
  userNeedsFemaleDriver,
  buildDriverGenderFilter,
  getNearestPoliceStation,
} = require('../../utils/rideAllocationRules');

describe('ride allocation safety rules', () => {
  test('female riders of bike rides require female drivers only', () => {
    expect(userNeedsFemaleDriver('female', 'BIKE')).toBe(true);
    expect(userNeedsFemaleDriver('male', 'BIKE')).toBe(false);
    expect(userNeedsFemaleDriver('female', 'CAR')).toBe(false);
  });

  test('driver filter prefers female drivers only when required', () => {
    expect(buildDriverGenderFilter('female', 'BIKE')).toEqual({ gender: 'female' });
    expect(buildDriverGenderFilter('male', 'BIKE')).toEqual({});
    expect(buildDriverGenderFilter('female', 'CAR')).toEqual({});
  });

  test('nearest police station resolves by shortest distance', () => {
    const stations = [
      { name: 'Kolhapur City Police', phone: '100', location: { lat: 16.704987, lng: 74.243257 } },
      { name: 'Shahupuri Police Station', phone: '0231-2644444', location: { lat: 16.698298, lng: 74.21489 } },
    ];

    expect(getNearestPoliceStation({ lat: 16.7001, lng: 74.2200 }, stations).name).toBe('Shahupuri Police Station');
  });
});
