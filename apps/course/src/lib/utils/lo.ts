import type { Lo } from '$lib/types/lo';

export function injectCourseUrl(lo: Lo, id: string, url: string) {
	if (lo.type === 'archive' || lo.type === 'otherType') {
		lo.route = lo.route?.replace('{{COURSEURL}}', url);
	} else {
		lo.route = lo.route?.replace('{{COURSEURL}}', id);
	}

	lo.img = lo.img?.replace('{{COURSEURL}}', url);
	lo.video = lo.video?.replace('{{COURSEURL}}', id);
	lo.pdf = lo.pdf?.replace('{{COURSEURL}}', url);

	if (lo.los) {
		lo.los.forEach((childLo) => {
			injectCourseUrl(childLo, id, url);
		});
	}
}

export function flattenLos(los: Lo[]): Lo[] {
	let result: Lo[] = [];
	los.forEach((lo) => {
		result.push(lo);
		if (lo.los) result = result.concat(flattenLos(lo.los));
	});
	return result;
}

export function removeLastDirectory(the_url: string): string {
	const lastSlashIndex = the_url.lastIndexOf('/');
	return the_url.substring(0, lastSlashIndex);
}

export function findCourseUrls(labUrl: string): string[] {
	let topicUrl = removeLastDirectory(labUrl);

	const lastSlashIndex = topicUrl.lastIndexOf('/');
	const topicUrlBasename = topicUrl.substring(lastSlashIndex + 1);

	if (topicUrlBasename.startsWith('unit') && topicUrl.includes('topic')) {
		topicUrl = removeLastDirectory(topicUrl);
	}

	const courseUrl = removeLastDirectory(topicUrl);
	return [courseUrl, topicUrl];
}

export function removeLeadingHashes(str: string): string {
	const hashIndex = str.lastIndexOf('#');
	return hashIndex >= 0 ? str.substring(hashIndex + 1) : str;
}

export function lastSegment(url: string) {
	const parts = url.split('/');
	return parts[parts.length - 1];
}

export function threadLos(parent: Lo) {
	for (const lo of parent.los) {
		lo.parentLo = parent;
		if (lo.los) {
			threadLos(lo);
		}
	}
}

export function findLos(los: Lo[], lotype: string): Lo[] {
	const result: Lo[] = [];
	for (const lo of los) {
		if (lo.type === lotype) {
			result.push(lo);
		}
		if (lo.type === 'unit' || lo.type === 'side') {
			result.push(...findLos(lo.los, lotype));
		}
	}
	return result;
}

export function findVideoLos(los: Lo[]): Lo[] {
	const result: Lo[] = [];
	for (const lo of los) {
		if (lo.video) {
			result.push(lo);
		}
		if (lo.type === 'unit') {
			result.push(...findVideoLos(lo.los));
		}
	}
	return result;
}

export function allLos(lotype: string, los: Lo[]): Lo[] {
	const allLos: Lo[] = [];
	for (const topic of los) {
		allLos.push(...findLos(topic.los, lotype));
	}
	return allLos;
}

export function allVideoLos(los: Lo[]): Lo[] {
	const allLos: Lo[] = [];
	for (const topic of los) {
		allLos.push(...findVideoLos(topic.los));
	}
	return allLos;
}

export function fixRoutes(lo: Lo) {
	if (lo.route && lo.route.startsWith('#')) {
		lo.route = `/${lo.route.slice(1)}`;
	}
	if (lo.route.endsWith('.md') && lo.video) {
		lo.route = lo.video;
	}
}

export function getSortedUnits(los: Lo[]) {
	const allUnits = los.filter((lo) => lo.type === 'unit');
	for (const unit of allUnits) {
		const [panelVideos, panelTalks, standardLos] = [
			unit.los.filter((lo) => lo.type === 'panelvideo'),
			unit.los.filter((lo) => lo.type === 'paneltalk'),
			unit.los.filter(
				(lo) => lo.type !== 'unit' && lo.type !== 'panelvideo' && lo.type !== 'paneltalk'
			)
		];
		unit.los = [...panelVideos, ...panelTalks, ...standardLos];
	}
	return allUnits;
}
