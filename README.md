![StayEase](assets/images/logo.png)

> A modern hotel discovery & booking platform — search hotels, explore rooms, and manage your stays with ease.

---

## Overview

StayEase is a full-stack web application built with plain HTML, CSS, and PHP. Users can register, search hotels by city, browse rooms, make reservations, and leave reviews. Built as a university team project by 6 members, covering real-world concepts: authentication, sessions, CRUD operations, relational databases, and multi-table JOINs.

---

## Features

- User registration and login with secure password hashing
- Search hotels by city with dynamic results
- Hotel detail pages with room listings and average review rating
- Room detail pages with full description and pricing
- Booking system with date validation and availability checks
- User dashboard with booking history and cancellation
- Hotel reviews with rating system (one review per user per hotel)

---

## Tech Stack

| Layer    | Technology          |
|----------|---------------------|
| Frontend | HTML5, CSS3         |
| Backend  | PHP (no frameworks) |
| Database | MySQL (PDO)         |
| Icons    | Font Awesome 6      |
| Font     | Plus Jakarta Sans   |

---

## Project Structure

```
stayease/
├── css/                  # One CSS file per member
├── php/                  # PHP logic + shared config
├── assets/images/        # Hotel and room images
└── *.html                # 12 pages across 6 members
```

---

## Team

| Name            | Responsibility              |
|-----------------|-----------------------------|
| Anas Mohamed    | Authentication & DB setup   |
| Mohamed Gamil   | Homepage & hotel search     |
| Tarek Elsayed   | Hotel detail & room pages   |
| Mohsen Mohamed  | Booking flow                |
| Yassin Abdullah | User dashboard              |
| Ahmed Tarig     | Reviews & about page        |

---

## Getting Started

1. Clone the repo
2. Import the database schema into MySQL as `stayease_db`
3. Update credentials in `php/config.php` if needed
4. Serve via XAMPP or any local PHP server
5. Open `index.html` to get started

---

<p align="center">Built with care by the StayEase team</p>