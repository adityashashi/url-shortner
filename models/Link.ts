import { Schema, models, model } from 'mongoose';

const LinkSchema = new Schema(
  {
    shortCode: { type: String, unique: true, index: true },
    longUrl: { type: String, required: true },
    title: { type: String },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
    clickCount: { type: Number, default: 0 }
  },
  {
    collection: 'links'
  }
);

export type LinkDocument = typeof LinkSchema extends infer T
  ? T
  : never;

const Link = models.Link || model('Link', LinkSchema);
export default Link;
