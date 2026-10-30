import MainNav from "@/components/main-nav/main-nav";
import Logo from "@/components/logo/logo";

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-black w-full">
      <Logo />
      <MainNav />
    </header>
  );
};

export default Header;