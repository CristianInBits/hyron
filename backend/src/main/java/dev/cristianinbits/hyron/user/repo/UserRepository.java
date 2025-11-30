package dev.cristianinbits.hyron.user.repo;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import dev.cristianinbits.hyron.user.domain.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
