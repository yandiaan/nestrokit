/**
 * fp-ts utilities re-exports
 */

// TaskEither utilities
export * as TaskEitherUtils from './task-either';
export {
  unwrapOrThrow,
  unwrapOr,
  fromPromise,
  fromPromiseK,
  sequenceArray,
  parallelArray,
  tap as tapTE,
  tapError,
  fromNullable as teFromNullable,
  delay,
} from './task-either';

// Option utilities
export * as OptionUtils from './option';
export {
  toUndefined,
  toNull,
  fromNullable,
  toEither,
  getOrThrow,
  getOrElse,
  getOrElseLazy,
  filter,
  exists,
  tap as tapO,
  zip,
  firstSome,
} from './option';

// Re-export commonly used fp-ts modules
export { pipe, flow, identity } from 'fp-ts/function';
export * as E from 'fp-ts/Either';
export * as O from 'fp-ts/Option';
export * as TE from 'fp-ts/TaskEither';
export * as T from 'fp-ts/Task';
export * as A from 'fp-ts/Array';
export * as R from 'fp-ts/Record';
