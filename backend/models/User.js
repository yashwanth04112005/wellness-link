import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address',
      ],
    },
    password_hash: {
      type: String,
      required: true,
      minlength: 6,
    },
    isAdmin: { 
      type: Boolean, 
      default: false 
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: false
    }
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password_hash')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password_hash = await bcrypt.hash(this.password_hash, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password_hash);
};

const User = mongoose.model('User', userSchema);

export default User;