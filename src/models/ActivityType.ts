import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ActivityTypeSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Enter an activity type name'],
    minlength: 1
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

ActivityTypeSchema.statics.validateID = function(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

const ActivityType = mongoose.model('ActivityType', ActivityTypeSchema);

export default ActivityType;
