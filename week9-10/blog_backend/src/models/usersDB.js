import mongoose from './connect.js';

export const UsersSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true },
    password: {
        type:String,
        required: true,
    },
    profile_picture: {
        type: String,
    },
    role: {
        type: String,
        enum: ['admin', 'user'  ],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    last_login: Date,
    is_active: {
        type: Boolean,
        default: true
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    reset_token: String,
    reset_token_expires: Date
});

// UsersSchema.pre('save', async function(next) {
//     this.password =
// })

export const User = mongoose.model('User', UsersSchema);