/**
 * User Service
 *
 * Business logic for user operations using fp-ts TaskEither.
 */

import { Injectable } from '@nestjs/common';
import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as bcrypt from 'bcrypt';

import { DomainError, NotFoundError, ConflictError, ValidationError } from '@repo/core/errors';
import { createUserSchema, updateUserSchema, userListQuerySchema } from '@repo/core/schemas';
import { userRepository, type PaginatedResult, type User } from '@repo/database';
import { unwrapOrThrow } from '@repo/utils/fp';

const BCRYPT_ROUNDS = 10;

@Injectable()
export class UserService {
  /**
   * Get all users with pagination
   */
  async findAll(query: unknown): Promise<PaginatedResult<User>> {
    const parsed = userListQuerySchema.safeParse(query);
    if (!parsed.success) {
      throw ValidationError.fromZodError(parsed.error);
    }

    const { page, limit, search, role, sortBy, sortOrder } = parsed.data;

    return unwrapOrThrow(
      userRepository.findAll(
        { page, limit },
        { search, role },
        { sortBy, sortOrder },
      ),
    );
  }

  /**
   * Get user by ID
   */
  async findById(id: string): Promise<User> {
    return unwrapOrThrow(
      pipe(
        userRepository.findById(id),
        TE.flatMap((maybeUser) =>
          pipe(
            maybeUser,
            O.fold(
              () => TE.left<DomainError, User>(new NotFoundError('User', id)),
              (user) => TE.right(user),
            ),
          ),
        ),
      ),
    );
  }

  /**
   * Get user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    const result = await unwrapOrThrow(userRepository.findByEmail(email));
    return O.isSome(result) ? result.value : null;
  }

  /**
   * Create new user
   */
  async create(input: unknown): Promise<User> {
    // Validate input
    const parsed = createUserSchema.safeParse(input);
    if (!parsed.success) {
      throw ValidationError.fromZodError(parsed.error);
    }

    const { email, password, name, role } = parsed.data;

    // Check email uniqueness
    const emailExists = await unwrapOrThrow(userRepository.emailExists(email));
    if (emailExists) {
      throw ConflictError.alreadyExists('User', 'email');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // Create user
    return unwrapOrThrow(
      userRepository.create({
        email,
        passwordHash,
        name,
        role,
      }),
    );
  }

  /**
   * Update user
   */
  async update(id: string, input: unknown): Promise<User> {
    // Validate input
    const parsed = updateUserSchema.safeParse(input);
    if (!parsed.success) {
      throw ValidationError.fromZodError(parsed.error);
    }

    // Check user exists
    const exists = await unwrapOrThrow(userRepository.exists(id));
    if (!exists) {
      throw new NotFoundError('User', id);
    }

    // Check email uniqueness if changing
    if (parsed.data.email) {
      const emailExists = await unwrapOrThrow(
        userRepository.emailExists(parsed.data.email),
      );
      if (emailExists) {
        throw ConflictError.alreadyExists('User', 'email');
      }
    }

    // Update user
    return unwrapOrThrow(userRepository.update(id, parsed.data));
  }

  /**
   * Delete user
   */
  async delete(id: string): Promise<void> {
    // Check user exists
    const exists = await unwrapOrThrow(userRepository.exists(id));
    if (!exists) {
      throw new NotFoundError('User', id);
    }

    await unwrapOrThrow(userRepository.delete(id));
  }

  /**
   * Verify user password
   */
  async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
  }

  /**
   * Update user password
   */
  async updatePassword(id: string, password: string): Promise<void> {
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    await unwrapOrThrow(userRepository.updatePassword(id, passwordHash));
  }
}
