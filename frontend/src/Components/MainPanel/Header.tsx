import { useContext, useState } from "react";
import { UserContext } from "../../Pages/HomePage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faMagnifyingGlass,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import SearchBar from "./SearchBar";

function Header() {
  const contextValue = useContext(UserContext);
  const [searchBarVisible, setSearchBarVisible] = useState(false);

  return (
    <div className="Header p-3">
      <div
        className={`${
          searchBarVisible ? "hidden" : "flex"
        } md:flex justify-between items-center`}
      >
        <img
          src={
            contextValue?.user?.image
              ? `${contextValue?.user?.image}`
              : "./images/profile-circle.svg"
          }
          alt="profile picture"
          className="w-8 rounded-full"
        />
        <div className="flex gap-5">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="h-5 text-text md:hidden"
            onClick={() => setSearchBarVisible(true)}
          />
          <FontAwesomeIcon
            icon={faEllipsisVertical}
            className="h-5 text-text"
          />
        </div>
      </div>
      <div
        className={`${
          !searchBarVisible ? "hidden" : "flex"
        } items-center gap-3 md:hidden`}
      >
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="h-5 text-text"
          onClick={() => setSearchBarVisible(false)}
        />
        <SearchBar />
      </div>
    </div>
  );
}

export default Header;
