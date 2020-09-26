const {
  FULFILLMENT_REQ_TYPE,
  FACILITY_PICKUP_TYPES,
  WAREHOUSE_TYPES,
  FACILITY_TYPES,
  FACILITY_DAYS
} = require("../../../utilities/constants");


const updateFulfillmentPolicy = {
  body: {
    type: "object",
    required: ["fulfillmentProvider"],
    properties: {
      fulfillmentProvider: { type: "string" },
      requestType: { type: "string", enum: FULFILLMENT_REQ_TYPE }
    },
    additionalProperties: false
  }
};

module.exports = {
  updateFulfillmentPolicy,

};
