# ModShop

ModShop is a modern, behavior-aware e-commerce web application built with Next.js. It offers a seamless shopping
experience with features like persistent cart, animated interactions, local order history, and a simple profile
system, all running entirely in the browser using local storage. ModShop is designed for demo, prototyping, and
educational purposes. This application is built as part of a group project for the "Designing Human-Centered AI Systems"
master's course at Delft University of Technology.

## How to Run Locally

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000) to use ModShop.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org) (App Router, React Server/Client Components)
- **Styling:** Tailwind CSS
- **State Management:** React Context API (Cart & Auth)
- **Persistence:** Browser Local Storage (cart, user, orders)
- **MDX:** Product descriptions via MDX files
- **Icons:** [Lucide React](https://lucide.dev)
- **Fonts:** [Gabarito](https://fonts.google.com/specimen/Gabarito) via next/font

---

For more details, see the code and comments in the repository.
