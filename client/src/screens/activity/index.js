import ActivityList from './list/ActivityList';
import AddActivity from './AddActivity';
import EditActivity from './EditActivity';
import ActivityDetails from './details/ActivityDetails';

const activities = {
  List: ActivityList,
  Details: ActivityDetails,
  Add: AddActivity,
  Edit: EditActivity,
}

export default activities;
