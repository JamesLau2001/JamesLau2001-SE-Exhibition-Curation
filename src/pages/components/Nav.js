import Link from "next/link";

const Nav = ({ username, setUsername }) => {
  return (
    <div className="nav-wrapper">
      <div className="nav-bar">
        <Link to="/">Select a Different Museum</Link>
      </div>
    </div>
  );
};

export default Nav;
