import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const EventSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Enter an event name'],
    minlength: 1
  },
  date: {
    type: Date,
    required: [true, 'Enter an event date']
  },
  location_id: {
    type: Schema.Types.ObjectId,
    required: [true, 'Enter an event location']
  },
  attendees: {
    type: [Schema.Types.ObjectId],
    default: []
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

EventSchema.statics.validateID = function(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

const Event = mongoose.model('Event', EventSchema);

export default Event;
