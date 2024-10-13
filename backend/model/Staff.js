const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  staffId: { type: String, required: true, unique: true },
  role: { type: String, enum: ['driver', 'conductor'], required: true },
});

const Staff = mongoose.model('Staff', staffSchema);
module.exports = Staff;
