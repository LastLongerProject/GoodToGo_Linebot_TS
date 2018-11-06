var mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    createAt: {
        type: Date,
        default: Date.now(),
        index: {
            expires: '3m'
        }
    },
    _id: mongoose.Schema.Types.ObjectId,
    phone: String,
    lineId: String,
    registSignal: Boolean
}, {
    timestamps: true
});

module.exports = mongoose.model('TemporaryInfo', userSchema);