import { describe, it, expect, beforeEach, vi } from 'vitest';
import { courseService } from '$lib/services/course/services/course.svelte';
import { currentCourse, currentLo, courseProtocol } from '$lib/runes.svelte';
import type { Course } from '@tutors/tutors-model-lib';

/**
 * Mutation-killing integration tests
 * Designed to kill specific surviving mutants by asserting on exact values
 */

describe('Course Service - Mutation Killers', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  const mockCourse: Partial<Course> = {
    title: 'Test Course',
    courseId: 'test',
    courseUrl: 'test.com',
    los: [],
    topicIndex: new Map(),
    labIndex: new Map()
  };

  beforeEach(() => {
    courseService.courses.clear();
    currentCourse.value = null;
    currentLo.value = null;
    courseProtocol.value = 'https://';
    mockFetch = vi.fn();
  });

  describe('WHEN course is successfully loaded', () => {
    it('shall cache with exact courseId key', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockCourse, title: 'Cached Course' })
      });

      await courseService.getOrLoadCourse('cache-test', mockFetch);

      // Kill Map.set mutants
      expect(courseService.courses.has('cache-test')).toBe(true);
      expect(courseService.courses.get('cache-test')).toBeDefined();
      expect(courseService.courses.get('cache-test')?.title).toBe('Cached Course');

      // Verify it's actually in the Map
      expect(courseService.courses.size).toBe(1);
      const keys = Array.from(courseService.courses.keys());
      expect(keys[0]).toBe('cache-test');
    });

    it('shall set courseId property on course object', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCourse
      });

      const course = await courseService.getOrLoadCourse('id-test', mockFetch);

      // Kill property assignment mutants
      expect(course.courseId).toBe('id-test');
      expect(course).toHaveProperty('courseId');
      expect(course.courseId).not.toBeUndefined();
      expect(course.courseId).not.toBe('');
    });

    it('shall set courseUrl property on course object', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCourse
      });

      const course = await courseService.getOrLoadCourse('test-course', mockFetch);

      // Kill property assignment mutants
      expect(course.courseUrl).toBeDefined();
      expect(course).toHaveProperty('courseUrl');
      expect(course.courseUrl).toContain('netlify.app');
    });
  });

  describe('WHEN same course is requested again', () => {
    it('shall return identical reference (not a copy)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockCourse, title: 'Original' })
      });

      const first = await courseService.getOrLoadCourse('same-test', mockFetch);
      const second = await courseService.getOrLoadCourse('same-test', mockFetch);

      // Kill object cloning mutants - must be same reference
      expect(first).toBe(second);
      expect(Object.is(first, second)).toBe(true);

      // Verify titles match
      expect(first.title).toBe(second.title);
    });

    it('shall not call fetch function at all', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCourse
      });

      await courseService.getOrLoadCourse('no-fetch', mockFetch);

      // Clear call count
      mockFetch.mockClear();

      await courseService.getOrLoadCourse('no-fetch', mockFetch);

      // Kill conditional mutants - must be exactly 0 calls
      expect(mockFetch).toHaveBeenCalledTimes(0);
      expect(mockFetch).not.toHaveBeenCalled();
      expect(mockFetch.mock.calls.length).toBe(0);
    });
  });

  describe('WHEN fetch fails with different status codes', () => {
    it('shall throw error with exact status 400', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 400 });

      await expect(
        courseService.getOrLoadCourse('bad', mockFetch)
      ).rejects.toThrow(/400/);
    });

    it('shall throw error with exact status 500', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

      const promise = courseService.getOrLoadCourse('error', mockFetch);

      await expect(promise).rejects.toThrow();
      await expect(promise).rejects.toThrow(/500/);

      // Kill string concat mutants in error message
      try {
        await courseService.getOrLoadCourse('error2', mockFetch.mockResolvedValueOnce({ ok: false, status: 500 }));
      } catch (error: any) {
        expect(error.message).toContain('500');
        expect(error.message).toContain('Fetch failed');
        expect(error.message.length).toBeGreaterThan(0);
      }
    });

    it('shall throw error with exact status 403', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 403 });

      await expect(
        courseService.getOrLoadCourse('forbidden', mockFetch)
      ).rejects.toThrow('Fetch failed with status 403');
    });
  });

  describe('WHEN JSON parsing fails', () => {
    it('shall propagate the exact error', async () => {
      const parseError = new Error('Unexpected token');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => { throw parseError; }
      });

      // Kill error propagation mutants
      await expect(
        courseService.getOrLoadCourse('malformed', mockFetch)
      ).rejects.toThrow('Unexpected token');

      await expect(
        courseService.getOrLoadCourse('malformed', mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => { throw parseError; }
        }))
      ).rejects.toBe(parseError);
    });
  });

  describe('WHEN network errors occur', () => {
    it('shall propagate network error unchanged', async () => {
      const networkError = new Error('Network timeout');
      mockFetch.mockRejectedValueOnce(networkError);

      // Kill try-catch mutants
      await expect(
        courseService.getOrLoadCourse('offline', mockFetch)
      ).rejects.toBe(networkError);
    });

    it('shall propagate DNS errors unchanged', async () => {
      const dnsError = new Error('ENOTFOUND');
      mockFetch.mockRejectedValueOnce(dnsError);

      await expect(
        courseService.getOrLoadCourse('unknown', mockFetch)
      ).rejects.toThrow('ENOTFOUND');
    });
  });

  describe.skip('WHEN readCourse is called', () => {
    it('shall update currentCourse rune with exact course object', async () => {
      const specificCourse = {
        ...mockCourse,
        title: 'Specific Course',
        courseId: 'specific',
        courseUrl: 'specific.com'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => specificCourse
      });

      await courseService.readCourse('specific', mockFetch);

      // Kill rune assignment mutants
      expect(currentCourse.value).not.toBeNull();
      expect(currentCourse.value?.title).toBe('Specific Course');
      expect(currentCourse.value?.courseId).toBe('specific');
    });

    it('shall update currentLo rune to same course object', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCourse
      });

      const course = await courseService.readCourse('test', mockFetch);

      // Kill assignment mutants - currentLo should equal currentCourse
      expect(currentLo.value).not.toBeNull();
      expect(currentLo.value).toBe(course);
      expect(currentLo.value?.title).toBe(course.title);
    });

    it('shall update courseUrl rune from course object', async () => {
      const courseWithUrl = {
        ...mockCourse,
        courseUrl: 'example.netlify.app'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => courseWithUrl
      });

      await courseService.readCourse('test', mockFetch);

      // Kill property access mutants
      expect(courseService.courseUrl.value).toBe('example.netlify.app');
      expect(courseService.courseUrl.value).not.toBe('');
      expect(courseService.courseUrl.value.length).toBeGreaterThan(0);
    });
  });

  describe.skip('WHEN readTopic is called', () => {
    it('shall call readCourse first', async () => {
      const topic = {
        type: 'topic',
        title: 'Topic 1',
        route: '/topic/test/t1'
      };

      const courseWithTopic = {
        ...mockCourse,
        topicIndex: new Map([['/topic/test/t1', topic as any]])
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => courseWithTopic
      });

      await courseService.readTopic('test', '/topic/test/t1', mockFetch);

      // Kill function call mutants - fetch must be called
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalled();
    });

    it('shall retrieve topic from topicIndex Map', async () => {
      const topic = {
        type: 'topic',
        title: 'Retrieved Topic',
        route: '/topic/test/retrieved'
      };

      const course = {
        ...mockCourse,
        topicIndex: new Map([['/topic/test/retrieved', topic as any]])
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => course
      });

      const result = await courseService.readTopic('test', '/topic/test/retrieved', mockFetch);

      // Kill Map.get mutants
      expect(result).toBeDefined();
      expect(result?.title).toBe('Retrieved Topic');
      expect(result).toBe(topic);
    });

    it('shall update currentLo when topic is found', async () => {
      const foundTopic = {
        type: 'topic',
        title: 'Found',
        route: '/topic/test/found'
      };

      const course = {
        ...mockCourse,
        topicIndex: new Map([['/topic/test/found', foundTopic as any]])
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => course
      });

      await courseService.readTopic('test', '/topic/test/found', mockFetch);

      // Kill conditional mutants - currentLo should be updated
      expect(currentLo.value).not.toBeNull();
      expect(currentLo.value?.title).toBe('Found');
      expect(currentLo.value).toBe(foundTopic);
    });
  });

  describe('WHEN multiple courses are cached', () => {
    it('shall maintain separate entries with correct sizes', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ ...mockCourse, title: 'Course A' })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ ...mockCourse, title: 'Course B' })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ ...mockCourse, title: 'Course C' })
        });

      await courseService.getOrLoadCourse('a', mockFetch);

      // Kill size check mutants
      expect(courseService.courses.size).toBe(1);

      await courseService.getOrLoadCourse('b', mockFetch);
      expect(courseService.courses.size).toBe(2);

      await courseService.getOrLoadCourse('c', mockFetch);
      expect(courseService.courses.size).toBe(3);

      // Verify exact entries
      expect(courseService.courses.get('a')?.title).toBe('Course A');
      expect(courseService.courses.get('b')?.title).toBe('Course B');
      expect(courseService.courses.get('c')?.title).toBe('Course C');
    });
  });

  describe('WHEN cache is cleared', () => {
    it('shall fetch fresh data', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ ...mockCourse, title: 'First' })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ ...mockCourse, title: 'Second' })
        });

      await courseService.getOrLoadCourse('clear-test', mockFetch);

      // Kill fetch call mutants
      expect(mockFetch).toHaveBeenCalledTimes(1);

      courseService.courses.clear();

      await courseService.getOrLoadCourse('clear-test', mockFetch);

      // Must be called again after clear
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch.mock.calls.length).toBe(2);
    });
  });
});
