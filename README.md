# StayEase 🏨

> A modern hotel room booking system — browse, reserve, and manage your stays with ease.

---

## Overview

StayEase is a full-stack web application built with plain HTML, CSS, and PHP. Guests can register, browse available rooms, and make reservations. Admins manage rooms and oversee all bookings through a dedicated panel.

Built as a university team project by 6 members, covering real-world concepts: authentication, sessions, CRUD operations, relational databases, and role-based access control.

---

## Features

- User registration and login with secure password hashing
- Browse rooms with filtering by type
- Room detail pages with full description and pricing
- Booking system with date validation and availability checks
- User dashboard with booking history and cancellation
- Admin panel for managing rooms and confirming bookings

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
├── css/              # One CSS file per member
├── php/              # PHP logic + shared config
├── assets/images/    # Room and UI images
└── *.html            # 12 pages across 6 members
```

---

## Team

| Name            | Responsibility         |
|-----------------|------------------------|
| Anas Mohamed    | Authentication & DB    |
| Mohamed Gamil   | Public pages & contact |
| Ahmed Tarig     | Rooms & room detail    |
| Mohsen Mohamed  | Booking flow           |
| Yassin Abdullah | User dashboard         |
| Tarek Elsayed   | Admin panel            |

---

## Getting Started

1. Clone the repo
2. Import the database schema into MySQL as `stayease_db`
3. Update credentials in `php/config.php` if needed
4. Serve via XAMPP or any local PHP server
5. Open `index.html` to get started

---

<p align="center">Built with care by the StayEase team</p>
