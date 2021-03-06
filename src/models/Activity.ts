import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
  date: {
    type: Date,
    required: [true, 'Enter an activity date']
  },
  location_id: {
    type: Schema.Types.ObjectId,
    ref: 'Location',
    required: [true, 'Enter an activity location']
  },
  activityType_id: {
    type: Schema.Types.ObjectId,
    ref: 'ActivityType',
    required: [true, 'Enter an activity type']
  },
  durationInSeconds: {
    type: Number,
    min: 1,
    default: null
  },
  distanceInMeters: {
    type: Number,
    min: 1,
    default: null
  },
  comments: {
      type: [{
        createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
        createdAt: {
            type: Date,
            default: Date.now
        },
        text: {
          type: String,
          required: [true, 'Add comment text']
        }
      }],
      default: []
  },
  likes: {
    type: [{
      createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
      createdAt: {
          type: Date,
          default: Date.now
      },
    }],
    default: []
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

ActivitySchema.statics.validateID = function(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

const Activity = mongoose.model('Activity', ActivitySchema);

export default Activity;
