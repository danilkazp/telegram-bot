import mongoose from 'mongoose'

const PhraseSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    userId: {
      type: String,
      default: null,
    },
    text: {
      type: String,
      default: null,
    },
    translation: {
      type: Array,
      default: [],
    },
    examples: {
      type: Array,
      default: [],
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

export const Phrase = mongoose.model('Phrase', PhraseSchema)
