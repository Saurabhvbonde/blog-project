# Simple Blogging Platform — Implementation Plan

> **Status: Implemented.** This file was originally written as a pre-build
> plan; it now also reflects what was actually built. Sections below are
> unchanged from the agreed plan except where noted — search for **"As
> built"** notes for the few places implementation details were pinned down
> during coding (exact file names, response shapes, etc.). See
> [README.md](README.md) for setup/run instructions aimed at non-developers.

This file is the single source of truth for building the project described in
`Simple Blogging Platform_ Page Descriptions.docx`. It was written after reading
that document in full (text + all 9 embedded wireframe images).

## 1. What the document actually asks for

A blogging platform with two roles, **USER** and **ADMIN**, sharing one login/
registration flow but landing on different dashboards.

**Shared**
- Login Page — username, password, "Login" button, link to Registration.
- Registration Page — username, password, email, full name, "Register" button,
  link back to Login.

**User side (dashboard nav: Home / Create New Post / Profile)**
- Home — list of blog posts (title, excerpt, author, date, "Read More"),
  search bar (title/author/keyword), sort (date/popularity/author), pagination.
- Create New Post — title, content (rich text), tags, Publish button.
- Own posts — Edit / Delete actions next to posts the logged-in user authored.
- Profile — name, email, list of the user's own posts (each with Edit/Delete),
  Logout.

**Admin side (dashboard nav: Manage Posts / Manage Users / Post Moderation / Reports)**
- Manage Posts — table of *all* posts (title, author, date, status) with
  Edit / Delete / Feature actions.
- Manage Users — table of users (username, email, role) with Edit / Delete.
- Post Moderation — table of pending posts with Approve / Reject / Remove.
- Reports — dropdown to select a report (e.g. "Most Active Users", "Most
  Popular Posts") + "Generate Report" button.

**Cross-cutting notes from the doc**: consistent UI/color scheme across pages,
responsive layout, security best practices (input validation, password
hashing), smooth navigation between Login/Register/Home/Profile, and a
straightforward admin entry point to manage posts/users.

## 2. Tech stack (as specified)

| Layer | Choice |
|---|---|
| Language/runtime | Java 17 |
| Framework | Spring Boot 3.x |
| Security | Spring Security + JWT (stateless, filter-based) |
| Validation | Jakarta Bean Validation (`spring-boot-starter-validation`) |
| Boilerplate reduction | Lombok |
| Database | MySQL 8 |
| ORM | Spring Data JPA / Hibernate |
| Frontend | React (Vite) |
| Styling | Bootstrap 5 |
| HTTP client | Axios |
| Build | Maven (backend), npm (frontend) |

## 3. Project layout

**As built** — `backend` targets Spring Boot 3.3.4 (start.spring.io now only
offers the newer, less battle-tested 4.x line; 3.3.4 was pinned by hand for
stability). JWT signing/parsing uses `jjwt` (api/impl/jackson, 0.12.6),
added by hand since Spring Initializr doesn't bundle a JWT library. On the
frontend, `CreatePostPage`/`EditPostPage` were consolidated into a single
`PostForm.jsx` (shared by both routes, driven by a `mode` prop) since the two
forms are identical; a `PostDetailPage.jsx` was added for the "Read More"
link that the wireframe implies but doesn't name; and `Navbar` became
`DashboardLayout.jsx`, a single shared shell (dark header + pill nav +
white content card + dark footer, matching every wireframe) reused by both
`UserLayout.jsx` and `AdminLayout.jsx` rather than a bare `Navbar`.

```
Task/
├── backend/          # Spring Boot app
│   └── src/main/java/com/blog/
│       ├── config/          # SecurityConfig, DataSeeder (creates the admin account on first boot)
│       ├── security/        # JwtUtil, JwtAuthFilter, UserDetailsServiceImpl, CurrentUserProvider
│       ├── controller/       # AuthController, PostController, UserController, AdminController
│       ├── dto/              # request/response DTOs, split into auth/ post/ user/ admin/
│       ├── entity/           # User, Post, enums Role/PostStatus
│       ├── repository/       # Spring Data JPA repositories
│       ├── service/          # AuthService, PostService, UserService, AdminService
│       └── exception/        # GlobalExceptionHandler + ApiException hierarchy
│   └── src/main/resources/application.properties
└── frontend/          # React app
    └── src/
        ├── api/               # axios.js (instance + JWT interceptor), auth.js, posts.js, admin.js
        ├── auth/              # AuthContext, ProtectedRoute, AdminRoute
        ├── components/        # DashboardLayout, PostCard, Pagination, SearchSortBar
        └── pages/
            ├── LoginPage.jsx, RegisterPage.jsx
            ├── user/  UserLayout.jsx, HomePage.jsx, PostForm.jsx, PostDetailPage.jsx, ProfilePage.jsx
            └── admin/ AdminLayout.jsx, ManagePostsPage.jsx, ManageUsersPage.jsx, ModerationPage.jsx, ReportsPage.jsx
```

## 4. Data model

**users**
| column | type | notes |
|---|---|---|
| id | BIGINT PK | |
| username | VARCHAR unique | |
| email | VARCHAR unique | |
| full_name | VARCHAR | |
| password | VARCHAR | BCrypt hash |
| role | ENUM('USER','ADMIN') | default USER |
| created_at | TIMESTAMP | |

**posts**
| column | type | notes |
|---|---|---|
| id | BIGINT PK | |
| title | VARCHAR | |
| content | TEXT | |
| tags | VARCHAR | stored comma-separated (simplest match to the wireframe's "comma separated tags" field) |
| author_id | BIGINT FK -> users.id | |
| status | ENUM('PENDING','PUBLISHED','REJECTED','REMOVED') | new posts start PENDING, admin approves -> PUBLISHED |
| featured | BOOLEAN | default false, set via admin "Feature" action |
| views | INT | default 0, powers the "Most Popular Posts" report and "sort by popularity" |
| created_at | TIMESTAMP | used for "sort by date" and excerpt/date display |
| updated_at | TIMESTAMP | |

Only `PUBLISHED` posts (and the owner's own posts regardless of status) show
on the public Home feed; admins see everything in Manage Posts / Moderation.

## 5. API design

**As built** — `GET /api/posts` ended up requiring a JWT like every other
`/api/**` route (only `/api/auth/**` is unauthenticated), rather than being
truly public. This matches the wireframes as drawn: the Home feed only
exists inside the logged-in "Blog Dashboard" shell, and the React app's
`HomePage` is wrapped in `ProtectedRoute`, so there was never a scenario
where an anonymous visitor reaches it. Flag if a logged-out public feed is
actually wanted — it's a small change (add the route to the `permitAll`
list).

**Auth (public)**
- `POST /api/auth/register` — create USER account
- `POST /api/auth/login` — returns JWT + role

**Posts (JWT required)**
- `GET /api/posts` — feed, query params `search`, `sort`, `page`, `size` (only PUBLISHED)
- `GET /api/posts/{id}` — single post
- `GET /api/posts/mine` — current user's own posts (any status), for Profile page
- `POST /api/posts` — create (defaults to PENDING)
- `PUT /api/posts/{id}` — update, owner only
- `DELETE /api/posts/{id}` — delete, owner only

**User**
- `GET /api/users/me` — profile info

**Admin only (`ROLE_ADMIN`)**
- `GET /api/admin/posts` — all posts, any status
- `PUT /api/admin/posts/{id}/feature` — toggle featured
- `DELETE /api/admin/posts/{id}` — hard delete
- `PUT /api/admin/posts/{id}/approve` — PENDING -> PUBLISHED
- `PUT /api/admin/posts/{id}/reject` — PENDING -> REJECTED
- `PUT /api/admin/posts/{id}/remove` — any -> REMOVED
- `GET /api/admin/users` — list users
- `PUT /api/admin/users/{id}` — edit role
- `DELETE /api/admin/users/{id}` — delete user
- `GET /api/admin/reports?type=most-active-users|most-popular-posts` — aggregate queries

## 6. Security design

- Passwords hashed with `BCryptPasswordEncoder`.
- Stateless session (`SessionCreationPolicy.STATELESS`), CSRF disabled (pure API + JWT).
- `JwtAuthFilter` (extends `OncePerRequestFilter`) reads `Authorization: Bearer <token>`,
  validates signature/expiry, loads user, sets `SecurityContext`.
- `/api/auth/**` permit-all; `/api/admin/**` requires `ROLE_ADMIN`; everything
  else requires authentication. Method-level `@PreAuthorize` on admin service
  methods as a second guard.
- Bean validation (`@NotBlank`, `@Email`, `@Size`) on all request DTOs;
  `GlobalExceptionHandler` (`@RestControllerAdvice`) turns validation errors
  and auth failures into consistent JSON error responses.

## 7. Frontend plan

- React Router routes matching the wireframes 1:1: `/login`, `/register`,
  `/` (Home), `/posts/new`, `/posts/:id/edit`, `/profile`, and an admin
  section `/admin/posts`, `/admin/users`, `/admin/moderation`, `/admin/reports`.
- `AuthContext` holds JWT + decoded role, persisted in `localStorage`; Axios
  request interceptor attaches the token.
- `ProtectedRoute` (any logged-in user) and `AdminRoute` (role check, else
  redirect) wrap the respective route groups.
- Bootstrap 5 dark navbar/sidebar reused across dashboards (mirrors the dark
  "Blog Dashboard" / "Admin Blog Dashboard" header + nav bar seen in every
  wireframe); card-style white content panel below it, matching the mockups.
- Reusable components: `PostCard`, `PostTable` (admin), `UserTable` (admin),
  `Pagination`, `SearchSortBar`.

## 8. Build order (milestones)

All nine milestones are complete.

1. ✅ **Backend skeleton** — Maven project, dependencies, `application.properties`
   (MySQL datasource), entities + repositories.
2. ✅ **Auth** — register/login endpoints, JWT util, security filter chain,
   global exception handling.
3. ✅ **Post CRUD (user)** — create/list/search/sort/paginate/edit/delete own
   posts, profile endpoint.
4. ✅ **Admin endpoints** — manage posts, manage users, moderation, reports.
5. ✅ **Frontend skeleton** — Vite React app, Bootstrap, routing, Axios setup,
   Auth context.
6. ✅ **Auth pages** — Login, Register (wired to backend).
7. ✅ **User pages** — Home (feed/search/sort/pagination), Create/Edit Post,
   Profile.
8. ✅ **Admin pages** — Manage Posts, Manage Users, Post Moderation, Reports.
9. ✅ **Polish** — consistent styling pass, responsive checks, empty/error/
   loading states, end-to-end manual test of both roles.

## 9. Assumptions (flag if wrong)

- "Popularity" sort/report is driven by a `views` counter incremented on
  `GET /api/posts/{id}`, since the doc doesn't define popularity explicitly.
- Tags are stored as a single comma-separated string rather than a
  many-to-many `Tag` entity — matches the wireframe's plain text field and
  avoids over-engineering for a "simple" blogging platform.
- New posts require admin approval (PENDING → PUBLISHED) before appearing on
  the public feed, per the Post Moderation screen; the user's own Profile
  page shows their posts regardless of status.
- No image/file upload for posts — the wireframes only show a text content
  field.
- Reports page ships with two report types (Most Active Users, Most Popular
  Posts) as literally named in the wireframe dropdown.

## 10. Verification

The full user/admin flow — register → login → write a post (goes to
PENDING) → admin approves it in Post Moderation → it appears on the public
Home feed → admin generates both report types → a non-admin JWT is rejected
with 403 on `/api/admin/**` — was run end-to-end against a running instance
of the backend and frontend together and confirmed working, including
field-level validation error messages surfacing correctly in the
Login/Register/Post forms.

This was run against a temporary in-memory database rather than the
project's real MySQL instance, since local MySQL credentials weren't
available during the build. Nothing in the code is environment-specific to
that choice (it's a plain `spring.datasource.*` swap), but it's worth a
final pass against real MySQL to be sure — see README.md's "What was
verified before handoff" section.

One environment quirk found on this machine, in case it resurfaces: an
unrelated Oracle service (`TNSLSNR`) was already listening on port 8080,
which is why the backend now runs on 8081 in `application.properties`. The
frontend's `vite.config.js` proxy target must always match whatever port
`server.port` is set to, or login/register calls silently hit the wrong
process and the UI shows a generic "Invalid username or password" for
what's actually a connectivity mismatch.

---
This plan is now an as-built reference. Update it alongside the code when
behavior changes materially, rather than letting it drift out of date.
