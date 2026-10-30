

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center p-2 bg-primary rounded-lg text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square-dot preview-icon"><path d="M12.7 3H4a2 2 0 0 0-2 2v16.286a.71.71 0 0 0 1.212.502l2.202-2.202A2 2 0 0 1 6.828 19H20a2 2 0 0 0 2-2v-4.7"/><circle cx="19" cy="6" r="3"/></svg>
      </div>
      <h1 className="text-xl font-bold text-gray-800 dark:text-white">AskFolio</h1>
    </div>
  );
};

export default Logo;