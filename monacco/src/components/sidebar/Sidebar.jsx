import "./sidebar.css";
import { MdDashboard } from "react-icons/md";
import { AiFillRobot } from "react-icons/ai";
import { Outlet, useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import profile from "../../assets/profile.png";
import { FaBookOpen } from "react-icons/fa";
import { MdLeaderboard } from "react-icons/md";
import { FaCreativeCommonsNd } from "react-icons/fa";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { CiLogout } from "react-icons/ci";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get the current path

  const navTo = (path) => {
    if (path) {
      navigate(path);
    }
  };

  const logout = () => {
    window.localStorage.clear(); // Clears all stored data in localStorage
    window.location.reload(); // Forces a reload to ensure the page is updated
    navigate("/login"); // Redirects to the login page
  };

  const getSidebarStyles = () => {
    if (location.pathname === "/monaco") {
      return { backgroundColor: "#A37BF3", width: "250px" }; // Set dynamic width
    }
    return { backgroundColor: "#A37BF3", width: "230px" }; // Default width
  };
  return (
    <>
      <div
        className="sidebar"
        style={getSidebarStyles()} // Dynamically set both color and width
      >
        <div className="profile-section">
          <img src={profile} alt="User Profile Image" className="profile-image" />
        </div>
        <ul className="sidebar-list">
          <li className="list" onClick={() => navTo("/")}>
            <MdDashboard size={25} /> &nbsp;Dashboard
          </li>
          <li className="list" onClick={() => navTo("/monaco")}>
            <AiFillRobot size={25} /> &nbsp;Editor
          </li>
          <li className="list" onClick={() => navTo("/courses")}>
            <FaBookOpen size={25} /> &nbsp;Courses
          </li>
          <li className="list" onClick={() => navTo("/leaderboard")}>
            <MdLeaderboard size={25} /> &nbsp;LeaderBoard
          </li>
          <li className="list" onClick={() => navTo("/results")}>
            <FaCreativeCommonsNd size={25} /> &nbsp;Results
          </li>
          <li className="list" onClick={() => navTo("/schedule")}>
            <RiCalendarScheduleFill size={25} /> &nbsp;Schedule
          </li>
        </ul>
        <div className="logout-section">
          <li className="list" onClick={logout}>
            <CiLogout size={25} /> &nbsp;Logout
          </li>
        </div>
      </div>
      <Outlet />
    </>
  );
}
