

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center rounded-xl bg-primary p-2 text-primary-foreground shadow-sm shadow-primary/20">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square-dot preview-icon"><path d="M12.7 3H4a2 2 0 0 0-2 2v16.286a.71.71 0 0 0 1.212.502l2.202-2.202A2 2 0 0 1 6.828 19H20a2 2 0 0 0 2-2v-4.7"/><circle cx="19" cy="6" r="3"/></svg>
      </div>
      <h1 className="text-lg font-bold tracking-tight text-[#29243b]">AskFolio</h1>
      <span className="rounded-full bg-[#eeebff] px-2 py-0.5 text-[10px] font-semibold text-[#5140bd]">
        AI
      </span>
    </div>
  );
};

export default Logo;