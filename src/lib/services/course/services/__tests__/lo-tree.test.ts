import { describe, it, expect, beforeEach, vi } from 'vitest';
import { determineCourseUrl, decorateCourseTree, injectCourseUrl } from '../lo-tree';
import type { Course, Lo } from '@tutors/tutors-model-lib';

describe('determineCourseUrl()', () => {
  describe('WHEN a full Netlify URL is provided', () => {
    it('should extract courseId by removing .netlify.app', () => {
      const result = determineCourseUrl('https://test-course.netlify.app');
      expect(result.courseId).toBe('https://test-course');
      expect(result.courseUrl).toBe('https://test-course.netlify.app');
    });

    it('should handle Netlify URL without protocol', () => {
      const result = determineCourseUrl('my-course.netlify.app');
      expect(result.courseId).toBe('my-course');
      expect(result.courseUrl).toBe('my-course.netlify.app');
    });
  });

  describe('WHEN a custom domain URL is provided', () => {
    it('should use the full URL as both courseId and courseUrl', () => {
      const result = determineCourseUrl('https://example.com');
      expect(result.courseId).toBe('https://example.com');
      expect(result.courseUrl).toBe('https://example.com');
    });

    it('should handle custom domain without protocol', () => {
      const result = determineCourseUrl('courses.university.edu');
      expect(result.courseId).toBe('courses.university.edu');
      expect(result.courseUrl).toBe('courses.university.edu');
    });

    it('should handle URLs with paths', () => {
      const result = determineCourseUrl('https://example.com/my-course');
      expect(result.courseId).toBe('https://example.com/my-course');
      expect(result.courseUrl).toBe('https://example.com/my-course');
    });
  });

  describe('WHEN a localhost URL is provided', () => {
    it('should set protocol to http:// for localhost', () => {
      const result = determineCourseUrl('localhost:3000');
      expect(result.courseId).toBe('localhost:3000');
      expect(result.courseUrl).toBe('localhost:3000');
    });

    it('should set protocol to http:// for IP addresses starting with 192', () => {
      const result = determineCourseUrl('192.168.1.100:8080');
      expect(result.courseId).toBe('192.168.1.100:8080');
      expect(result.courseUrl).toBe('192.168.1.100:8080');
    });
  });

  describe('WHEN a plain course ID is provided', () => {
    it('should construct Netlify URL from courseId', () => {
      const result = determineCourseUrl('my-course');
      expect(result.courseId).toBe('my-course');
      expect(result.courseUrl).toBe('my-course.netlify.app');
    });

    it('should handle course IDs with hyphens', () => {
      const result = determineCourseUrl('advanced-web-development');
      expect(result.courseId).toBe('advanced-web-development');
      expect(result.courseUrl).toBe('advanced-web-development.netlify.app');
    });
  });

  describe('Edge cases', () => {
    it('should handle URLs with ports', () => {
      const result = determineCourseUrl('example.com:8080');
      expect(result.courseId).toBe('example.com:8080');
      expect(result.courseUrl).toBe('example.com:8080');
    });

    it('should handle URLs with query parameters', () => {
      const result = determineCourseUrl('example.com?param=value');
      expect(result.courseId).toBe('example.com?param=value');
      expect(result.courseUrl).toBe('example.com?param=value');
    });

    it('should handle URLs with fragments', () => {
      const result = determineCourseUrl('example.com#section');
      expect(result.courseId).toBe('example.com#section');
      expect(result.courseUrl).toBe('example.com#section');
    });
  });
});

describe('injectCourseUrl()', () => {
  describe('WHEN processing learning object routes', () => {
    it('should replace {{COURSEURL}} placeholder in routes', () => {
      const los: Lo[] = [
        { route: '/topic/{{COURSEURL}}/intro', type: 'topic' } as Lo
      ];

      injectCourseUrl(los, 'test-course', 'test-course.netlify.app');

      expect(los[0].route).toBe('/topic/test-course/intro');
    });

    it('should replace {{COURSEURL}} in image paths', () => {
      const los: Lo[] = [
        {
          route: '/topic/test',
          type: 'topic',
          img: 'https://{{COURSEURL}}/img/logo.png'
        } as Lo
      ];

      injectCourseUrl(los, 'test-course', 'test-course.netlify.app');

      expect(los[0].img).toBe('https://test-course.netlify.app/img/logo.png');
    });

    it('should replace {{COURSEURL}} in video paths', () => {
      const los: Lo[] = [
        {
          route: '/video/test',
          type: 'video',
          video: 'https://{{COURSEURL}}/videos/intro.mp4'
        } as Lo
      ];

      injectCourseUrl(los, 'test-course', 'test-course.netlify.app');

      expect(los[0].video).toBe('https://test-course/videos/intro.mp4');
    });
  });

  describe('WHEN processing talk PDFs', () => {
    it('should replace {{COURSEURL}} in talk PDF paths', () => {
      const los: Lo[] = [
        {
          route: '/talk/test',
          type: 'talk',
          pdf: 'https://{{COURSEURL}}/talks/intro.pdf'
        } as any
      ];

      injectCourseUrl(los, 'test-course', 'test-course.netlify.app');

      expect(los[0].pdf).toBe('https://test-course.netlify.app/talks/intro.pdf');
    });

    it('should handle paneltalk PDF paths', () => {
      const los: Lo[] = [
        {
          route: '/paneltalk/test',
          type: 'paneltalk',
          pdf: 'https://{{COURSEURL}}/panel.pdf'
        } as any
      ];

      injectCourseUrl(los, 'test-course', 'test-course.netlify.app');

      expect(los[0].pdf).toBe('https://test-course.netlify.app/panel.pdf');
    });
  });

  describe('WHEN processing lab and tutorial PDFs', () => {
    it('should replace {{COURSEURL}} in lab PDF paths', () => {
      const los: Lo[] = [
        {
          route: '/lab/test',
          type: 'lab',
          pdf: 'https://{{COURSEURL}}/labs/lab1.pdf'
        } as any
      ];

      injectCourseUrl(los, 'test-course', 'test-course.netlify.app');

      expect(los[0].pdf).toBe('https://test-course.netlify.app/labs/lab1.pdf');
    });

    it('should replace {{COURSEURL}} in tutorial PDF paths', () => {
      const los: Lo[] = [
        {
          route: '/tutorial/test',
          type: 'tutorial',
          pdf: 'https://{{COURSEURL}}/tutorials/tut1.pdf'
        } as any
      ];

      injectCourseUrl(los, 'test-course', 'test-course.netlify.app');

      expect(los[0].pdf).toBe('https://test-course.netlify.app/tutorials/tut1.pdf');
    });
  });

  describe('WHEN processing archive routes', () => {
    it('should construct full archive URL with domain', () => {
      const los: Lo[] = [
        {
          route: '/archive/{{COURSEURL}}',
          type: 'archive',
          archiveFile: 'course-archive.zip'
        } as any
      ];

      injectCourseUrl(los, 'test-course', 'test-course.netlify.app');

      expect(los[0].route).toBe('https://test-course.netlify.app/course-archive.zip');
    });
  });
});

describe('decorateCourseTree()', () => {
  let mockCourse: Course;

  beforeEach(() => {
    mockCourse = {
      title: 'Test Course',
      los: [],
      loIndex: new Map(),
      topicIndex: new Map()
    } as Course;
  });

  describe('WHEN decorating a course', () => {
    it('should set courseId and courseUrl', () => {
      decorateCourseTree(mockCourse, 'test-course', 'test-course.netlify.app');

      expect(mockCourse.courseId).toBe('test-course');
      expect(mockCourse.courseUrl).toBe('test-course.netlify.app');
    });

    it('should set course route', () => {
      decorateCourseTree(mockCourse, 'test-course', 'test-course.netlify.app');

      expect(mockCourse.route).toBe('/course/test-course');
    });

    it('should create loIndex Map', () => {
      decorateCourseTree(mockCourse, 'test-course', 'test-course.netlify.app');

      expect(mockCourse.loIndex).toBeInstanceOf(Map);
    });

    it('should create topicIndex Map', () => {
      decorateCourseTree(mockCourse, 'test-course', 'test-course.netlify.app');

      expect(mockCourse.topicIndex).toBeInstanceOf(Map);
    });

    it('should index the course itself in loIndex', () => {
      decorateCourseTree(mockCourse, 'test-course', 'test-course.netlify.app');

      const indexedCourse = mockCourse.loIndex.get('/course/test-course');
      expect(indexedCourse).toBeDefined();
      expect(indexedCourse?.title).toBe('Test Course');
    });
  });

  describe('WHEN course has topics', () => {
    it('should index topics in topicIndex', () => {
      mockCourse.los = [
        {
          type: 'topic',
          title: 'Introduction',
          route: '/topic/{{COURSEURL}}/intro',
          los: []
        } as any
      ];

      decorateCourseTree(mockCourse, 'test-course', 'test-course.netlify.app');

      expect(mockCourse.topicIndex.size).toBeGreaterThan(0);
      const topic = Array.from(mockCourse.topicIndex.values())[0];
      expect(topic.title).toBe('Introduction');
    });
  });

  describe('WHEN course has nested structure', () => {
    it('should set parentCourse reference for all learning objects', () => {
      mockCourse.los = [
        {
          type: 'topic',
          title: 'Topic 1',
          route: '/topic/test',
          los: [
            {
              type: 'lab',
              title: 'Lab 1',
              route: '/lab/test',
              los: []
            } as any
          ]
        } as any
      ];

      decorateCourseTree(mockCourse, 'test-course', 'test-course.netlify.app');

      const topic = mockCourse.los[0];
      expect(topic.parentCourse).toBe(mockCourse);
    });
  });
});
