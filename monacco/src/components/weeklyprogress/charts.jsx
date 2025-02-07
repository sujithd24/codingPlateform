import PropTypes from "prop-types";
import "./charts.css";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function Charts({ data }) {

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const chartData = data.map((value, index) => ({ day: `${days[index]}`, value }));

    return (
        <>
            <h1 className="chartLabel">Weekly Progress</h1>
            <LineChart width={890} height={300} data={chartData} className="weekly-progress">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" padding={{ right: 20, left: 20 }} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
        </>
    );
}

// Define propTypes
Charts.propTypes = {
    data: PropTypes.arrayOf(PropTypes.number).isRequired
};
