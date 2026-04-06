import type { Route } from "./+types/home";
import Navbar from "../../components/Navbar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="home">
      <Navbar />
      <h1 className="text-3xl font-extrabold text-indigo-700">Home</h1>
    </div>
  );
}
