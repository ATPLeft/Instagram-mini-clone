import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={styles.nav}>
      <h3>Instagram Mini</h3>
      <div>
        <Link to="/">Feed</Link>{" "}
        <Link to="/create">Create</Link>{" "}
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 20px",
    borderBottom: "1px solid #ddd",
  },
};

export default Navbar;
