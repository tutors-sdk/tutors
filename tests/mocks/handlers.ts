import { http, HttpResponse } from 'msw';

export const handlers = [
  // Course JSON fetch - mock Netlify course content
  http.get('https://*.netlify.app/tutors.json', () => {
    return HttpResponse.json({
      courseId: 'mock-course',
      title: 'Mock Course Title',
      img: '',
      lo: [],
      topicIndex: new Map(),
      labIndex: new Map(),
      companions: { show: false },
      courseUrl: 'mock-course.netlify.app'
    });
  }),

  // Supabase REST API - learning records
  http.post('https://*.supabase.co/rest/v1/learning_records', () => {
    return HttpResponse.json({ data: {}, error: null });
  }),

  // Supabase REST API - upsert operations
  http.post('https://*.supabase.co/rest/v1/:table', () => {
    return HttpResponse.json({ data: {}, error: null });
  }),

  // Supabase RPC calls
  http.post('https://*.supabase.co/rest/v1/rpc/:function', () => {
    return HttpResponse.json({ data: {}, error: null });
  }),

  // GitHub API - user lookup
  http.get('https://api.github.com/users/:login', ({ params }) => {
    return HttpResponse.json({
      login: params.login,
      name: 'Test User',
      avatar_url: 'https://example.com/avatar.png',
      html_url: `https://github.com/${params.login}`
    });
  })
];
