# 🌿 GreenRoot

**Grow Naturally. Live Better.**

A premium, production-quality React Native + Expo mobile app for an Organic
Vegetable Farming & Nursery business — vegetables, fruits, seeds, nursery
plants, gardening essentials, organic fertilizers, and more.

Built with TypeScript, Expo Router, Zustand, and Axios, styled with a
sophisticated nature-inspired design system (deep forest green, organic
green, sage, cream, and gold accents).

---

## 1. Tech Stack

- **React Native** + **Expo SDK 51**
- **TypeScript** (strict mode)
- **Expo Router** (file-based navigation)
- **Zustand** for state management
- **Axios** for API integration (interceptors, error normalization)
- **AsyncStorage** for local persistence (auth token)
- **React Native Reanimated** + **Gesture Handler**
- **Expo Linear Gradient**
- **Lucide React Native** for icons
- **React Native Safe Area Context**

---

## 2. Project Structure

```
greenroot/
├── app/                        # Expo Router screens (file-based routing)
│   ├── (auth)/
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── forgot-password.tsx
│   ├── (tabs)/
│   │   ├── index.tsx           # Home
│   │   ├── categories.tsx
│   │   ├── search.tsx
│   │   ├── wishlist.tsx
│   │   └── profile.tsx
│   ├── product/[id].tsx        # Product detail
│   ├── category/[id].tsx       # Product listing (filters + sort)
│   ├── cart/index.tsx
│   ├── checkout/index.tsx
│   ├── _layout.tsx             # Root stack + font loading
│   └── index.tsx                # Entry redirect → (tabs)
│
├── src/
│   ├── components/
│   │   ├── common/             # PrimaryButton, Rating, PriceDisplay,
│   │   │                       # QuantitySelector, SkeletonLoader,
│   │   │                       # EmptyState, ErrorState, WishlistButton...
│   │   ├── products/           # ProductCard, PlantCard, CategoryCard,
│   │   │                       # ProductGrid, ProductCarousel...
│   │   ├── navigation/         # Header, SearchBar, BottomTabBar
│   │   ├── home/                # HeroCarousel, WhyChooseUs,
│   │   │                       # OrganicFarmingSection
│   │   └── auth/                # AuthInput, SocialButton, Divider
│   │
│   ├── services/
│   │   ├── api.ts               # Axios instance + interceptors
│   │   ├── authService.ts
│   │   ├── productService.ts
│   │   ├── categoryService.ts
│   │   ├── cartService.ts
│   │   ├── wishlistService.ts
│   │   ├── orderService.ts
│   │   └── mock/                 # Mock catalog — fully isolated from UI
│   │
│   ├── store/                    # Zustand: auth, cart, wishlist, product
│   ├── types/                    # Product, User, Cart, Order, etc.
│   ├── theme/                    # colors.ts, typography.ts, spacing.ts
│   ├── constants/                # image URLs
│   └── utils/                    # formatPrice, formatDiscount...
│
├── assets/images/                # icon.png, splash.png, adaptive-icon.png
├── app.json
├── babel.config.js
├── tsconfig.json
└── package.json
```

---

## 3. Installation

```bash
npm install
```

> This project was verified with `npm install` + `npx tsc --noEmit`
> (zero TypeScript errors) before packaging.

---

## 4. Running the App

```bash
npx expo start
```

This opens the Expo Dev Tools. From there:

### Android

- **Physical device:** Install the **Expo Go** app from the Play Store, then
  scan the QR code shown in the terminal/browser.
- **Emulator:** Have Android Studio's emulator running, then press `a` in
  the terminal, or run:
  ```bash
  npx expo start --android
  ```

### iOS

- **Physical device:** Install **Expo Go** from the App Store, then scan the
  QR code with your Camera app.
- **Simulator (macOS only):** Press `i` in the terminal, or run:
  ```bash
  npx expo start --ios
  ```

---

## 5. Where to Connect Your Backend API

All network calls are centralized in `src/services/`. Nothing in the UI
layer calls `fetch`/`axios` directly — screens only call service methods
like `productService.getFeatured()` — so switching from mock data to a real
backend requires **no screen changes**.

### Step 1 — Point Axios at your API

Start the API from the project directory:

```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

For a physical device, set `EXPO_PUBLIC_API_URL` to your computer's LAN
address (for example `http://192.168.1.20:4000/v1`) instead of `localhost`.

Edit `src/services/api.ts`:

```ts
export const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://api.yourdomain.com/v1";
```

Or set an environment variable in a `.env` file at the project root:

```
EXPO_PUBLIC_API_URL=https://api.yourdomain.com/v1
```

### Step 2 — Use the real API

The auth, catalog, and order services use the real API by default. Set
`EXPO_PUBLIC_USE_MOCK=true` only when you intentionally want mock data.

```ts
const USE_MOCK = true;
```

Set it to `false` once your backend endpoints are live. Every method already
has the real `api.get/post/put/delete` call written and ready — it's simply
gated behind this flag today so the app runs standalone with realistic data.

### Step 3 — Match your response shape

All API responses are expected in the shape:

```ts
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
```

If your backend returns a different envelope, adjust the `res.data.data`
accessors in each service method accordingly.

### Expected REST Endpoints (Node.js / MERN-ready)

| Method | Endpoint                          | Used by                          |
|--------|------------------------------------|-----------------------------------|
| POST   | `/auth/login`                     | `authService.login`               |
| POST   | `/auth/register`                  | `authService.register`            |
| GET    | `/auth/me`                        | `authService.getCurrentUser`      |
| GET    | `/products`                       | `productService.getProducts`      |
| GET    | `/products/:id`                   | `productService.getProductById`   |
| GET    | `/products/featured`              | Home "Fresh Picks"                |
| GET    | `/products/nursery`                | Home "Bring Nature Home"          |
| GET    | `/products/farming-essentials`     | Home "Seasonal Collection"        |
| GET    | `/products/search?q=`             | Search screen                     |
| GET    | `/categories`                     | Categories tab, Home               |
| GET    | `/categories/:id`                 | Category listing header            |
| GET    | `/categories/:id/products`        | Category listing grid              |
| GET    | `/wishlist`                       | Wishlist (if server-synced)        |
| POST   | `/wishlist`                       | Add to wishlist                    |
| DELETE | `/wishlist/:productId`            | Remove from wishlist               |
| GET    | `/orders`                         | Order history                      |
| POST   | `/orders`                         | Checkout → place order             |

Auth token is stored in `AsyncStorage` under the key `@greenroot/auth_token`
and automatically attached as a `Bearer` token to every outgoing request via
the Axios request interceptor in `api.ts`.

---

## 6. Replacing Mock Data with Real API Data

Mock data lives entirely in `src/services/mock/` (`products.ts`,
`categories.ts`) and is only ever imported by the service layer — never by
components or screens. To go live:

1. Set `EXPO_PUBLIC_USE_MOCK=true` if you need local mock data again.
2. Optionally delete `src/services/mock/` once you no longer need local
   fallback data for development/demos.
3. No changes needed in `store/` (Zustand stores already call the service
   layer) or in any screen/component.

---

## 7. State Management

- `store/authStore.ts` — user session, login/register/logout, hydration on
  app launch.
- `store/cartStore.ts` — cart items, quantity updates, save-for-later,
  computed subtotal/discount/delivery/total.
- `store/wishlistStore.ts` — wishlist toggle + membership check.
- `store/productStore.ts` — home page data (featured, nursery, farming
  essentials, categories) and search results.

All stores are plain Zustand — no providers required, just
`useAuthStore()`, `useCartStore()`, etc. from any component.

---

## 8. Production Build Instructions

This project uses **EAS Build** (Expo Application Services), the modern
replacement for the classic `expo build` command.

### One-time setup

```bash
npm install -g eas-cli
eas login
eas build:configure
```

This generates an `eas.json` with `development`, `preview`, and
`production` build profiles.

### Android (AAB for Play Store)

```bash
eas build --platform android --profile production
```

### iOS (requires an Apple Developer account)

```bash
eas build --platform ios --profile production
```

### Submitting to the stores

```bash
eas submit --platform android
eas submit --platform ios
```

> Before your first production build, replace the placeholder assets in
> `assets/images/` (`icon.png`, `adaptive-icon.png`, `splash.png`,
> `favicon.png`) with your final brand artwork, and update
> `ios.bundleIdentifier` / `android.package` in `app.json` to your real
> reverse-domain identifiers.

---

## 9. Design System Reference

| Token              | Value      | Usage                          |
|---------------------|-----------|----------------------------------|
| `primary.forest`   | `#173F2A` | Headings, primary buttons        |
| `primary.organic`  | `#2E7D4F` | Active states, links, CTAs       |
| `primary.fresh`    | `#5FAF68` | Accents, success indicators      |
| `secondary.sage`   | `#A8C3A0` | Subtle backgrounds                |
| `secondary.cream`  | `#F7F5EC` | Section backgrounds                |
| `accent.gold`      | `#D6A84F` | Hero CTAs, ratings                 |
| `background.default`| `#FCFCF8`| Screen background                  |

Typography uses **Poppins** for display/headings and **Inter** for body
text, loaded via `@expo-google-fonts/*` in `app/_layout.tsx`.

---

## 10. Notes

- The app currently opens straight into the tab navigator
  (`app/index.tsx` → `Redirect href="/(tabs)"`). To require sign-in first,
  change this redirect to `/(auth)/login` and add an auth guard.
- Cart and wishlist state is in-memory (Zustand) and resets on app restart.
  Wire `cartService.syncCart()` / `wishlistService` to persist server-side
  once your backend is connected, or add a Zustand `persist` middleware
  with AsyncStorage for local-only persistence.
- All images are placeholder Unsplash URLs defined in
  `src/constants/images.ts` and `src/services/mock/products.ts` — swap for
  your own CDN/product photography by editing those files only.
