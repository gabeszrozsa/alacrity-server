import ActivityTypeList from './ActivityTypeList';
import AddActivityType from './AddActivityType';
import EditActivityType from './EditActivityType';
import ActivityTypeDetails from './ActivityTypeDetails';

const activityTypes = {
  List: ActivityTypeList,
  Details: ActivityTypeDetails,
  Add: AddActivityType,
  Edit: EditActivityType,
}

export default activityTypes;
