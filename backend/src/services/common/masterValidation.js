import mongoose from "mongoose";

export const validateObjectId = (id, name) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ${name} id`);
  }
};

export const validateMasterExists = async (
  Model,
  id,
  name,
  extraQuery = {}
) => {
  validateObjectId(id, name);

  const record = await Model.findOne({
    _id: id,
    ...extraQuery
  });

  if (!record) {
    throw new Error(`${name} not found or inactive`);
  }

  return record;
};
