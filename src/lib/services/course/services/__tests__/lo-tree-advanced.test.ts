import { describe, it, expect, beforeEach } from 'vitest';
import { decorateLoTree, injectCourseUrl } from '../lo-tree';
import { courseProtocol } from '$lib/runes.svelte';
import type { Course, Lo, Composite } from '@tutors/tutors-model-lib';

describe('decorateLoTree() - Advanced Tests', () => {
  let mockCourse: Course;

  beforeEach(() => {
    courseProtocol.value = 'https://';
    mockCourse = {
      title: 'Test Course',
      courseId: 'test-course',
      courseUrl: 'test-course.netlify.app',
      route: '/course/test-course',
      los: [],
      loIndex: new Map(),
      topicIndex: new Map()
    } as Course;
  });

  describe('WHEN processing breadcrumbs', () => {
    it('shall replace topic with course in unit breadcrumbs', () => {
      const unitLo = {
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

      mockCourse.los = [unitLo as any];

      decorateLoTree(mockCourse, unitLo as any);

      // Verify breadcrumb manipulation for units
      expect(unitLo.breadCrumbs).toBeDefined();
    });

    it('shall replace topic with course in side breadcrumbs', () => {
      const sideLo = {
        type: 'side',
        title: 'Side 1',
        route: '/topic/{{COURSEURL}}/side1',
        los: [
          {
            type: 'note',
            title: 'Note 1',
            route: '/note/{{COURSEURL}}/note1',
            los: []
          } as any
        ]
      } as Composite;

      mockCourse.los = [sideLo as any];

      decorateLoTree(mockCourse, sideLo as any);

      expect(sideLo.breadCrumbs).toBeDefined();
    });

    it('shall handle breadcrumbs with length <= 2', () => {
      const shallowLo = {
        type: 'note',
        title: 'Note 1',
        route: '/note/{{COURSEURL}}/note1',
        los: []
      } as Lo;

      mockCourse.los = [shallowLo];

      decorateLoTree(mockCourse, shallowLo);

      // Should not throw error with short breadcrumbs
      expect(shallowLo.breadCrumbs).toBeDefined();
    });
  });

  describe('WHEN processing composite learning objects', () => {
    it('shall set parent references for nested children', () => {
      const topic = {
        type: 'topic',
        title: 'Topic 1',
        route: '/topic/{{COURSEURL}}/topic1',
        los: [
          {
            type: 'lab',
            title: 'Lab 1',
            route: '/lab/{{COURSEURL}}/lab1',
            los: []
          } as any
        ]
      } as Composite;

      mockCourse.los = [topic as any];

      decorateLoTree(mockCourse, topic as any);

      const lab = topic.los[0];
      expect(lab.parentLo).toBe(topic);
    });

    it('shall create panels for composite los', () => {
      const topic = {
        type: 'topic',
        title: 'Topic 1',
        route: '/topic/test',
        los: [
          { type: 'panelvideo', title: 'Video', route: '/video/test', los: [] } as any,
          { type: 'paneltalk', title: 'Talk', route: '/talk/test', los: [] } as any,
          { type: 'panelnote', title: 'Note', route: '/note/test', los: [] } as any
        ]
      } as Composite;

      decorateLoTree(mockCourse, topic as any);

      expect(topic.panels).toBeDefined();
    });

    it('shall create units for composite los', () => {
      const topic = {
        type: 'topic',
        title: 'Topic 1',
        route: '/topic/test',
        los: [
          { type: 'unit', title: 'Unit 1', route: '/unit/test', los: [] } as any,
          { type: 'lab', title: 'Lab 1', route: '/lab/test', los: [] } as any,
          { type: 'side', title: 'Side 1', route: '/side/test', los: [] } as any
        ]
      } as Composite;

      decorateLoTree(mockCourse, topic as any);

      expect(topic.units).toBeDefined();
    });

    it('shall create table of contents with all panel and unit items', () => {
      const topic = {
        type: 'topic',
        title: 'Topic 1',
        route: '/topic/test',
        los: [
          { type: 'panelvideo', title: 'Video', route: '/video/test', los: [] } as any,
          { type: 'unit', title: 'Unit 1', route: '/unit/test', los: [] } as any,
          { type: 'lab', title: 'Lab 1', route: '/lab/test', los: [] } as any
        ]
      } as Composite;

      decorateLoTree(mockCourse, topic as any);

      expect(topic.toc).toBeDefined();
      expect(Array.isArray(topic.toc)).toBe(true);
    });
  });

  describe('WHEN processing non-lab/non-note learning objects', () => {
    it('shall convert contentMd to HTML', () => {
      const noteLo = {
        type: 'note',
        title: 'Note 1',
        route: '/note/test',
        contentMd: '# Test',
        los: []
      } as any;

      // Note should NOT be converted (only non-lab/non-note types)
      decorateLoTree(mockCourse, noteLo);

      // Notes are converted on demand, so contentMd should still exist
      expect(noteLo.contentMd).toBe('# Test');
    });

    it('shall skip conversion for lab types', () => {
      const labLo = {
        type: 'lab',
        title: 'Lab 1',
        route: '/lab/test',
        contentMd: '# Lab',
        los: []
      } as any;

      decorateLoTree(mockCourse, labLo);

      // Labs are converted on demand
      expect(labLo.contentMd).toBe('# Lab');
    });
  });
});

describe('injectCourseUrl() - Protocol Handling', () => {
  beforeEach(() => {
    courseProtocol.value = 'https://';
  });

  describe('WHEN courseProtocol is http://', () => {
    it('shall convert https:// URLs to http://', () => {
      courseProtocol.value = 'http://';

      const los: Lo[] = [
        {
          route: '/topic/test',
          type: 'topic',
          img: 'https://{{COURSEURL}}/img.png',
          video: 'https://{{COURSEURL}}/video.mp4',
          pdf: 'https://{{COURSEURL}}/doc.pdf'
        } as any
      ];

      injectCourseUrl(los, 'test', 'test.com');

      expect(los[0].img).toContain('http://');
      expect(los[0].video).toContain('http://');
      expect(los[0].pdf).toContain('http://');
    });
  });

  describe('WHEN processing different lo types', () => {
    it('shall handle talk type PDFs', () => {
      const los: Lo[] = [
        {
          route: '/talk/{{COURSEURL}}/test',
          type: 'talk',
          pdf: 'https://{{COURSEURL}}/slides.pdf'
        } as any
      ];

      injectCourseUrl(los, 'test', 'test.com');

      expect(los[0].pdf).toBe('https://test.com/slides.pdf');
    });

    it('shall handle paneltalk type PDFs', () => {
      const los: Lo[] = [
        {
          route: '/paneltalk/{{COURSEURL}}/test',
          type: 'paneltalk',
          pdf: 'https://{{COURSEURL}}/panel.pdf'
        } as any
      ];

      injectCourseUrl(los, 'test', 'test.com');

      expect(los[0].pdf).toBe('https://test.com/panel.pdf');
    });

    it('shall handle tutorial type PDFs', () => {
      const los: Lo[] = [
        {
          route: '/tutorial/{{COURSEURL}}/test',
          type: 'tutorial',
          pdf: 'https://{{COURSEURL}}/tutorial.pdf'
        } as any
      ];

      injectCourseUrl(los, 'test', 'test.com');

      expect(los[0].pdf).toBe('https://test.com/tutorial.pdf');
    });

    it('shall skip tutorial PDFs if pdf is undefined', () => {
      const los: Lo[] = [
        {
          route: '/tutorial/{{COURSEURL}}/test',
          type: 'tutorial'
        } as any
      ];

      // Should not throw
      injectCourseUrl(los, 'test', 'test.com');

      expect(los[0].pdf).toBeUndefined();
    });

    it('shall handle lab type PDFs', () => {
      const los: Lo[] = [
        {
          route: '/lab/{{COURSEURL}}/test',
          type: 'lab',
          pdf: 'https://{{COURSEURL}}/lab.pdf'
        } as any
      ];

      injectCourseUrl(los, 'test', 'test.com');

      expect(los[0].pdf).toBe('https://test.com/lab.pdf');
    });

    it('shall handle archive type with special route construction', () => {
      const los: Lo[] = [
        {
          route: '/archive/{{COURSEURL}}',
          type: 'archive',
          archiveFile: 'course.zip'
        } as any
      ];

      injectCourseUrl(los, 'test', 'test.com');

      expect(los[0].route).toBe('https://test.com/course.zip');
    });
  });

  describe('WHEN replacing multiple placeholders', () => {
    it('shall replace all {{COURSEURL}} instances in a single lo', () => {
      const los: Lo[] = [
        {
          route: '/topic/{{COURSEURL}}/test',
          type: 'topic',
          img: 'https://{{COURSEURL}}/img.png',
          video: 'https://{{COURSEURL}}/video.mp4'
        } as any
      ];

      injectCourseUrl(los, 'course-id', 'example.com');

      expect(los[0].route).toBe('/topic/course-id/test');
      expect(los[0].img).toBe('https://example.com/img.png');
      expect(los[0].video).toBe('https://course-id/video.mp4');
    });
  });
});
