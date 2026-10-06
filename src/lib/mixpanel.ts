import mixpanel from 'mixpanel-browser';

mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN, {
  track_pageview: false,
  persistence: 'localStorage',
  record_sessions_percent: 100,
});

export const track = (event: string, props?: Record<string, unknown>) =>
  mixpanel.track(event, props);

export const identify = (studentId: string) => mixpanel.identify(studentId);

export const setPeople = (props: Record<string, unknown>) =>
  mixpanel.people.set(props);

export const reset = () => mixpanel.reset();

export default mixpanel;
