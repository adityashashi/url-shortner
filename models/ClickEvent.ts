import { Schema, models, model } from 'mongoose';

const ClickEventSchema = new Schema(
  {
    linkId: { type: Schema.Types.ObjectId, ref: 'Link', index: true },
    clickedAt: { type: Date, default: Date.now },
    referrer: { type: String },
    userAgent: { type: String },
    ipHash: { type: String },
    country: { type: String }
  },
  {
    collection: 'click_events'
  }
);

const ClickEvent = models.ClickEvent || model('ClickEvent', ClickEventSchema);
export default ClickEvent;
