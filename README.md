
# DOT FULLTIME BACKEND NODE JS TEST

Haloo semuanya, sebelumnya perkenalkan nama saya 
Sigit Prasetyo Noprianto. Welcome to repository :). 
Project yang saya buat kali ini diperuntukkan sebagai test online
untuk  posisi Fulltime Backend di PT. Digdaya Olah Teknologi.
Project yang saya buat ini, digunakan untuk proses transaksi
penjualan dan pembelian buku, dimana user bisa menjual buku yang dia punya 
dan user juga bisa membeli buku dari user lain.



## Tech Stack

Untuk project kali ini, teknologi yang digunakan adalah sebagai berikut:

**Framework** : Node JS, Express

**DBMS** : MySql

**ORM** : sequelize

**Caching** : redis


## Installation

Berikut ini merupakan tahapan dalam menggunakan project ini. Sebelum menggunakan project ini,
pastikan anda telah menginstall beberapa hal berikut ke dalam perangkat anda:
```bash
    1. Node Package manager
    2. Redis
    3. MySQL
```

Clone repository ini terlebih dahulu

```bash
  git clone https://github.com/noprisigit/dot-backend-test.git
```

Install project (Pastikan anda telah menginstall `node package manager` di perangkat anda)
```bash
  cd dot-backend-test
  npm install
```

Jalankan redis
```bash
   redis-server
```

Jalankan project
```bash
  npm run start
```
    
## API Reference

Berikut ini merupakan referensi API yang tersedia pada
project kali ini.

### # User Endpoint
#### Create a new User

```http
  POST /api/v1/register
```

| Body       | Type     | Description                 |
| :--------  | :------- | :-------------------------  |
| `name`     | `string` | **Required**. Your name     |
| `email`    | `string` | **Required**. Your email    |
| `password` | `string` | **Required**. Your password |

#### Login

```http
  POST /api/v1/login
```

| Body       | Type     | Description                 |
| :--------  | :------- | :-------------------------  |
| `email`    | `string` | **Required**. Your email    |
| `password` | `string` | **Required**. Your password |

### # Book Endpoint

Sebelum menggunakan book endpoint ini, pastikan anda telah login terlebih dahulu, kemudian masukkan `token` ke dalam `x-access-token` di header.
Contohnya seperti ini`x-access-token = token`.

```http
  1. POST /api/v1/books/
  2. GET /api/v1/books/
  POST /api/v1/login
```

#### Create a new book
```http
  POST /api/v1/books
```
| Body            | Type      | Description                    |
| :--------       | :-------  | :-------------------------     |
| `title`         | `string`  | **Required**. Book title       |
| `description`   | `string`  | **Required**. Book description |
| `author`        | `string`  | **Required**. Book author      |
| `publisher`     | `string`  | **Required**. Book publisher   |
| `released_date` | `date`    | **Required**. Book released_date (`format: 2022-10-01`) |
| `price`         | `float`   | **Required**. Book price       |
| `stock`         | `integer` | **Required**. Book stock       |

#### Get all books
```http
  GET /api/v1/books
```

#### Get book by ID
```http
  GET /api/v1/books/:id
```
| Params          | Type      | Description      |
| :--------       | :-------  | :--------------- |
| `id`            | `integer` | Book ID       |

#### Updating book
```http
  PUT /api/v1/books/:id
```
| Params          | Type      | Description      |
| :--------       | :-------  | :--------------- |
| `id`            | `integer` | Book ID       |


| Body            | Type      | Description                    |
| :--------       | :-------  | :-------------------------     |
| `title`         | `string`  | Book title       |
| `description`   | `string`  | Book description |
| `author`        | `string`  | Book author      |
| `publisher`     | `string`  | Book publisher   |
| `released_date` | `date`    | Book released_date (`format: 2022-10-01`) |
| `price`         | `float`   | Book price       |
| `stock`         | `integer` | Book stock       |

#### Delete a book
```http
  DELETE /api/v1/books/:id
```
| Params          | Type      | Description      |
| :--------       | :-------  | :--------------- |
| `id`            | `integer` | Book ID       |

### # Transaction Endpoint

Sebelum menggunakan transaction endpoint ini, pastikan anda telah login terlebih dahulu, kemudian masukkan `token` ke dalam `x-access-token` di header.
Contohnya seperti ini`x-access-token = token`.

#### Create a transaction
```http
  POST /api/v1/transactions
```
| Body         | Type      | Description   |
| :--------    | :-------  | :------------ |
| `book_id`    | `integer` | Book ID       |
| `quantity`   | `integer` | Book quantity |

#### Get all transactions
```http
  GET /api/v1/transactions
```
#### Get transaction by ID
```http
  GET /api/v1/transactions/:id
```

| Params          | Type      | Description      |
| :--------       | :-------  | :--------------- |
| `id`            | `integer` | Transaction ID       |

#### Get transaction by user ID
```http
  GET /api/v1/transactions/user/:user_id
```

| Params          | Type      | Description      |
| :--------       | :-------  | :--------------- |
| `user_id`            | `integer` | User ID       |

#### Get transaction by book ID
```http
  GET /api/v1/transactions/book/:book_id
```

| Params          | Type      | Description      |
| :--------       | :-------  | :--------------- |
| `book_id`            | `integer` | Book ID       |

