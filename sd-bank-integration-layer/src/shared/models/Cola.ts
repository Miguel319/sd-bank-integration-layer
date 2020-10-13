import { model, Schema } from "mongoose";

const colaSchema = new Schema(
  {
    params: {
      type: Object,
    },
    query: {
      type: Object,
    },
    body: {
      type: Object,
    },
    reqType: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  { timestamps: true }
);

export default model("Cola", colaSchema);
