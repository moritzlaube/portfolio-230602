<script lang="ts">
	import type { PageData } from './$types'
	import HomeHeader from '$lib/components/home-header.svelte'
	import Thumbs from '$lib/components/thumbs.svelte'
	import Portal from '$lib/components/portal.svelte'
	import MouseFollower from '$lib/components/mouse-follower.svelte'
	import Contact from '$lib/components/contact.svelte'
	import Footer from '$lib/components/footer.svelte'
	import { gsap } from 'gsap'
	import { onMount } from 'svelte'

	export let data: PageData

	onMount(() => {
		if (document.body.dataset.loaded === 'true') {
			let mm = gsap.matchMedia()
			mm.add('(min-width: 768px)', () => {
				const videos: HTMLVideoElement[] = Array.from(
					document.querySelectorAll('[data-video-thumb]')
				)
				videos.forEach((video) => {
					video.querySelectorAll('source').forEach((source) => {
						if (!source.dataset.src) return
						source.setAttribute('src', source.getAttribute('data-src') || '')
					})
					video.load()
				})
			})
		}
	})
</script>

<div id="home">
	<HomeHeader />
	<Thumbs data={data.db} />
	<Contact />
	<Footer />
</div>

<Portal>
	<MouseFollower />
</Portal>
