const mongoose = require('mongoose');

const appSettingsSchema = new mongoose.Schema(
    {
        maintenanceMode: {
            type: Boolean,
            default: false,
        },
        rideBookingEnabled: {
            type: Boolean,
            default: true,
        },
        driverRegistrationEnabled: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        collection: 'app_settings',
    }
);

module.exports = mongoose.model('AppSettings', appSettingsSchema);
