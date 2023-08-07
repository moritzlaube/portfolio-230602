<script lang="ts">
	import me_800_png from '$lib/assets/me-800.png'
	import me_800_webp from '$lib/assets/me-800.webp'
	import me_400_png from '$lib/assets/me-800.png'
	import me_400_webp from '$lib/assets/me-800.webp'
	import me_260_png from '$lib/assets/me-800.png'
	import me_260_webp from '$lib/assets/me-800.webp'
	import me_130_png from '$lib/assets/me-800.png'
	import me_130_webp from '$lib/assets/me-800.webp'
	import Share from '$lib/icons/share.svelte'

	import { gsap } from 'gsap'
	import { SplitText } from 'gsap/dist/SplitText'
	import { onMount } from 'svelte'
	import { initialLoad, introAnimationplayed } from '$lib/stores/preloader'

	gsap.registerPlugin(SplitText)

	let tl = gsap.timeline({ delay: 1.5, paused: true })

	onMount(() => {
		if ($introAnimationplayed) return

		const chars = new SplitText('.split', {
			type: 'chars'
		}).chars

		tl.from(chars, {
			duration: 1,
			y: 100,
			opacity: 0,
			stagger: 0.025,
			ease: 'power4.out'
		}).from(
			'.hero-image',
			{
				duration: 1.5,
				opacity: 0,
				x: 80,
				ease: 'power4.out'
			},
			'<+.25'
		)
	})

	$: {
		if (!$initialLoad && !$introAnimationplayed)
			tl.play().eventCallback('onComplete', () => introAnimationplayed.set(true))
	}
</script>

<header class="grid grid-cols-2">
	<div class="wrapper col-span-2 col-start-1 row-span-full mt-20 bg-white sm:mt-28">
		<h1
			id="home-heading"
			class="relative z-10 text-[157px] font-black uppercase leading-[95%] max-[1275px]:text-[11vw]"
		>
			<div class="split">Commercials</div>
			<div class="split">suck</div>
		</h1>
		<div
			class="eyebrow relative z-50 mt-16 text-2xl uppercase text-white mix-blend-difference sm:text-4xl"
		>
			<div class="split">Let's create stories</div>
			<div class="split">that stick</div>
		</div>
	</div>
	<div
		class="relative col-end-3 row-span-full flex max-h-[90vh] items-end justify-center bg-tertiary"
	>
		<div class="z-20 h-[70%] sm:h-[80%]">
			<picture>
				<source
					srcset={`${me_130_webp} 130w, ${me_260_webp} 260w, ${me_400_webp} 400w, ${me_800_webp} 800w`}
					type="image/webp"
				/>
				<source
					srcset={`${me_130_png} 130w, ${me_260_png} 260w, ${me_400_png} 400w, ${me_800_png} 800w`}
					type="image/png"
				/>
				<img src={me_400_png} alt="" class="hero-image h-full w-full object-contain" />
			</picture>
		</div>
		<div class="absolute bottom-10 z-20 hidden text-white sm:block">
			<p class="mb-1 text-xs">Represented by</p>
			<a href="/" class="align-center flex items-center text-sm tracking-widest">
				THE DIRECTORSCLUB<Share width="16" height="16" class="ml-1" />
			</a>
		</div>
	</div>
</header>

<style lang="postcss">
	.split {
		@apply overflow-hidden;
	}
</style>
