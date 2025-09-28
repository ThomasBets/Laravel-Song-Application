Follow these steps to set up and run the project locally.

---

##  Requirements
Make sure the following are installed on your computer:
- **PHP** (v8.0+ recommended)
- **Composer** (PHP dependency manager)
- **MySQL / MariaDB** (or another supported database)
- **Node.js & npm** (for frontend assets, if applicable)
- **Git** (to clone the repository)

---

##  Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/your-laravel-project.git
cd your-laravel-project
```

### 2. Install PHP Dependencies
```bash
composer install
```

### 3. Install Node Dependencies (if applicable)
```bash
npm install
```
```bash
npm install -g vite
```

### 4. Configure Environment
- Copy `.env.example` to `.env`:
  ```bash
  cp .env.example .env
  ```
- Or create a .env file if .env.example does not exist
  
- Open `.env` and update:
  - Database name
  - Database username
  - Database password
  - (Other configs like mail, API keys, etc.)

### 5. Generate Application Key
```bash
php artisan key:generate
```

### 6. Set Up Database
- Create a database in MySQL (use the name from `.env`).
- Run migrations:
  ```bash
  php artisan migrate
  ```
- (Optional) Seed demo data:
  ```bash
  php artisan db:seed
  ```

### 7. Build Frontend Assets (if applicable)

```bash
npm install -g vite
```

```bash
npm run dev
```
(or `npm run build` for production)

### 8. Run the Development Server
```bash
php artisan serve
```
Now visit [http://localhost:8000](http://localhost:8000)

---
