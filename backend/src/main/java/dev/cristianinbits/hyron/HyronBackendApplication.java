package dev.cristianinbits.hyron;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class HyronBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(HyronBackendApplication.class, args);
	}

}