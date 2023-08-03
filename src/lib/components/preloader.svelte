<script lang="ts">
	import { gsap } from 'gsap'
	import { DrawSVGPlugin } from 'gsap/dist/DrawSVGPlugin'
	import Logo from '$lib/icons/logo.svelte'
	import { onMount, createEventDispatcher } from 'svelte'
	import { spring } from 'svelte/motion'

	gsap.registerPlugin(DrawSVGPlugin)

	// Start logo from 0 before animating
	//
	let loaded = 0,
		totalAssets = 0,
		percentageLoaded = spring(0, { stiffness: 0.1, damping: 1 }),
		tl: gsap.core.Timeline | null = null

	const dispatch = createEventDispatcher()

	function loading() {
		const images = document.querySelectorAll('img')
		const videos = document.querySelectorAll('video')

		totalAssets += images.length

		videos.forEach((video) => {
			if (video.querySelector('source')?.getAttribute('src')) {
				totalAssets++
			}
		})

		let mm = gsap.matchMedia()

		mm.add('(min-width: 768px)', () => {
			videos.forEach((video) => {
				let videoNeedsTOBeAddedToTotal = false
				video.querySelectorAll('source').forEach((source) => {
					if (!source.dataset.src) return
					videoNeedsTOBeAddedToTotal = true
					source.setAttribute('src', source.getAttribute('data-src') || '')
				})
				videoNeedsTOBeAddedToTotal ? totalAssets++ : null
				video.load()
			})
		})

		// loop through images and videos and add event listeners to check if they are loaded
		images.forEach((img) => {
			if (img.complete) {
				loaded++
			} else {
				img.addEventListener('load', () => loaded++)
			}
		})

		videos.forEach((video) => {
			if (video.readyState > 3) {
				loaded++
			} else {
				video.addEventListener('canplay', () => {
					loaded++
				})
			}
		})
	}

	function onAnimationComplete() {
		dispatch('loaded')
	}

	onMount(() => {
		loading()

		gsap.set('.logo', { display: 'block' })

		tl = gsap.timeline({ paused: true, onComplete: onAnimationComplete })
		tl.from('#mo', {
			duration: 4,
			drawSVG: '0% 0%'
		})
			.from(
				'#dot',
				{
					duration: 1,
					drawSVG: '0% 0%'
				},
				0
			)
			.to(
				'#preloader-wrapper',
				{
					duration: 2,
					bottom: '100%',
					ease: 'power4.inOut'
				},
				'-=3'
			)
	})

	$: {
		percentageLoaded.set(loaded / totalAssets || 0)
		if (loaded === totalAssets) {
			tl?.play()
		}
	}
</script>

<div id="preloader-wrapper" class="pointer-events-none fixed inset-0 z-50 overflow-hidden bg-white">
	<div id="preloader" class="relative flex h-screen w-screen items-center justify-center">
		<Logo class="logo hidden scale-150 opacity-50" />
		<div class="absolute bottom-1 right-10 text-8xl font-bold tabular-nums">
			{Math.ceil($percentageLoaded * 100)}%
		</div>
	</div>
</div>
