import LocationList from './LocationList';
import AddLocationContainer from './add/AddLocationContainer';
import EditLocation from './EditLocation';
import LocationDetailsContainer from './details/LocationDetailsContainer';

const locations = {
  List: LocationList,
  Details: LocationDetailsContainer,
  Add: AddLocationContainer,
  Edit: EditLocation,
}

export default locations;
