const config = require('../config')
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = config.db.uri

console.log('connecting to', url)

//stablishing db connection
mongoose
  .connect(url)
  .then((res) => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

//create document schema
const personSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, minlength: 3 },
  number: { type: String, minlength: 8 },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

personSchema.plugin(uniqueValidator)

//export document model
module.exports = mongoose.model('Person', personSchema)
