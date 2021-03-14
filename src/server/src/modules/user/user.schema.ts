import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      default: null,
    },
    lastName: {
      type: String,
      default: null,
    },
    userName: {
      type: String,
      default: null,
    },
    context: {
      type: {
        handlerForNextMessage: {
          type: String,
          default: null,
        },
        phraseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Phrase',
          default: null,
        }
      },
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v
      },
    },
  },
)

export const User = mongoose.model('User', UserSchema)
