import { cacheLife } from "next/cache";

async function getCurrentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

const Footer = async () => {
  const year = await getCurrentYear();

  return (
    <footer className="flex items-center justify-center w-full mt-auto">
      <p className="mt-2 mb-1 text-center text-xs text-muted-foreground">
        AskFolio can make mistakes. Check important information.
        &copy; {year} AskFolio. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
