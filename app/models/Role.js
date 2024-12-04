// models/Role.js
const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  permissions: {
    type: [String],
    default: [], 
    validate: {
      validator: function (v) {
        return Array.isArray(v) && v.every((perm) => typeof perm === 'string');
      },
      message: 'Permissions must be an array of strings.',
    },
  },
});

export default mongoose.models.Role || mongoose.model('Role', RoleSchema);