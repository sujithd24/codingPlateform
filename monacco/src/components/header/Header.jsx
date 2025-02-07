import "./Header.css";
import profile from "../../assets/profile.png";
import PropTypes from "prop-types";

export default function Header({ user }) {
  return (
    <div>
      <div className="header">
        <div className="headerTop">
          <input type="text" placeholder="Search..." className="search-bar" />
          <div className="headerProfile">
            <img src={profile} alt="profile" width="40px" />
            <h6>
              {user.name}
              <br />
              {user.year}
            </h6>
          </div>
        </div>
        <div className="headerContent">
          <h1>Welcome Back, {user.name}!</h1>
          <p>Year: {user.year}</p>
        </div>
      </div>
    </div>
  );
}

// PropTypes Validation
Header.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
  }).isRequired,
};
