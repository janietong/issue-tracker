# 🛠️ Issue Tracker

A full-stack issue tracking application built with Next.js and React that enables users to efficiently manage, assign, and track personal or professional tasks. Featuring OAuth sign-in, sorting/filtering, real-time dashboard summaries, and a sleek UI, this tool supports individual and collaborative workflows with ease.

---

## 🚀 Getting Started

### Clone the repository

```bash
git clone https://github.com/your-username/issue-tracker.git
cd issue-tracker

### 1. Install dependencies
npm install

### 2. Set up the database
Ensure you have a MySQL server running locally or remotely.

Create a .env file in the root directory and add:

DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"
NEXTAUTH_SECRET="your-random-secret"
NEXTAUTH_URL="http://localhost:3000"

Then run:

npx prisma generate
npx prisma migrate dev --name init

### 3. Run the development server
npm run dev

```
## 💬 Features
- 🔐 OAuth sign-in (Google)

- 🧑‍🤝‍🧑 Assign issues to users and collaborate across sessions

- ✅ Create, edit, sort, and filter issues by status or recency

- 📊 Dashboard view with recent activity and summary insights

- 🎨 Clean, responsive UI with Radix UI + Tailwind CSS

## 🧰 Technologies Used
React, Next.js, Tailwind CSS, Radix UI, Prisma, MySQL, OAuth