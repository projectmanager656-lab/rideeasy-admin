const express = require('express');
const { body } = require('express-validator');
const adminController = require('../controllers/admin.controller');
const auth = require('../middlewares/auth.middleware');
const { uploadComplianceDocument } = require('../middlewares/complianceUpload.middleware');

const router = express.Router();

router.post('/login',
    body('email').trim().isEmail(),
    body('password').trim().isString().isLength({ min: 1 }),
    adminController.loginAdmin
);

router.patch('/change-password', auth.authAdmin, adminController.changePassword);
router.get('/app-settings', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN'), adminController.getAppSettings);
router.put('/app-settings', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN'), adminController.updateAppSettings);
router.get('/analytics', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN', 'OPERATIONS', 'SUPPORT'), adminController.getAnalytics);
router.get('/users', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN', 'SUPPORT'), adminController.getUsers);
router.get('/drivers', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN', 'OPERATIONS', 'SUPPORT'), adminController.getDrivers);
router.put('/drivers/:id/approve', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN', 'OPERATIONS'), adminController.approveDriver);
router.put('/drivers/:id/reject', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN', 'OPERATIONS'), adminController.rejectDriver);
router.put('/drivers/:id/compliance', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN', 'OPERATIONS'), adminController.updateDriverCompliance);
router.post('/drivers/:id/compliance/upload', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN', 'OPERATIONS'), uploadComplianceDocument, adminController.uploadDriverComplianceDocument);
router.get('/drivers/:id/compliance/:documentType', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN', 'OPERATIONS', 'SUPPORT'), adminController.getDriverComplianceDocument);
router.patch('/drivers/:id/block', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN', 'OPERATIONS'), adminController.blockDriver);
router.patch('/users/:id/block', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN', 'SUPPORT'), adminController.blockUser);
router.delete('/users/:id', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN'), adminController.deleteUser);
router.delete('/drivers/:id', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN'), adminController.deleteDriver);
router.delete('/rides/:id', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN'), adminController.deleteRide);
router.get('/pricing', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN'), adminController.getPricing);
router.put('/pricing', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN'), adminController.updatePricing);
router.get('/fare-configurations', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN'), adminController.getFareConfigurations);
router.post('/fare-configurations', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN'), adminController.createFareConfiguration);
router.put('/fare-configurations/:id', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN'), adminController.updateFareConfiguration);
router.patch('/fare-configurations/:id/status', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN'), adminController.updateFareConfigurationStatus);
router.get('/fare-configurations/:id/history', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN'), adminController.getFareConfigurationHistory);
router.get('/services', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN'), adminController.getServices);
router.post('/services', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN'), adminController.createService);
router.put('/services/:id', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN'), adminController.updateService);
router.delete('/services/:id', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN'), adminController.deleteService);
router.get('/rides/:id/audit', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN', 'OPERATIONS', 'SUPPORT'), adminController.getRideAudit);
router.get('/rides', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN', 'OPERATIONS', 'SUPPORT'), adminController.getRides);
router.get('/payments', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN'), adminController.getPayments);
router.get('/audit-logs', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN'), adminController.getAuditLogs);
router.get('/coupons', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN'), adminController.getCoupons);

// Support / complaints
router.get('/support', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN', 'SUPPORT'), adminController.getSupportCases);
router.get('/support/rideeasy', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN', 'SUPPORT'), adminController.getRideEasySupport);
router.put('/support/rideeasy', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN', 'SUPPORT'), adminController.updateRideEasySupport);
router.get('/support/:id', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN', 'SUPPORT'), adminController.getSupportCase);
router.post('/support', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN', 'SUPPORT'), adminController.createSupportCase);
router.patch('/support/:id', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN', 'SUPPORT'), adminController.updateSupportCase);
router.get('/payments/:id', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN'), adminController.getPayment);
router.get('/subscriptions', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN'), adminController.getSubscriptions);
router.get('/safety/emergency-alerts', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN'), adminController.getEmergencyAlerts);
router.get('/safety/police-stations', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN'), adminController.getPoliceStations);
router.post('/safety/emergency-alerts/:id/acknowledge', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN'), adminController.acknowledgeEmergencyAlert);
router.post('/safety/emergency-alerts/:id/resolve', auth.authAdmin, auth.requireAdminRoles('SUPER_ADMIN'), adminController.resolveEmergencyAlert);

module.exports = router;
