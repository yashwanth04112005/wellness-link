import mongoose from 'mongoose';

const sessionSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    json_file_url: {
      type: String,
      required: true,
      trim: true,
      match: [
        /^(ftp|http|https):\/\/[^ "]+$/,
        'Please enter a valid URL',
      ],
    },
    status: {
      type: String,
      required: true,
      enum: ['draft', 'published'],
      default: 'draft',
    },
  },
  {
    timestamps: { 
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

const Session = mongoose.model('Session', sessionSchema);

export default Session;