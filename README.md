# 📚 Book Directory

A simple web application for managing a catalog of books and authors.  
Built on the **Laravel**, **Inertia.js**, and **React** stack.

---

## 🛠 Tech Stack
```bash
Backend: Laravel 11
Frontend: React 18
Adapter: Inertia.js
Frontend Bundler: Vite
Database: MySQL

⚙️ Prerequisites

Before you begin, ensure you have the following installed:

PHP >= 8.2
Composer 2.x
Node.js >= 22.12.0
NPM (comes with Node.js)
MySQL database server

🚀 Local Installation Guide
1. Clone the repository
git clone https://github.com/your-username/book-directory.git
cd book-directory

2. Install dependencies
# Install PHP packages
composer install

# Install JS packages
npm install

3. Configure the environment file
cp .env.example .env

4. Generate the application key
php artisan key:generate

5. Set up the database connection

Create a new database in MySQL (e.g., book_directory).

Update the .env file:

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=book_directory  # <-- Your DB name
DB_USERNAME=root            # <-- Your DB username
DB_PASSWORD=                # <-- Your DB password

6. Run the database migrations
php artisan migrate

7. Create the storage symbolic link
php artisan storage:link

▶️ Running in Development Mode

Open two terminal windows:

Terminal 1: Start Laravel Backend
php artisan serve


App will be available at 👉 http://127.0.0.1:8000

Terminal 2: Start Vite Frontend
npm run dev



Open 👉 http://127.0.0.1:8000
 in your browser and start using the app 🚀
