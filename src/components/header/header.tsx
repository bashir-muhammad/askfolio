import MainNav from "@/components/main-nav/main-nav";
import Logo from "@/components/logo/logo";

const Header = () => {
  return (
    <header className="z-10 flex h-[72px] w-full shrink-0 items-center justify-between border-b border-[#ebe8f4] bg-white/90 px-5 backdrop-blur sm:px-8">
      <Logo />
      <MainNav />
    </header>
  );
};

export default Header;