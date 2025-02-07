
import PropTypes from "prop-types"; // Import PropTypes for type checking
import "./recommend.css";

export default function Recommend({ items }) {
  return (
    <div>
      <h2 className="chartLable">AI Recommendation</h2>
      <div className="recommendations">
        {items.map((item, index) => (
          <div key={index} className="recommendation">
            <h3>{item.title}</h3>
            <br />
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Define PropTypes for the component
Recommend.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired, // Each item should have a required 'title' string
      description: PropTypes.string.isRequired, // Each item should have a required 'description' string
    })
  ).isRequired, // 'items' should be a required array
};
