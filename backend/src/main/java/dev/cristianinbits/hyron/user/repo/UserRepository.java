package dev.cristianinbits.hyron.user.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import dev.cristianinbits.hyron.user.domain.User;

/**
 * Repository interface for {@link User} entities.
 *
 * Provides database access operations for users, including
 * existence checks based on email address.
 *
 * This repository relies on Spring Data JPA to automatically
 * generate query implementations based on method names.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Checks whether a user with the given email address exists.
     *
     * This method is typically used during user creation
     * to enforce email uniqueness.
     *
     * @param email the email address to check
     * @return true if a user with the given email exists, false otherwise
     */
    boolean existsByEmail(String email);

    /**
     * Checks whether a user with the given email address exists,
     * excluding a specific user identified by its id.
     *
     * This method is typically used during user update operations
     * to validate email uniqueness without considering the current user.
     *
     * @param email the email address to check
     * @param id the identifier of the user to exclude from the check
     * @return true if another user with the given email exists, false otherwise
     */
    boolean existsByEmailAndIdNot(String email, Long id);
}