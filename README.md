# OAuth Authentication System with Passport.js

## Overview
This project implements authentication using Passport.js with Google OAuth 2.0 (Google Strategy). It also supports adding bonus points for users who log in using additional strategies such as Facebook, Twitter, Instagram, Telegram, and others. User information retrieved from Google or other platforms is stored in the database.

## Features

### User Authentication
- **Google OAuth 2.0**:
  - `/auth/google`: Authenticates users via Google.
  - `/auth/google/callback`: Google redirects to this route after authentication.
  - User information from Google (such as name, email, etc.) is saved to the database if it's a first-time login. On subsequent logins, the user is recognized, and no duplicate entries are created.

- **Other OAuth Providers**:
  - Bonus points are added for users who log in via additional providers like Facebook, Twitter, Instagram, or Telegram.
  - Each login via a new provider adds a set amount of points to the user’s account.
  - You can extend authentication using other strategies, such as:
    - `/auth/facebook`: Authenticate with Facebook.
    - `/auth/twitter`: Authenticate with Twitter.
    - `/auth/instagram`: Authenticate with Instagram.
    - `/auth/telegram`: Authenticate with Telegram.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/oauth-auth-system.git
   cd oauth-auth-system
