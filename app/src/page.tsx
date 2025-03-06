import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center">
            Welcome to <span className="text-blue-600">SHENSTACK</span>
          </CardTitle>
          <CardDescription className="text-center text-lg">
            The modern full-stack development experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FeatureCard
                title="Frontend"
                items={[
                  "Next.js",
                  "ShadCN UI",
                  "TailwindCSS",
                  "Zustand",
                  "React Query",
                ]}
              />
              <FeatureCard
                title="Backend"
                items={["ElysiaJS", "DrizzleORM", "Bun Runtime"]}
              />
            </div>
            <div className="flex justify-center mt-6">
              <Button asChild>
                <Link href="/api/hello">Test API Endpoint</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

function FeatureCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="border rounded-lg p-4">
      <h2 className="font-semibold text-lg mb-2">{title}</h2>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item} className="text-sm flex items-center gap-2">
            <span className="text-green-500">✓</span> {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
