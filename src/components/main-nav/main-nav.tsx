import { Sparkles } from "lucide-react";

const MainNav = () => (
  <div className="flex items-center gap-2 rounded-full border border-[#e9e5f7] bg-[#f7f5ff] px-3 py-1.5 text-xs font-medium text-[#5140bd]">
    <Sparkles size={14} />
    <span>AI research workspace</span>
  </div>
);

export default MainNav;