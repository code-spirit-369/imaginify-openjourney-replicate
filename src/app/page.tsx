import { ImageGenerator } from "@/components/image-generator";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between md:p-24">
      <ImageGenerator />
    </main>
  );
}
