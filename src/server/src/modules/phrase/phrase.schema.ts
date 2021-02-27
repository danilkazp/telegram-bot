import mongoose from 'mongoose'

const PhraseSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      default: null,
    },
    translatedText: {
      type: String,
      default: null,
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
