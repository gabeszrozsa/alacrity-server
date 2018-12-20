import EventList from './EventList';
import AddEvent from './AddEvent';
import EditEvent from './EditEvent';
import EventDetailsContainer from './details/EventDetailsContainer';

const events = {
  List: EventList,
  Add: AddEvent,
  Edit: EditEvent,
  Details: EventDetailsContainer
}

export default events;
