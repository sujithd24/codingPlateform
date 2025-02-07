
import Header from '../components/header/Header';
import Stats from '../components/stats/Stats';
import Recommendations from '../components/recommendations/Recommend';
import WeeklyProgress from '../components/weeklyprogress/Charts';
import { SlBadge } from "react-icons/sl";

const data = {
  user: { name: 'John Doe', year: '2nd Year' },
  progress: [10, 20, 15, 30, 25, 35, 40],
  badges: [
    { image: <SlBadge size={30}/>, type: 'Gold', count: 2 },
    { image: <SlBadge size={30}/>, type: 'Silver', count: 3 },
    { image: <SlBadge size={30}/>, type: 'Bronze', count: 1 },
  ],
  solved: 250,
  total: 1000,
  recommendations: [
    {
      title: 'JCAHPC Open Hackathon',
      description:
        'The event will take place from January 31, 2025, to February 17, 2025, with a focus on HPC (High-Performance Computing) and AI. It will be conducted in a hybrid format, combining both in-person and virtual sessions, and is set in the Asia-Pacific region. Applications for participation are currently open.',
    },
    {
      title: 'NCSA Open Hackathon',
      description:
        'The event is scheduled from April 1 to April 17, 2025, with a focus on HPC (High-Performance Computing) and AI. It will be held as a virtual event, catering to participants from North America and Latin America. Applications for this event are currently open.',
    },
  ],
};

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="main-content">
        <Header user={data.user} />
        <div className="allContent">
          <div className="allCharts">
            <WeeklyProgress data={data.progress} />
            <Stats solved={data.solved} total={data.total} badges={data.badges} />
          </div>
          <Recommendations items={data.recommendations} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
