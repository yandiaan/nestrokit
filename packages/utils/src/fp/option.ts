/**
 * Option utilities for fp-ts
 * Provides helper functions for working with nullable values
 */

import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';

/**
 * Convert Option to nullable (A | undefined)
 */
export const toUndefined = <A>(option: O.Option<A>): A | undefined =>
  pipe(
    option,
    O.fold(
      () => undefined,
      (a) => a
    )
  );

/**
 * Convert Option to nullable (A | null)
 */
export const toNull = <A>(option: O.Option<A>): A | null =>
  pipe(
    option,
    O.fold(
      () => null,
      (a) => a
    )
  );

/**
 * Convert nullable to Option
 */
export const fromNullable = <A>(value: A | null | undefined): O.Option<A> =>
  O.fromNullable(value);

/**
 * Convert Option to Either
 */
export const toEither =
  <E>(onNone: () => E) =>
  <A>(option: O.Option<A>): E.Either<E, A> =>
    pipe(option, E.fromOption(onNone));

/**
 * Get value or throw error
 * Use sparingly - only at application boundaries
 */
export const getOrThrow =
  <A>(errorMessage: string) =>
  (option: O.Option<A>): A =>
    pipe(
      option,
      O.fold(
        () => {
          throw new Error(errorMessage);
        },
        (a) => a
      )
    );

/**
 * Get value or default
 */
export const getOrElse =
  <A>(defaultValue: A) =>
  (option: O.Option<A>): A =>
    pipe(
      option,
      O.fold(
        () => defaultValue,
        (a) => a
      )
    );

/**
 * Get value or compute default lazily
 */
export const getOrElseLazy =
  <A>(getDefault: () => A) =>
  (option: O.Option<A>): A =>
    pipe(
      option,
      O.fold(
        () => getDefault(),
        (a) => a
      )
    );

/**
 * Filter Option with predicate
 */
export const filter =
  <A>(predicate: (a: A) => boolean) =>
  (option: O.Option<A>): O.Option<A> =>
    pipe(option, O.filter(predicate));

/**
 * Check if Option has value satisfying predicate
 */
export const exists =
  <A>(predicate: (a: A) => boolean) =>
  (option: O.Option<A>): boolean =>
    pipe(
      option,
      O.fold(
        () => false,
        (a) => predicate(a)
      )
    );

/**
 * Tap into Some value for side effects
 */
export const tap =
  <A>(fn: (a: A) => void) =>
  (option: O.Option<A>): O.Option<A> =>
    pipe(
      option,
      O.map((a) => {
        fn(a);
        return a;
      })
    );

/**
 * Combine two Options, returning Some only if both are Some
 */
export const zip = <A, B>(
  optionA: O.Option<A>,
  optionB: O.Option<B>
): O.Option<[A, B]> =>
  pipe(
    optionA,
    O.flatMap((a) =>
      pipe(
        optionB,
        O.map((b) => [a, b] as [A, B])
      )
    )
  );

/**
 * Return first Some from array of Options
 */
export const firstSome = <A>(options: O.Option<A>[]): O.Option<A> => {
  for (const option of options) {
    if (O.isSome(option)) {
      return option;
    }
  }
  return O.none;
};
