const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

// newly added
const addressSchema = new mongoose.Schema({
    street: String,
    city: String,
});

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        minLength: 10,
        lowercase: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    age: {
        type: Number,
        min: 1,
        max: 100,
        validate: {
            validator: (v) => v % 2 === 0,
            message: (props) => `${props.value} is not an even number`,
        },
    },
    date: {
        type: Date,
        default: () => Date.now(),
        immutable: true,
    },
    updatedAt: {
        type: Date,
        default: () => Date.now(),
    },
    bestFriend: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
    },
    hobbies: [String],
    address: addressSchema,
});

UserSchema.plugin(passportLocalMongoose);

// No arrow function
// newly added plugins
// pre/post functions
UserSchema.methods.sayHi = function () {
    console.log(`Hi. My name is ${this.name}`); // "this" keyword refers to individual instance of User.
};

UserSchema.statics.findByName = function (name) {
    // where can do the same thing as find()
    return this.where({ name: new RegExp(name, 'i') }); // case insensitive query
};

UserSchema.query.byName = function (name) {
    return this.find({ name: new RegExp(name, 'i') });
};

UserSchema.virtual('namedEmail').get(function () {
    return `${this.name} <${this.email}>`;
});

UserSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

UserSchema.post('save', function (doc, next) {
    doc.sayHi();
    next();
});

module.exports = mongoose.model('User', UserSchema);
