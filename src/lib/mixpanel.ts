import mixpanel from 'mixpanel-browser';

const token = import.meta.env.VITE_MIXPANEL_TOKEN;

// 토큰 없이 init 안 된 상태에서 track 하면 mixpanel이 throw 해서 앱 전체가 죽음
const enabled = Boolean(token);

if (enabled) {
  mixpanel.init(token, {
    track_pageview: false,
    persistence: 'localStorage',
    record_sessions_percent: 100,
  });
}

export const track = (event: string, props?: Record<string, unknown>) => {
  if (enabled) mixpanel.track(event, props);
};

export const identify = (studentId: string) => {
  if (enabled) mixpanel.identify(studentId);
};

export const setPeople = (props: Record<string, unknown>) => {
  if (enabled) mixpanel.people.set(props);
};

export const reset = () => {
  if (enabled) mixpanel.reset();
};

export default mixpanel;
