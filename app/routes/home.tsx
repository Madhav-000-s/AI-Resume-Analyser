import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resume Analyser" },
    { name: "description", content: "New way to anlayse your Resume!" },
  ];
}

export default function Home() {
  return(
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar></Navbar>
      <section className="main-section">
        <div className="page-heading">
          <h1>
            Track Your Applications And Resume Ratings
          </h1>

        </div>
      </section>
    </main>
  ) 
}