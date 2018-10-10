import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
  date: {
    type: Date,
    required: [true, 'Enter an activity date']
  },
  location_id: {
    type: Schema.Types.ObjectId,
    required: [true, 'Enter an activity location']
  },
  activityType_id: {
    type: Schema.Types.ObjectId,
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
        _id: Schema.Types.ObjectId,
        createdBy: Schema.Types.ObjectId,
        createdAt: Date,
        text: String
      }],
      default: []
  },
  likes: {
    type: [Schema.Types.ObjectId],
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

ActivitySchema.statics.validateID = function(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

const Activity = mongoose.model('Activity', ActivitySchema);

export default Activity;
