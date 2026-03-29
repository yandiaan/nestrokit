/**
 * User Repository
 *
 * Repository for User model operations with fp-ts TaskEither.
 */

import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import type { User, Prisma } from '@prisma/client';

import { DomainError } from '@repo/core/errors';
import { prisma } from '../client';
import {
  tryCatch,
  tryCatchOption,
  tryCatchOrNotFound,
  createPaginationMeta,
  calculateOffset,
  type PaginationOptions,
  type PaginatedResult,
} from './base.repository';

/**
 * User create input (without password hash)
 */
export interface CreateUserData {
  email: string;
  passwordHash: string;
  name: string;
  role?: 'USER' | 'ADMIN';
}

/**
 * User update input
 */
export interface UpdateUserData {
  email?: string;
  name?: string;
  role?: 'USER' | 'ADMIN';
}

/**
 * User query filters
 */
export interface UserFilters {
  search?: string;
  role?: 'USER' | 'ADMIN';
}

/**
 * User sort options
 */
export interface UserSortOptions {
  sortBy?: 'createdAt' | 'name' | 'email';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Build user where clause from filters
 */
const buildWhereClause = (filters: UserFilters): Prisma.UserWhereInput => {
  const where: Prisma.UserWhereInput = {};

  if (filters.search) {
    where.OR = [
      { email: { contains: filters.search, mode: 'insensitive' } },
      { name: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.role) {
    where.role = filters.role;
  }

  return where;
};

/**
 * Build order by clause
 */
const buildOrderBy = (
  sort: UserSortOptions
): Prisma.UserOrderByWithRelationInput => {
  const field = sort.sortBy ?? 'createdAt';
  const order = sort.sortOrder ?? 'desc';
  return { [field]: order };
};

/**
 * User repository
 */
export const userRepository = {
  /**
   * Find user by ID
   */
  findById: (id: string): TE.TaskEither<DomainError, O.Option<User>> =>
    tryCatchOption(() => prisma.user.findUnique({ where: { id } })),

  /**
   * Find user by ID or fail
   */
  findByIdOrFail: (id: string): TE.TaskEither<DomainError, User> =>
    tryCatchOrNotFound(
      () => prisma.user.findUnique({ where: { id } }),
      'User',
      id
    ),

  /**
   * Find user by email
   */
  findByEmail: (email: string): TE.TaskEither<DomainError, O.Option<User>> =>
    tryCatchOption(() => prisma.user.findUnique({ where: { email } })),

  /**
   * Find user by email or fail
   */
  findByEmailOrFail: (email: string): TE.TaskEither<DomainError, User> =>
    tryCatchOrNotFound(
      () => prisma.user.findUnique({ where: { email } }),
      'User',
      email
    ),

  /**
   * Find all users with pagination and filters
   */
  findAll: (
    pagination: PaginationOptions,
    filters: UserFilters = {},
    sort: UserSortOptions = {}
  ): TE.TaskEither<DomainError, PaginatedResult<User>> =>
    pipe(
      TE.Do,
      TE.bind('where', () => TE.right(buildWhereClause(filters))),
      TE.bind('orderBy', () => TE.right(buildOrderBy(sort))),
      TE.bind('total', ({ where }) =>
        tryCatch(() => prisma.user.count({ where }))
      ),
      TE.bind('data', ({ where, orderBy }) =>
        tryCatch(() =>
          prisma.user.findMany({
            where,
            orderBy,
            skip: calculateOffset(pagination.page, pagination.limit),
            take: pagination.limit,
          })
        )
      ),
      TE.map(({ total, data }) => ({
        data,
        meta: createPaginationMeta(total, pagination.page, pagination.limit),
      }))
    ),

  /**
   * Create a new user
   */
  create: (data: CreateUserData): TE.TaskEither<DomainError, User> =>
    tryCatch(() =>
      prisma.user.create({
        data: {
          email: data.email,
          passwordHash: data.passwordHash,
          name: data.name,
          role: data.role ?? 'USER',
        },
      })
    ),

  /**
   * Update user
   */
  update: (id: string, data: UpdateUserData): TE.TaskEither<DomainError, User> =>
    tryCatch(() =>
      prisma.user.update({
        where: { id },
        data,
      })
    ),

  /**
   * Update user password
   */
  updatePassword: (
    id: string,
    passwordHash: string
  ): TE.TaskEither<DomainError, User> =>
    tryCatch(() =>
      prisma.user.update({
        where: { id },
        data: { passwordHash },
      })
    ),

  /**
   * Delete user
   */
  delete: (id: string): TE.TaskEither<DomainError, void> =>
    pipe(
      tryCatch(() => prisma.user.delete({ where: { id } })),
      TE.map(() => undefined)
    ),

  /**
   * Check if user exists by ID
   */
  exists: (id: string): TE.TaskEither<DomainError, boolean> =>
    pipe(
      tryCatchOption(() => prisma.user.findUnique({ where: { id } })),
      TE.map(O.isSome)
    ),

  /**
   * Check if email exists
   */
  emailExists: (email: string): TE.TaskEither<DomainError, boolean> =>
    pipe(
      tryCatchOption(() => prisma.user.findUnique({ where: { email } })),
      TE.map(O.isSome)
    ),

  /**
   * Count users
   */
  count: (filters: UserFilters = {}): TE.TaskEither<DomainError, number> =>
    tryCatch(() => prisma.user.count({ where: buildWhereClause(filters) })),
};
