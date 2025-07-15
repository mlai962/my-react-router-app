import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { useLoaderData } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export function clientLoader() {
  return { message: "Hello from Vercel" };
}

export default function Home() {
  const message = (useLoaderData() as { message: string }).message;

  return <Welcome message={message} />;
}
