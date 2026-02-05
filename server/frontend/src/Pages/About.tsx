// src/Pages/About.tsx
import { Link } from "@inertiajs/react";

export default function About({ title }: { title: string }) {
  return (
    <div>
      <h1>{title}</h1>
      <Link href="/">Back to Home Now</Link>
    </div>
  );
}
