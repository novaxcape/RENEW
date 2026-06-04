
import { FiSearch } from "react-icons/fi";
// import "./css/SearchBar.css";
const SearchBar = () => {
  return (
    <div className="search-bar">
      <FiSearch />
      <input
        type="text"
        placeholder="Search reports..."
      />
    </div>
  );
};

export default SearchBar;