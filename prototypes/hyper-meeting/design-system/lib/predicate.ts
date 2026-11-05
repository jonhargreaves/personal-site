/** Shared predicates; preserve the library's Effect-free runtime boundary. */
import { isObjectLike } from "es-toolkit/compat";
export { isString, isNumber, isBoolean, isNull, isFunction } from "es-toolkit";

/** Includes arrays and class instances, excludes null and functions. */
export const isObject = (value: unknown): value is object =>
  isObjectLike(value);
export const isObjectOrArray = isObject;

export const or =
  <A, B extends A, C extends A>(
    self: (value: A) => value is B,
    that: (value: A) => value is C
  ) =>
  (value: A): value is B | C =>
    self(value) || that(value);
