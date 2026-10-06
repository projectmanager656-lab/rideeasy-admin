const mongoose = require('mongoose');

let bucket;

function getComplianceBucket() {
    if (!mongoose.connection.db) {
        throw new Error('MongoDB connection is not ready');
    }

    if (!bucket) {
        bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: 'complianceDocuments',
        });
    }

    return bucket;
}

module.exports = {
    getComplianceBucket,
};
