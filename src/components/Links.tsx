import { Card, CardContent } from "@/components/ui/card";
import { getLinksConfig } from '@/lib/config';
import type { Config } from "@/types/config";

export default function Links() {
  const links = getLinksConfig();

  return (
    <div className="grid gap-4">
      {links.map((link: Config["links"][0]) => (
        <Card key={link.title}>
          <CardContent className="p-4">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-primary hover:underline"
            >
              {link.title}
            </a>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
