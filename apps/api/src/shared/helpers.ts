import { ZodError, ZodSchema } from "zod";
import { GenericError, ValidationError } from "./errors";

export const validateInput = <T>(schema: ZodSchema, input: T): T => {
  try {
    return schema.parse(input) as T;
  } catch (e) {
    if (e instanceof ZodError) {
      throw new ValidationError(e.issues[0].message);
    }
  }
  throw new GenericError();
};
