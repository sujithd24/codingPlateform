import PropTypes from "prop-types";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import "./stats.css";

export default function Stats({ solved, total, badges }) {
  const data = [
    { name: "Solved", value: solved, color: "#6b4eff" },
    { name: "Unsolved", value: total - solved, color: "#8884d8" },
  ];

  return (
    <div className="stats">
      {/* Progress Section */}
      <div className="progress">
        <div className="progress-container">
          <PieChart width={200} height={200}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={5}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}`} />
            <Legend align="center" verticalAlign="bottom" iconType="circle" />
          </PieChart>
          <div className="progress-text">
            <p className="total">Total: {total}</p>
            <p className="solved">Solved: {solved}</p>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="badges">
        <p className="title">Badges earned</p>
        <p className="badge-count">{badges.length}</p>
        <div className="badge-list">
          {badges.map((badge, index) => (
            <div key={index} className="badge-item">
              <div className="badge-icon">{badge.image}</div>
              <p>{badge.type} badge</p>
            </div>
          ))}
        </div>
        <p className="month">Dec month's badges</p>
      </div>
    </div>
  );
}

Stats.propTypes = {
  solved: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  badges: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.element.isRequired,
      type: PropTypes.string.isRequired,
    })
  ).isRequired,
};
