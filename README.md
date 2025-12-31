# Hyron Backend

REST API for recording workouts: Hyrox, Running, Swimming, and Gym training sessions.

## 🚀 Technologies

- Java 21
- Spring Boot 4
- Gradle (Kotlin DSL)
- PostgreSQL
- Flyway
- JPA / Hibernate

---

## 📊 Domain Model

```bash
User
 ├── 1:N Shoe (running shoes catalog)
 ├── 1:N Exercise (gym exercises catalog)
 └── 1:N Workout
          │
          ├── type: HYROX
          │   └── 1:1 HyroxWorkoutDetails
          │            └── 1:N HyroxBlock
          │                     └── 1:N HyroxItem
          │
          ├── type: RUN
          │   └── 1:1 RunWorkoutDetails ──> Shoe
          │            └── 1:N RunInterval
          │
          ├── type: SWIM
          │   └── 1:1 SwimWorkoutDetails
          │            └── 1:N SwimInterval
          │
          └── type: GYM
              └── 1:1 GymWorkoutDetails
                       └── 1:N GymExercise ──> Exercise
                                └── 1:N GymSet
```

---

## 📚 API Endpoints

### User

| Method | Endpoint | Description |
| -------- | ---------- | ------------- |
| POST | `/api/users` | Create user |
| GET | `/api/users` | List users (paginated) |
| GET | `/api/users/{id}` | Get user |
| PATCH | `/api/users/{id}` | Update user |
| DELETE | `/api/users/{id}` | Delete user |

---

### Workout

| Method | Endpoint | Description |
| -------- | ---------- | ------------- |
| POST | `/api/users/{userId}/workouts` | Create workout |
| GET | `/api/users/{userId}/workouts` | List workouts (paginated) |
| GET | `/api/users/{userId}/workouts/{id}` | Get workout with details |
| PATCH | `/api/users/{userId}/workouts/{id}` | Update workout |
| DELETE | `/api/users/{userId}/workouts/{id}` | Delete workout (cascades details) |

**Query params:** `type`, `start`, `end`, `page`, `size`, `sort`

---

### Hyrox Details

| Method | Endpoint | Description |
| -------- | ---------- | ------------- |
| PUT | `/api/users/{userId}/workouts/{workoutId}/hyrox` | Create or replace details |
| GET | `/api/users/{userId}/workouts/{workoutId}/hyrox` | Get details |
| DELETE | `/api/users/{userId}/workouts/{workoutId}/hyrox` | Delete details |

---

### Run Details

| Method | Endpoint | Description |
| -------- | ---------- | ------------- |
| PUT | `/api/users/{userId}/workouts/{workoutId}/run` | Create or replace details |
| GET | `/api/users/{userId}/workouts/{workoutId}/run` | Get details |
| DELETE | `/api/users/{userId}/workouts/{workoutId}/run` | Delete details |

---

### Swim Details

| Method | Endpoint | Description |
| -------- | ---------- | ------------- |
| PUT | `/api/users/{userId}/workouts/{workoutId}/swim` | Create or replace details |
| GET | `/api/users/{userId}/workouts/{workoutId}/swim` | Get details |
| DELETE | `/api/users/{userId}/workouts/{workoutId}/swim` | Delete details |

---

### Gym Details

| Method | Endpoint | Description |
| -------- | ---------- | ------------- |
| PUT | `/api/users/{userId}/workouts/{workoutId}/gym` | Create or replace details |
| GET | `/api/users/{userId}/workouts/{workoutId}/gym` | Get details |
| DELETE | `/api/users/{userId}/workouts/{workoutId}/gym` | Delete details |

---

### Shoes (Running catalog)

| Method | Endpoint | Description |
| -------- | ---------- | ------------- |
| POST | `/api/users/{userId}/shoes` | Create shoe |
| GET | `/api/users/{userId}/shoes` | List all shoes |
| GET | `/api/users/{userId}/shoes/active` | List active shoes |
| GET | `/api/users/{userId}/shoes/{id}` | Get shoe with total km |
| PATCH | `/api/users/{userId}/shoes/{id}` | Update shoe |
| DELETE | `/api/users/{userId}/shoes/{id}` | Soft delete shoe |

---

### Exercises (Gym catalog)

| Method | Endpoint | Description |
| -------- | ---------- | ------------- |
| POST | `/api/users/{userId}/exercises` | Create exercise |
| GET | `/api/users/{userId}/exercises` | List all exercises |
| GET | `/api/users/{userId}/exercises/active` | List active exercises |
| GET | `/api/users/{userId}/exercises/active?muscleGroup=CHEST` | Filter by muscle |
| GET | `/api/users/{userId}/exercises/{id}` | Get exercise |
| PATCH | `/api/users/{userId}/exercises/{id}` | Update exercise |
| DELETE | `/api/users/{userId}/exercises/{id}` | Soft delete exercise |

---

## 🔑 Business Rules

| Rule | Description |
| ------ | ------------- |
| Workout type lock | Cannot change type while details exist |
| Date validation | `endDateTime` must be after `startDateTime` |
| Ownership | All resources scoped by `userId` |
| Soft delete | Shoes and Exercises use soft delete (active=false) |
| Resurrection | Creating with existing inactive name reactivates it |
| Cascades | Deleting User cascades to all data |

---

## 🗄️ Database

PostgreSQL with Flyway migrations.

| Migration | Description |
| ----------- | ------------- |
| V1 | Users table |
| V2 | Workouts table |
| V3 | Hyrox tables |
| V4 | Shoes table |
| V5 | Run tables |
| V6 | Gym + Exercises tables |
| V7 | Swim tables |

---

## ▶️ Run

```bash
docker compose up -d
./gradlew bootRun
```

API available at `http://localhost:8080`

---

## 🧪 Test

Import Postman collection from `/docs/postman/` (if available).

```bash
./gradlew test
```

---

## Diagrama de clases
