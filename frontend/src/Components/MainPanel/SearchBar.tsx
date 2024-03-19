import { useState } from "react";

function SearchBar() {
  const [value, setValue] = useState("");

  return (
    <div className="w-full flex items-center gap-3">
      <input
        type="text"
        name=""
        id=""
        placeholder="Search chat"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full bg-transparent outline-none text-text px-3 placeholder:text-lightGray"
      />
    </div>
  );
}

export default SearchBar;
