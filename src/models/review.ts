import mongoose from "mongoose"
const Schema = mongoose.Schema

const ReviewSchema = new Schema({
  Customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  Barber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  Rate: {
    Type: Number,
    required: true
  },
  Content: {
    Type: Number,
    required: true
  }
}, {
  timestamps: true
})

const Review = mongoose.model("Reviews", ReviewSchema)

export default Review
