import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  recipient_id: {
    type: Schema.Types.ObjectId,
    required: [true, 'Enter Recipient ID']
  },
  text: {
    type: String,
    required: [true, 'Enter text'],
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

MessageSchema.statics.validateID = function(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

const Message = mongoose.model('Message', MessageSchema);

export default Message;
