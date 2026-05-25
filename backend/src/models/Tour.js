const mongoose =
  require('mongoose');

const tourSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },

      location: {
        type: String,
        required: true,
      },

      price: {
        type: Number,
        required: true,
      },

      duration: {
        type: String,
        required: true,
      },

      travelers: {
        type: Number,
        required: true,
      },

      category: {
        type: String,
        required: true,
      },

      description: {
        type: String,
        required: true,
      },

      images: [
        {
          type: String,
        },
      ],

      video: {
        type: String,
      },

      provider: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    'Tour',
    tourSchema
  );