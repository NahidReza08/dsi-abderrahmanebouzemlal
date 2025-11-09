import mongoose from 'mongoose';

const project = new mongoose.Schema({
  name: { type: String, required: true },
  tag: { type: String }
});
