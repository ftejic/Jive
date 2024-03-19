import Header from "./Header";
import SearchBar from "./SearchBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

interface Props {
  visible: boolean;
}

function MainPanel(props: Props) {
  return (
    <div
      className={`
      ${props.visible ? "block" : "hidden"} md:block
       h-full col-start-1 col-end-13 md:col-end-6 lg:col-end-5 md:border-r border-lightGray
      `}
    >
      <Header />
      <div className="hidden md:flex items-center p-3 border-y border-lightGray">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="h-4 text-text" />
        <SearchBar />
      </div>
    </div>
  );
}

export default MainPanel;
