import { getFooterConfig } from '@/lib/config';

export default function Footer() {
  const footer = getFooterConfig();

  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose md:text-left">{footer.text}</p>
        </div>
      </div>
    </footer>
  );
}
