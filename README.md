## Latihan Nest

Teknologi yang digunakan:

- TypeScript
- Nest Js
- Drizzle ORM

Database yang digunakan:

- PostgreSQL (database)
- MongoDB

## Project setup

```bash
$ npm install
```

```bash
cp .env.example .env
```

## Setup Driizle

Untuk informasi lebih lanjut, baca dokumentasi resmi di [Drizzle ORM Documentation](https://orm.drizzle.team/docs/get-started/postgresql-new).

### Step 1: Generate dari Model

```bash
npx drizzle-kit generate
```

### Step 2: Menjalankan Migration

```bash
npx drizzle-kit push
```

### Step 3: Menjalankan Seeder

Jalankan file seeder sesuai dengan nama file di folder `seed`. Contoh:

```bash
npx ts-node src/seed/seedUser.ts
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
