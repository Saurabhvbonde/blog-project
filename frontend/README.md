# Simple Blogging Platform

A full-featured blogging website with two roles — **User** and **Admin** —
sharing one login/registration flow but landing on different dashboards.

---

## Technologies Used

**Backend**
- Java 17
- Spring Boot 3.3.4
- Spring Security + JWT (`jjwt`) — stateless, token-based authentication
- Spring Data JPA / Hibernate
- Jakarta Bean Validation
- Lombok
- MySQL 8
- Maven

**Frontend**
- React (Vite)
- React Router
- Axios
- Bootstrap 5

---

## Admin Login

An admin account is created automatically the first time the backend
starts:

- **Username:** `admin`
- **Password:** `Admin@123`

(Configurable via `app.seed.admin.*` in
`backend/src/main/resources/application.properties` — but only before the
very first startup, since the account is only seeded once.)

---

## How It Works

### User

1. Register an account (username, password, email, full name) or log in.
2. **Home** — browse all published posts; search by title/author/keyword,
   sort by date/popularity/author, paginate through results.
3. **Create New Post** — write a title, content, and comma-separated tags,
   then publish. New posts start as **Pending** and are hidden from the
   public feed until an admin approves them.
4. **Profile** — view your own details and every post you've written (any
   status), with Edit/Delete on each.
5. Edit or delete only your own posts.

### Admin

1. Log in with the admin account above — lands on the Admin Dashboard.
2. **Manage Posts** — see every post in the system regardless of status;
   Edit, Delete, or Feature any post.
3. **Manage Users** — view all registered users; promote/demote between
   User and Admin, or delete an account.
4. **Post Moderation** — review posts awaiting approval; Approve (goes
   live on the public feed), Reject, or Remove.
5. **Reports** — generate "Most Active Users" or "Most Popular Posts"
   reports.

---

## API Reference (for testing)

Base URL: `http://localhost:<server.port>/api` (see
`backend/src/main/resources/application.properties` for the active port).
All endpoints except `/auth/**` require an `Authorization: Bearer <token>`
header, obtained from the login/register response.

### Auth — public

| Method | Endpoint | Body |
|---|---|---|
| POST | `/auth/register` | `{ username, password, email, fullName }` |
| POST | `/auth/login` | `{ username, password }` → returns `{ token, id, username, email, fullName, role }` |

### Posts — requires login

| Method | Endpoint | Notes |
|---|---|---|
| GET | `/posts?search=&sort=date\|popularity\|author&page=0&size=5` | Published feed only |
| GET | `/posts/{id}` | Single post (increments view count) |
| GET | `/posts/mine` | Current user's own posts, any status |
| POST | `/posts` | `{ title, content, tags }` — created as `PENDING` |
| PUT | `/posts/{id}` | Owner only |
| DELETE | `/posts/{id}` | Owner only |

### User — requires login

| Method | Endpoint | Notes |
|---|---|---|
| GET | `/users/me` | Current user's profile |

### Admin — requires `ROLE_ADMIN`

| Method | Endpoint | Notes |
|---|---|---|
| GET | `/admin/posts` | All posts, any status |
| PUT | `/admin/posts/{id}/feature` | Toggle featured flag |
| DELETE | `/admin/posts/{id}` | Hard delete |
| PUT | `/admin/posts/{id}/approve` | `PENDING` → `PUBLISHED` |
| PUT | `/admin/posts/{id}/reject` | `PENDING` → `REJECTED` |
| PUT | `/admin/posts/{id}/remove` | any → `REMOVED` |
| GET | `/admin/users` | List all users |
| PUT | `/admin/users/{id}` | `{ role: "USER" \| "ADMIN" }` |
| DELETE | `/admin/users/{id}` | Delete a user |
| GET | `/admin/reports?type=most-active-users\|most-popular-posts` | Aggregate report data |

**Example (curl):**

```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123"}'

curl http://localhost:8081/api/admin/users \
  -H "Authorization: Bearer <token from above>"
```
