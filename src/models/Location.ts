import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const LocationSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Enter a location name'],
    minlength: 1
  },
  coordinates: {
    type: {
      center: {
          type: {
            lat: {
              type: Number,
              required: [true, 'Add center lat']
            },
            lng: {
              type: Number,
              required: [true, 'Add center lng']
            }
          },
          required: [true, 'Add center']
      },
      routeCoords: {
        type: [{
          lat: {
            type: Number,
            required: [true, 'Add route lat']
          },
          lng: {
            type: Number,
            required: [true, 'Add route lng']
          }
        }],
        default: []
      },
      zoom: {
        type: Number,
        default: 15
      }
    },
    default: null
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

LocationSchema.statics.validateID = function(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

const Location = mongoose.model('Location', LocationSchema);

export default Location;
