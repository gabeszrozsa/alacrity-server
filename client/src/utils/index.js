import moment from 'moment';

export function formatDuration(duration) {
  return (duration) ? moment.utc(duration * 1000).format("HH:mm:ss") : '';
}

export function formatDistance(distance) {
  return (distance) ? `${distance / 1000}km` : '';
}

export function formatDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

export function formatFullDate(date) {
  return moment(date).format('YYYY-MM-DD hh:mm:ss')
}

export function convertDurationToSeconds(hours, minutes, seconds) {
  return (hours * 3600) + (minutes * 60) + seconds;
}

export function splitDurationInSeconds(duration) {
  const momentDuration = moment.duration(duration * 1000);

  const hours = momentDuration.as('hours');
  const durationHours = parseInt(hours);

  const minutes = (hours - durationHours) * 60;
  const durationMinutes = parseInt(minutes);

  const durationSeconds = Math.round((minutes - durationMinutes) * 60);

  return { durationHours, durationMinutes, durationSeconds };

}
