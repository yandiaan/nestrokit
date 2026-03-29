/**
 * Base Repository
 *
 * Abstract base repository with common CRUD operations using fp-ts TaskEither.
 * Provides a consistent interface for database operations with error handling.
 */

import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';

import { DomainError, NotFoundError } from '@repo/core/errors';
import { mapPrismaError } from '../errors';

/**
 * Pagination options
 */
export interface PaginationOptions {
  page: number;
  limit: number;
}

/**
 * Paginated result
 */
export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Calculate pagination offset
 */
export const calculateOffset = (page: number, limit: number): number =>
  (page - 1) * limit;

/**
 * Create pagination meta
 */
export const createPaginationMeta = (
  total: number,
  page: number,
  limit: number
): PaginatedResult<never>['meta'] => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
});

/**
 * Wrap a Prisma operation in TaskEither with error mapping
 */
export const tryCatch = <T>(
  operation: () => Promise<T>
): TE.TaskEither<DomainError, T> =>
  TE.tryCatch(operation, mapPrismaError);

/**
 * Wrap a Prisma operation that might return null
 */
export const tryCatchOption = <T>(
  operation: () => Promise<T | null>
): TE.TaskEither<DomainError, O.Option<T>> =>
  pipe(
    tryCatch(operation),
    TE.map(O.fromNullable)
  );

/**
 * Find one or fail with NotFoundError
 */
export const tryCatchOrNotFound = <T>(
  operation: () => Promise<T | null>,
  resourceName: string,
  identifier?: string
): TE.TaskEither<DomainError, T> =>
  pipe(
    tryCatchOption(operation),
    TE.flatMap((option) =>
      pipe(
        option,
        O.fold(
          () => TE.left<DomainError, T>(new NotFoundError(resourceName, identifier)),
          (value) => TE.right(value)
        )
      )
    )
  );

/**
 * Base repository interface
 */
export interface BaseRepository<T, CreateInput, UpdateInput> {
  findById(id: string): TE.TaskEither<DomainError, O.Option<T>>;
  findByIdOrFail(id: string): TE.TaskEither<DomainError, T>;
  findAll(pagination?: PaginationOptions): TE.TaskEither<DomainError, PaginatedResult<T>>;
  create(data: CreateInput): TE.TaskEither<DomainError, T>;
  update(id: string, data: UpdateInput): TE.TaskEither<DomainError, T>;
  delete(id: string): TE.TaskEither<DomainError, void>;
  exists(id: string): TE.TaskEither<DomainError, boolean>;
}

/**
 * Create base repository factory
 * Provides common CRUD operations for any Prisma model
 */
export const createBaseRepository = <
  T,
  CreateInput,
  UpdateInput,
  Model extends {
    findUnique: (args: { where: { id: string } }) => Promise<T | null>;
    findMany: (args: { skip?: number; take?: number }) => Promise<T[]>;
    count: () => Promise<number>;
    create: (args: { data: CreateInput }) => Promise<T>;
    update: (args: { where: { id: string }; data: UpdateInput }) => Promise<T>;
    delete: (args: { where: { id: string } }) => Promise<T>;
  },
>(
  model: Model,
  resourceName: string
): BaseRepository<T, CreateInput, UpdateInput> => ({
  findById: (id: string) =>
    tryCatchOption(() => model.findUnique({ where: { id } })),

  findByIdOrFail: (id: string) =>
    tryCatchOrNotFound(
      () => model.findUnique({ where: { id } }),
      resourceName,
      id
    ),

  findAll: (pagination?: PaginationOptions) =>
    pipe(
      TE.Do,
      TE.bind('total', () => tryCatch(() => model.count())),
      TE.bind('data', () =>
        tryCatch(() =>
          pagination
            ? model.findMany({
                skip: calculateOffset(pagination.page, pagination.limit),
                take: pagination.limit,
              })
            : model.findMany({})
        )
      ),
      TE.map(({ total, data }) => ({
        data,
        meta: createPaginationMeta(
          total,
          pagination?.page ?? 1,
          pagination?.limit ?? data.length
        ),
      }))
    ),

  create: (data: CreateInput) =>
    tryCatch(() => model.create({ data })),

  update: (id: string, data: UpdateInput) =>
    tryCatch(() => model.update({ where: { id }, data })),

  delete: (id: string) =>
    pipe(
      tryCatch(() => model.delete({ where: { id } })),
      TE.map(() => undefined)
    ),

  exists: (id: string) =>
    pipe(
      tryCatchOption(() => model.findUnique({ where: { id } })),
      TE.map(O.isSome)
    ),
});
