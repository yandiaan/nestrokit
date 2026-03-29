/**
 * TaskEither utilities for fp-ts
 * Provides helper functions for working with async operations that can fail
 */

import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';

/**
 * Convert a TaskEither to a Promise, throwing on Left
 * Useful at the boundary between fp-ts and imperative code
 */
export const unwrapOrThrow = <E extends Error, A>(te: TE.TaskEither<E, A>): Promise<A> =>
  pipe(
    te,
    T.map(
      E.fold(
        (error) => {
          throw error;
        },
        (value) => value
      )
    )
  )();

/**
 * Convert a TaskEither to a Promise, returning a default value on Left
 */
export const unwrapOr =
  <A>(defaultValue: A) =>
  <E>(te: TE.TaskEither<E, A>): Promise<A> =>
    pipe(
      te,
      T.map(
        E.fold(
          () => defaultValue,
          (value) => value
        )
      )
    )();

/**
 * Create a TaskEither from a Promise-returning function
 * Maps any thrown error to the specified error type
 */
export const fromPromise =
  <E, A>(onError: (error: unknown) => E) =>
  (promise: () => Promise<A>): TE.TaskEither<E, A> =>
    TE.tryCatch(promise, onError);

/**
 * Create a TaskEither from a Promise
 * Convenience wrapper for fromPromise
 */
export const fromPromiseK =
  <E, Args extends unknown[], A>(
    fn: (...args: Args) => Promise<A>,
    onError: (error: unknown) => E
  ) =>
  (...args: Args): TE.TaskEither<E, A> =>
    TE.tryCatch(() => fn(...args), onError);

/**
 * Execute multiple TaskEithers in sequence, collecting results
 * Stops on first error
 */
export const sequenceArray = <E, A>(
  taskEithers: readonly TE.TaskEither<E, A>[]
): TE.TaskEither<E, readonly A[]> => TE.sequenceArray(taskEithers);

/**
 * Execute multiple TaskEithers in parallel, collecting results
 * Returns first error encountered
 */
export const parallelArray = <E, A>(
  taskEithers: readonly TE.TaskEither<E, A>[]
): TE.TaskEither<E, readonly A[]> =>
  pipe(
    taskEithers,
    T.sequenceArray,
    T.map(E.sequenceArray)
  );

/**
 * Tap into a TaskEither for side effects without changing the value
 * Useful for logging, metrics, etc.
 */
export const tap =
  <E, A>(fn: (a: A) => void) =>
  (te: TE.TaskEither<E, A>): TE.TaskEither<E, A> =>
    pipe(
      te,
      TE.map((a) => {
        fn(a);
        return a;
      })
    );

/**
 * Tap into a TaskEither error for side effects without changing the error
 */
export const tapError =
  <E, A>(fn: (e: E) => void) =>
  (te: TE.TaskEither<E, A>): TE.TaskEither<E, A> =>
    pipe(
      te,
      TE.mapLeft((e) => {
        fn(e);
        return e;
      })
    );

/**
 * Convert nullable value to TaskEither
 */
export const fromNullable =
  <E>(onNone: () => E) =>
  <A>(value: A | null | undefined): TE.TaskEither<E, A> =>
    value === null || value === undefined ? TE.left(onNone()) : TE.right(value);

// Declare setTimeout for cross-platform compatibility
declare function setTimeout(callback: () => void, ms: number): unknown;

/**
 * Delay a TaskEither execution
 */
export const delay =
  (ms: number) =>
  <E, A>(te: TE.TaskEither<E, A>): TE.TaskEither<E, A> =>
    pipe(
      TE.rightTask<E, void>(
        () => new Promise<void>((resolve) => setTimeout(resolve, ms))
      ),
      TE.chain(() => te)
    );
