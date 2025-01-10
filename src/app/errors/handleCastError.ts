import mongoose from "mongoose";
import { TErrorSources } from "../interface/error";
import httpStatus from "http-status";

const handleCastError = (err: mongoose.Error.CastError) => {
  const errorSources: TErrorSources = [
    {
      path: err.path,
      message: err.message,
    },
  ];

  const statusCode = httpStatus.BAD_REQUEST;

  return {
    statusCode,
    message: "Invalid ID",
    errorSources,
  };
};

export default handleCastError;
