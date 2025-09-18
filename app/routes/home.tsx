import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import { resumes } from "~/constants";
import ResumeCard from "~/components/ResumeCard";

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
        <div className="page-heading py-16">
          <h1>
            Track Your Applications And Resume Ratings
          </h1>

        </div>
      </section>
      {resumes.length > 0 && (
        <div className="resumes-section">
          {resumes.map((resume)=>(
            <ResumeCard key={resume.id} resume={resume}></ResumeCard>
          ))}
        </div>
      )}
    </main>
  ) 
}