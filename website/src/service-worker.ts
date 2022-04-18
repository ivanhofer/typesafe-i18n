import { build, files, version } from '$service-worker';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
self.addEventListener('install', (event: any) => {
	event.waitUntil(
		caches.open(version).then(cache => {
			return cache.addAll([...build, ...files])
		})
	)
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
self.addEventListener('fetch', (event: any) => {
	event.respondWith(
		caches.match(event.request).then(async cachedResponse => {
			if (cachedResponse) cachedResponse

			// request the non-cached resource
			const response = await fetch(event.request)
			if (response.status < 300) {
				const cache = await caches.open(version)
				cache.put(event.request, response.clone())
			}

			return response
		})
	)
})

export { }