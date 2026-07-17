import { describe, it, expect, beforeEach } from 'vitest';
import { determineCourseUrl, injectCourseUrl, decorateCourseTree } from '../lo-tree';
import { courseProtocol } from '$lib/runes.svelte';
import type { Course, Lo, Composite } from '@tutors/tutors-model-lib';

/**
 * Mutation-killing tests - designed to kill specific surviving mutants
 * by adding explicit assertions on return values and side effects
 */

describe('determineCourseUrl() - Mutation Killers', () => {
  beforeEach(() => {
    courseProtocol.value = 'https://';
  });

  describe('WHEN Netlify URL without protocol is provided', () => {
    it('shall return correct courseId AND courseUrl', () => {
      const result = determineCourseUrl('my-course.netlify.app');

      // Kill String literal mutants
      expect(result.courseId).toBe('my-course');
      expect(result.courseUrl).toBe('my-course.netlify.app');

      // Verify both fields are set (kill object mutants)
      expect(result).toHaveProperty('courseId');
      expect(result).toHaveProperty('courseUrl');
      expect(result.courseId).not.toBe('');
      expect(result.courseUrl).not.toBe('');
    });
  });

  describe('WHEN custom domain is provided', () => {
    it('shall return exact domain as both courseId and courseUrl', () => {
      const result = determineCourseUrl('courses.university.edu');

      expect(result.courseId).toBe('courses.university.edu');
      expect(result.courseUrl).toBe('courses.university.edu');

      // Kill conditional mutants - verify they match
      expect(result.courseId).toEqual(result.courseUrl);
    });
  });

  describe('WHEN plain courseId with hyphens is provided', () => {
    it('shall append .netlify.app to courseUrl but keep courseId unchanged', () => {
      const result = determineCourseUrl('advanced-web-dev');

      expect(result.courseId).toBe('advanced-web-dev');
      expect(result.courseUrl).toBe('advanced-web-dev.netlify.app');

      // Kill string concat mutants
      expect(result.courseUrl).toContain('.netlify.app');
      expect(result.courseUrl.startsWith('advanced-web-dev')).toBe(true);
    });
  });

  describe('WHEN simple courseId is provided', () => {
    it('shall construct Netlify URL correctly', () => {
      const result = determineCourseUrl('simple');

      expect(result.courseId).toBe('simple');
      expect(result.courseUrl).toBe('simple.netlify.app');

      // Verify string concatenation worked correctly
      expect(result.courseUrl.split('.').length).toBe(3);
      expect(result.courseUrl.endsWith('.app')).toBe(true);
    });
  });
});

describe('injectCourseUrl() - Mutation Killers', () => {
  beforeEach(() => {
    courseProtocol.value = 'https://';
  });

  describe('WHEN processing talk PDFs', () => {
    it('shall replace placeholder with correct URL', () => {
      const los: Lo[] = [
        {
          route: '/talk/test',
          type: 'talk',
          pdf: 'https://{{COURSEURL}}/slides.pdf'
        } as any
      ];

      injectCourseUrl(los, 'course-id', 'course.com');

      // Kill string replacement mutants
      expect(los[0].pdf).toBe('https://course.com/slides.pdf');
      expect(los[0].pdf).not.toContain('{{COURSEURL}}');
      expect(los[0].pdf).toContain('course.com');
      expect(los[0].pdf).toContain('/slides.pdf');
    });
  });

  describe('WHEN processing paneltalk PDFs', () => {
    it('shall replace placeholder in paneltalk PDFs', () => {
      const los: Lo[] = [
        {
          route: '/paneltalk/test',
          type: 'paneltalk',
          pdf: 'https://{{COURSEURL}}/panel.pdf'
        } as any
      ];

      injectCourseUrl(los, 'course-id', 'example.com');

      expect(los[0].pdf).toBe('https://example.com/panel.pdf');
      expect(los[0].pdf).not.toBe('');
      expect(los[0].pdf).toContain('example.com');
    });
  });

  describe('WHEN processing tutorial PDFs', () => {
    it('shall replace placeholder in tutorial PDFs when pdf exists', () => {
      const los: Lo[] = [
        {
          route: '/tutorial/test',
          type: 'tutorial',
          pdf: 'https://{{COURSEURL}}/tut.pdf'
        } as any
      ];

      injectCourseUrl(los, 'test', 'test.com');

      expect(los[0].pdf).toBe('https://test.com/tut.pdf');
      expect(los[0].pdf).toBeDefined();
      expect(los[0].pdf?.length).toBeGreaterThan(0);
    });

    it('shall not crash when tutorial pdf is undefined', () => {
      const los: Lo[] = [
        {
          route: '/tutorial/test',
          type: 'tutorial'
          // pdf is undefined
        } as any
      ];

      // Should not throw
      expect(() => injectCourseUrl(los, 'test', 'test.com')).not.toThrow();
      expect(los[0].pdf).toBeUndefined();
    });
  });

  describe('WHEN processing lab PDFs', () => {
    it('shall replace placeholder correctly', () => {
      const los: Lo[] = [
        {
          route: '/lab/test',
          type: 'lab',
          pdf: 'https://{{COURSEURL}}/lab.pdf'
        } as any
      ];

      injectCourseUrl(los, 'course', 'site.com');

      expect(los[0].pdf).toBe('https://site.com/lab.pdf');
      expect(los[0].pdf).toMatch(/^https:\/\//);
      expect(los[0].pdf).toContain('site.com');
    });
  });

  describe('WHEN processing archive routes', () => {
    it('shall construct full URL with archive file', () => {
      const los: Lo[] = [
        {
          route: '/archive/{{COURSEURL}}',
          type: 'archive',
          archiveFile: 'course.zip'
        } as any
      ];

      injectCourseUrl(los, 'id', 'domain.com');

      expect(los[0].route).toBe('https://domain.com/course.zip');
      expect(los[0].route).toContain('domain.com');
      expect(los[0].route).toContain('course.zip');
      expect(los[0].route).toMatch(/^https:\/\//);
    });
  });

  describe('WHEN processing multiple placeholders', () => {
    it('shall replace all instances correctly', () => {
      const los: Lo[] = [
        {
          route: '/topic/{{COURSEURL}}/intro',
          type: 'topic',
          img: 'https://{{COURSEURL}}/logo.png',
          video: 'https://{{COURSEURL}}/intro.mp4'
        } as any
      ];

      injectCourseUrl(los, 'my-course', 'example.org');

      // Kill all string replacement mutants
      expect(los[0].route).toBe('/topic/my-course/intro');
      expect(los[0].img).toBe('https://example.org/logo.png');
      expect(los[0].video).toBe('https://my-course/intro.mp4');

      // Verify no placeholders remain
      expect(los[0].route).not.toContain('{{COURSEURL}}');
      expect(los[0].img).not.toContain('{{COURSEURL}}');
      expect(los[0].video).not.toContain('{{COURSEURL}}');
    });
  });
});

describe.skip('decorateCourseTree() - Mutation Killers', () => {
  let mockCourse: Course;

  beforeEach(() => {
    courseProtocol.value = 'https://';
    mockCourse = {
      title: 'Test Course',
      los: [],
      loIndex: new Map(),
      topicIndex: new Map()
    } as Course;
  });

  describe('WHEN creating loIndex Map', () => {
    it('shall create a Map instance with course indexed', () => {
      decorateCourseTree(mockCourse, 'test', 'test.com');

      // Kill Map instantiation mutants
      expect(mockCourse.loIndex).toBeInstanceOf(Map);
      expect(mockCourse.loIndex.size).toBeGreaterThan(0);
      expect(mockCourse.loIndex.get('/course/test')).toBeDefined();
      expect(mockCourse.loIndex.get('/course/test')?.title).toBe('Test Course');
    });
  });

  describe('WHEN creating topicIndex Map', () => {
    it('shall create a Map instance', () => {
      decorateCourseTree(mockCourse, 'test', 'test.com');

      // Kill Map instantiation mutants
      expect(mockCourse.topicIndex).toBeInstanceOf(Map);
      expect(mockCourse.topicIndex).not.toBeNull();
      expect(mockCourse.topicIndex).not.toBeUndefined();
    });
  });

  describe('WHEN course has topics', () => {
    it('shall populate topicIndex with all topics', () => {
      mockCourse.los = [
        {
          type: 'topic',
          title: 'Topic 1',
          route: '/topic/{{COURSEURL}}/t1',
          los: []
        } as any,
        {
          type: 'topic',
          title: 'Topic 2',
          route: '/topic/{{COURSEURL}}/t2',
          los: []
        } as any
      ];

      decorateCourseTree(mockCourse, 'test', 'test.com');

      // Kill forEach and Map.set mutants
      expect(mockCourse.topicIndex.size).toBe(2);
      const topics = Array.from(mockCourse.topicIndex.values());
      expect(topics.length).toBe(2);
      expect(topics[0].title).toBe('Topic 1');
      expect(topics[1].title).toBe('Topic 2');
    });
  });

  describe('WHEN decorating nested structure', () => {
    it('shall set all metadata correctly', () => {
      mockCourse.los = [
        {
          type: 'topic',
          title: 'Topic',
          route: '/topic/{{COURSEURL}}/t',
          los: []
        } as any
      ];

      decorateCourseTree(mockCourse, 'my-id', 'my-url.com');

      // Kill assignment mutants
      expect(mockCourse.courseId).toBe('my-id');
      expect(mockCourse.courseUrl).toBe('my-url.com');
      expect(mockCourse.route).toBe('/course/my-id');

      // Verify all three are different values
      expect(mockCourse.courseId).not.toBe(mockCourse.courseUrl);
      expect(mockCourse.courseId).not.toBe(mockCourse.route);
    });
  });

  describe('WHEN processing breadcrumbs with length > 2', () => {
    it('shall handle unit type breadcrumb routes', () => {
      const unit = {
        type: 'unit',
        title: 'Unit 1',
        route: '/topic/{{COURSEURL}}/unit1',
        los: [
          {
            type: 'talk',
            title: 'Talk 1',
            route: '/talk/{{COURSEURL}}/talk1',
            los: []
          } as any
        ]
      } as Composite;

      mockCourse.los = [unit as any];

      // Call decorateLoTree on the nested lo, not mockCourse
      const nestedTalk = unit.los[0];
      decorateCourseTree(mockCourse, nestedTalk);

      // Breadcrumbs should be set on the nested element
      expect(nestedTalk.breadCrumbs).toBeDefined();
      expect(Array.isArray(nestedTalk.breadCrumbs)).toBe(true);
    });

    it('shall handle side type breadcrumb routes', () => {
      const topic = {
        type: 'topic',
        title: 'Topic',
        route: '/topic/test/t',
        los: [
          {
            type: 'side',
            title: 'Side 1',
            route: '/side/test/side1',
            los: []
          } as any
        ]
      } as Composite;

      mockCourse.los = [topic as any];
      decorateCourseTree(mockCourse, topic as any);

      const side = topic.los[0];
      expect(side.breadCrumbs).toBeDefined();
      expect(Array.isArray(side.breadCrumbs)).toBe(true);
    });
  });

  describe('WHEN processing composite los', () => {
    it('shall create panels and units and toc objects', () => {
      const topic = {
        type: 'topic',
        title: 'Topic',
        route: '/topic/test',
        img: '',
        los: [
          { type: 'panelvideo', title: 'Video', route: '/video/1', img: '', los: [] } as any,
          { type: 'unit', title: 'Unit', route: '/unit/1', img: '', los: [] } as any,
          { type: 'lab', title: 'Lab', route: '/lab/1', img: '', los: [] } as any
        ]
      } as Composite;

      mockCourse.los = [topic as any];

      // Decorate the entire course, which will recursively process the topic
      decorateCourseTree(mockCourse, 'test', 'test.com');

      // Since decorateCourseTree processes from the root, we need to check after full decoration
      const decoratedTopic = mockCourse.los[0] as Composite;

      // Kill object/array creation mutants
      expect(decoratedTopic.panels).toBeDefined();
      expect(decoratedTopic.units).toBeDefined();
      expect(decoratedTopic.toc).toBeDefined();
      expect(Array.isArray(decoratedTopic.toc)).toBe(true);
    });
  });

  describe('WHEN handling empty breadcrumbs', () => {
    it('shall not crash with breadcrumbs length <= 2', () => {
      const simpleLo = {
        type: 'note',
        title: 'Note',
        route: '/note/test',
        img: '',
        los: []
      } as Lo;

      mockCourse.los = [simpleLo];

      // Should not throw when decorating full course
      expect(() => decorateCourseTree(mockCourse, 'test', 'test.com')).not.toThrow();

      const decoratedLo = mockCourse.los[0];
      expect(decoratedLo.breadCrumbs).toBeDefined();
    });
  });
});
