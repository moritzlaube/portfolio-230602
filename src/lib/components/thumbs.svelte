<script lang="ts">
	import type { PageData } from '../../routes/$types'

	export let data: PageData['db']

	async function playVideo(this: HTMLElement) {
		const video = this.querySelector('video')

		if (!video) return

		const promise = video.play()

		if (promise !== undefined) {
			promise.then(() => {}).catch(() => {})
		}
	}

	function pauseVideo(this: HTMLElement) {
		const video = this.querySelector('video')
		video?.pause()
	}
</script>

<section
	id="work"
	class="mx-auto mt-12 grid grid-cols-1 items-start gap-4 px-4 sm:px-6 md:grid-cols-12"
>
	<span class="eyebrow relative mt-4 text-2xl uppercase md:col-span-1 md:col-start-2"
		>Selected Work</span
	>
	{#each data as entry}
		<a
			href={`/work/${entry.slug}`}
			class="thumb aspect-h-9 aspect-w-16 relative overflow-hidden rounded-lg md:col-span-6 md:col-start-4"
			on:mouseenter={playVideo}
			on:mouseleave={pauseVideo}
		>
			<picture>
				<source
					srcset={`/thumbs/${entry.thumb}-350.webp 350w, /thumbs/${entry.thumb}-700.webp 700w, /thumbs/${entry.thumb}-1400.webp 1400w`}
					sizes="(min-width: 768px) 50vw, 100vw"
					type="image/webp"
				/>
				<source
					srcset={`/thumbs/${entry.thumb}-350.jpg 350w, /thumbs/${entry.thumb}-700.jpg 700w, /thumbs/${entry.thumb}-1400.jpg 1400w`}
					sizes="(min-width: 768px) 50vw, 100vw"
					type="image/jpg"
				/>
				<img
					class="h-full w-full object-cover md:saturate-0"
					src={`/thumbs/${entry.thumb}-700.jpg`}
					alt=""
				/>
			</picture>

			<div class=" hidden md:block">
				<video
					data-video-thumb
					class="h-full w-full object-cover opacity-0 transition-opacity duration-500 ease-in-out hover:opacity-100"
					muted
					loop
					crossorigin="anonymous"
				>
					<source data-src={`/videos/thumbs/${entry.thumbPreviewWebM}`} type="video/webm" />
					<source data-src={`/videos/thumbs/${entry.thumbPreviewMp4}`} type="video/mp4" />
					<source data-src={`/videos/thumbs/${entry.thumbPreviewOgg}`} type="video/ogg" />
				</video>
			</div>
			<div
				class="thumb__client pointer-events-none !bottom-0 !left-1/2 !right-auto !top-auto flex !h-1/3 !w-full -translate-x-1/2 items-center justify-center bg-gradient-to-t from-primary text-center text-2xl text-white opacity-100 transition-all duration-300 ease-in-out md:translate-y-6 md:opacity-0"
			>
				{entry.client.toUpperCase()}
			</div>
		</a>
	{/each}
</section>

<style lang="postcss">
	.thumb:nth-child(6n-3) {
		@apply md:aspect-h-3 md:aspect-w-4 md:col-span-5 md:col-start-3;
	}
	.thumb:nth-child(6n-2) {
		@apply md:aspect-h-4 md:aspect-w-4 md:col-span-3 md:col-start-8;
	}
	.thumb:nth-child(6n) {
		@apply md:aspect-h-4 md:aspect-w-4 md:col-span-3 md:col-start-3;
	}
	.thumb:nth-child(6n + 1) {
		@apply md:aspect-h-3 md:aspect-w-4 md:col-span-5 md:col-start-6;
	}

	.thumb:hover .thumb__client {
		@apply translate-y-0 opacity-100;
	}
</style>
