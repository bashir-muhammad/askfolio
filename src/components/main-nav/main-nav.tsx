
const MainNav = () => {
  return (
    <nav>
        <ul className="flex space-x-4">
          <li>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
              About
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
              Contact
            </a>
          </li>
        </ul>
      </nav>
  )
};

export default MainNav;