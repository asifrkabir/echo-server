/* eslint-disable  @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { TErrorSources } from "../interface/error";

const handleDuplicateError = (err: any) => {
  // Extract value within double quotes using regex
  const match = err.message.match(/"([^"]*)"/);

  // The extracted value will be in the first capturing group
  const extractedMessage = match && match[1];

  const errorSources: TErrorSources = [
    {
      path: "",
      message: `${extractedMessage} already exists`,
    },
  ];

  const statusCode = httpStatus.CONFLICT;

  return {
    statusCode,
    message: "Invalid ID",
    errorSources,
  };
};

export default handleDuplicateError;
