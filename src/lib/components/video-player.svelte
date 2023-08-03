<script lang="ts">
	import LoadingSpinner from './loading-spinner.svelte'

	import { onMount, beforeUpdate, afterUpdate } from 'svelte'
	import { gsap } from 'gsap'
	import { Draggable } from 'gsap/dist/Draggable'

	type QuickSetter = (value: number) => void

	gsap.registerPlugin(Draggable)

	let className = ''

	export { className as class }
	export let autoplay = false,
		controls = true,
		crossorigin: string | null = null,
		loop = false,
		muted = false,
		poster: string | null = null,
		preload: string | null = null,
		video: HTMLVideoElement | null = null,
		controller: HTMLDivElement | null = null,
		mediaTime = '00:00',
		isPlaying: boolean = false,
		hasEnded: boolean = false

	let duration: number,
		currentTime: number,
		playhead: HTMLSpanElement,
		playheadAnim: gsap.core.Tween | null,
		trackWidth: number,
		quickWidth: QuickSetter,
		quickX: QuickSetter,
		isLoading: boolean = true

	function onPlay() {
		video?.play()

		if (hasEnded) {
			playheadAnim?.kill()
			createTween(duration)
			quickX(0)
			hasEnded = false
		}

		isPlaying = true
		isLoading = false
	}

	function onPause() {
		video?.pause()
		isPlaying = false
	}

	function onEnded() {
		if (!video) return

		video.pause()
		isPlaying = false
		hasEnded = true
	}

	function setTime() {
		if (!video) return

		const minutes = Math.floor(video.currentTime / 60)
		const seconds = Math.floor(video.currentTime - minutes * 60)

		const minuteValue = minutes.toString().padStart(2, '0')
		const secondValue = seconds.toString().padStart(2, '0')

		mediaTime = `${minuteValue}:${secondValue}`
	}

	function createTween(d: number) {
		playheadAnim = gsap.to(playhead, {
			x: trackWidth - playhead.clientWidth,
			ease: 'none',
			duration: d || 0,
			onUpdate: trackWidthUpdate,
			paused: true
		})
	}

	function trackWidthUpdate() {
		const currentPlayheadPosition = Math.round(Number(gsap.getProperty(playhead, 'x')))
		quickWidth(currentPlayheadPosition)
	}

	onMount(() => {
		// duration = video.duration

		if (video && controller && controls) {
			// make custom controller visible and remove default controls
			controller.style.visibility = 'visible'
			video.removeAttribute('controls')

			let trackFilled: HTMLElement | null = document.querySelector('[data-tracked]')
			let track: HTMLElement | null = document.querySelector('[data-track]')
			trackWidth = track?.clientWidth || 0

			quickX = gsap.quickSetter(playhead, 'x') as QuickSetter
			quickWidth = gsap.quickSetter(trackFilled, 'width', 'px') as QuickSetter

			quickWidth(0)

			const promise = video.play()

			if (promise !== undefined) {
				promise
					.then(() => {
						createTween(duration)
						isPlaying = true
						isLoading = false
					})
					.catch(() => {
						createTween(duration)
						isPlaying = false
						isLoading = false
					})
			}

			// create Draggable
			// let clamper = gsap.utils.normalize(0, trackWidth - playhead.clientWidth)

			Draggable.create(playhead, {
				type: 'x',
				bounds: track,
				onDragStart: function () {
					playheadAnim?.pause()
				},
				onDrag: function () {
					if (!video) return
					const currentX = Math.round(this.x)
					const progress = currentX / (trackWidth - playhead.clientWidth)
					currentTime = duration * progress
					video.currentTime = currentTime
					quickWidth(currentX)
				},
				onDragEnd: function () {
					playheadAnim?.kill()
					createTween(duration - currentTime)
					playheadAnim?.paused(!isPlaying)
				}
			})
		}

		addEventListener('resize', () => {
			let track: HTMLElement | null = document.querySelector('[data-track]')
			if (!track || !video) return
			trackWidth = track.clientWidth
			createTween(duration - video.currentTime)
		})
	})

	$: isPlaying ? playheadAnim?.play() : playheadAnim?.pause()
</script>

<svelte:window
	on:keydown|preventDefault={(e) => e.code === 'Space' && (isPlaying ? onPause() : onPlay())}
/>

<div class={`relative ${className}`}>
	<video
		class="h-full w-screen"
		{controls}
		{crossorigin}
		{loop}
		{muted}
		{poster}
		{preload}
		{autoplay}
		on:click
		on:ended={onEnded}
		on:timeupdate={setTime}
		on:canplay={onPlay}
		on:waiting={() => {
			isLoading = true
			onPause()
		}}
		on:loadedmetadata={() => createTween(duration)}
		bind:this={video}
		bind:duration
	>
		<slot />
	</video>
	<div
		class="invisible absolute bottom-4 z-50 flex w-full items-center justify-center pl-4 pt-8 text-white md:bottom-16 md:pb-8 md:pl-32 md:pr-32"
		bind:this={controller}
	>
		<div class="min-w-[5ch]">
			{#if isPlaying}
				<button class="text-sm" aria-label="stop" on:click={onPause}>PAUSE</button>
			{:else}
				<button class="text-sm" aria-label="play pause toggle" on:click={onPlay}>PLAY</button>
			{/if}
		</div>
		<div class="relative ml-12 mr-12 flex-auto" data-track-container>
			<div class="absolute z-10 h-full w-full origin-left bg-white" data-tracked />
			<div class="relative h-[1px] w-full bg-white opacity-50" data-track />
			<div
				bind:this={playhead}
				class="absolute left-0 h-2 w-2 -translate-y-1/2 cursor-ew-resize rounded-full bg-white"
			>
				<div class="absolute left-1 top-3 -translate-x-1/2 text-xs tabular-nums" aria-label="timer">
					{mediaTime}
				</div>
			</div>
		</div>
		<button
			class="hidden text-sm md:block"
			on:click={() => window.smoother.scrollTo('footer', true, 'bottom bottom')}>INFO</button
		>
	</div>
	<div
		class="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-primary opacity-0"
		class:loading={isLoading}
	>
		<LoadingSpinner />
	</div>
</div>

<style lang="postcss">
	.loading {
		@apply opacity-50;
	}
</style>
