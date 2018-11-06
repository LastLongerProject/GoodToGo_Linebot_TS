var mongoose = require('mongoose');

var richMenuSchema = mongoose.Schema({
    ID: String,
    name: String,
}, {
    timestamps: true
});

richMenuSchema.index({ "ID": 1 });

module.exports = mongoose.model('RichMenu', richMenuSchema);