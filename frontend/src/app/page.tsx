import Navbar from "@/src/app/components/Navbar";

export default function Home() {
  return (
      <>
        <Navbar />
        <main className="p-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Build Your Dev Resume</h1>
          <p className="text-lg text-gray-600">Create, preview, and share your resume in one place.</p>
        </main>
      </>
  );
}
