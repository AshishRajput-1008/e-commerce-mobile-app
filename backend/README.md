# GreenRoot API

Node/Express + MongoDB API for the mobile app. Copy `.env.example` to `.env`, start MongoDB, then run:

Order placement uses a MongoDB transaction so stock cannot be oversold; use
MongoDB Atlas or a local MongoDB replica set (transactions are not available
on a standalone MongoDB process).

```bash
npm install
npm run seed
npm run dev
```

The API is served under `http://localhost:4000/v1`. Customers can register/login, manage addresses, browse the Vegetables and Plants catalog, place COD orders, and view order history. Admin-only endpoints create products, update stock, list low-stock products, list all orders, and update order status. The seed admin is `admin@greenroot.local` / `Admin@123`; change it before production.
