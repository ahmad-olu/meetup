// src/Pages/Home.tsx
import { Link } from "@inertiajs/react";

export default function Home({
  message,
  user,
  count,
}: {
  message: string;
  user: string;
  count: number;
}) {
  return (
    <div>
      <h1>Welcome {user}!</h1>
      <p>{message}</p>
      <p>Count: {count}</p>
      <Link href="/about">Go to About Now</Link>
    </div>
  );
}
