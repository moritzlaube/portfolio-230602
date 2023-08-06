<script lang="ts">
	import { goto } from '$app/navigation'
	import { gsap } from 'gsap'
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
	import { onMount } from 'svelte'
	import { MoveLeft } from 'lucide-svelte'
	import Footer from '$lib/components/footer.svelte'
	import VideoPlayer from '$lib/components/video-player.svelte'

	export let data

	type QuickTo = (value: number) => void

	if (typeof window !== 'undefined') {
		gsap.registerPlugin(ScrollTrigger)
	}

	const mm = gsap.matchMedia()

	let xTo: QuickTo,
		yTo: QuickTo,
		video: HTMLVideoElement,
		volumeAnimation: QuickTo,
		isPlaying = false,
		navigatedBack = false

	function followMouse(e: MouseEvent) {
		if (!xTo || !yTo) return
		if (e.target instanceof HTMLElement && e.target.nodeName !== 'VIDEO') {
			gsap.to('[data-back-button]', { scale: 0, duration: 0.5, ease: 'back.out(1.4)' })
		} else {
			if (navigatedBack) return
			gsap.to('[data-back-button]', { scale: 1, duration: 0.5, ease: 'back.out(1.4)' })
		}

		xTo(e.clientX)
		yTo(e.clientY)
	}

	function onBackBtnClick() {
		mm.add('(min-width: 768px)', async () => {
			await goto('/')
			navigatedBack = true
			volumeAnimation(0)
			gsap.to('[data-back-button]', { scale: 0, duration: 0.5, ease: 'back.out(1.4)' })
		})
	}

	onMount(async () => {
		// put back button in the middle of the screen
		gsap.set('[data-back-button]', {
			x: window.innerWidth / 2,
			y: window.innerHeight / 2,
			scale: 0
		})

		// setup quickTo animations for mouse followwe and volume animation
		xTo = gsap.quickTo('[data-back-button]', 'x', { duration: 0.5, ease: 'power3' })
		yTo = gsap.quickTo('[data-back-button]', 'y', { duration: 0.5, ease: 'power3' })
		volumeAnimation = gsap.quickTo(video, 'volume', { duration: 1.5, ease: 'none' })

		// setTimeout solves a bug where the infos would not animate in on first load and the video would not stretch to 100vw
		setTimeout(() => {
			gsap.to('[data-video-container]', {
				scrollTrigger: {
					trigger: '#detail',
					start: 'top top',
					end: 'bottom bottom',
					scrub: true,
					pin: '[data-video-container]',
					pinSpacing: false,
					pinType: 'transform'
				},
				opacity: 0,
				ease: 'none',
				onUpdate() {
					if (navigatedBack || !isPlaying || !video) return
					video.volume = 1 - this.progress()

					if (this.progress === 1) {
						video.pause()
					} else {
						video.play()
					}
				}
			})

			gsap.fromTo(
				'.info',
				{
					autoAlpha: 0,
					y: '+=50'
				},
				{
					autoAlpha: 1,
					y: '0',
					duration: 1.5,
					ease: 'power4.out',
					stagger: 0.1,
					scrollTrigger: {
						trigger: '.info-wrapper',
						start: 'top 95%'
						// markers: true
					}
				}
			)

			gsap.from('.js-title h2, .js-title p', {
				scrollTrigger: {
					trigger: '.js-title',
					start: 'top 85%'
					// end: 'bottom bottom',
				},
				yPercent: 100,
				opacity: 0,
				duration: 1,
				ease: 'power4.out',
				stagger: 0.2
			})
		}, 100)

		// cleanup
		return () => {
			ScrollTrigger.killAll()
			mm.revert()
		}
	})
</script>

<svelte:window on:mousemove={followMouse} />

<div id="detail" class="flex min-h-screen flex-col bg-[#000]">
	<div data-video-container class="w-screen bg-[#000] pt-20 md:h-screen md:pt-0">
		<button
			data-back-button
			class="pointer-events-none fixed z-50 hidden -translate-x-1/2 -translate-y-1/2 p-4 text-sm uppercase text-white md:block"
			><MoveLeft strokeWidth="1" class="mr-2 inline-block" /><span />Get Back</button
		>
		<VideoPlayer class="h-full" autoplay bind:video bind:isPlaying on:click={onBackBtnClick}>
			<source src={`/videos/full/${data.project?.videoWebM}`} type="video/webm" />
			<source src={`/videos/full/${data.project?.videoMp4}`} type="video/mp4" />
			<source src={`/videos/full/${data.project?.videoOgg}`} type="video/ogg" />
		</VideoPlayer>
	</div>
	<section
		class="wrapper relative z-10 mb-auto flex w-full flex-col-reverse text-white md:flex-col"
	>
		<dl class="info-wrapper flex w-full flex-col justify-between gap-y-4 md:flex-row">
			<div class="info">
				<dt class="font-bold">Client</dt>
				<dd>{data.project?.client}</dd>
			</div>
			<div class="info">
				<dt class="font-bold">Agency</dt>
				<dd>{data.project?.agency}</dd>
			</div>
			<div class="info">
				<dt class="font-bold">Production House</dt>
				<dd>{data.project?.productionCompany}</dd>
			</div>
			{#if data.project?.dop}
				<div class="info">
					<dt class="font-bold">Director of Photography</dt>
					<dd>{data.project?.dop}</dd>
				</div>
			{/if}
		</dl>
		<div class="js-title space-y-4 pb-8 pt-8 md:pb-36 md:pt-16">
			<div class="overflow-hidden">
				<h2 class="text-4xl tracking-wider">
					<span class="uppercase">{data.project?.client}</span> - {data.project?.title}
				</h2>
			</div>
			<p>
				{data.project?.description}
			</p>
		</div>
		<a href="/" class="pt-8 text-sm uppercase text-white md:hidden"
			><MoveLeft strokeWidth="1" class="mr-2 inline-block" /><span />Get Back</a
		>
	</section>
	<div class="z-10 bg-[#000]">
		<Footer color={'white'} className="flex-1" />
	</div>
</div>
