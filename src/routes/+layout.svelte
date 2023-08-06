<script lang="ts">
	import '../app.css'
	import Preloader from '$lib/components/preloader.svelte'
	import { gsap } from 'gsap'
	import { ScrollSmoother } from 'gsap/dist/ScrollSmoother'
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
	import { goto } from '$app/navigation'
	import BaseNav from '$lib/components/base-nav.svelte'
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import type { FadeParams, TransitionConfig } from 'svelte/types/runtime/transition'

	export let data

	// variable to store scroll position of home page
	let scrollPosition = 0
	/**
	 * @type {string | null}
	 */
	let scrollToElem: string | null = null

	let preloaderAnimationCompleted = false

	gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

	function getSamePageLinks() {
		return Array.from(document.querySelectorAll('a[href]')).filter((a) => {
			return (a as HTMLAnchorElement).hash
		}) as HTMLAnchorElement[]
	}

	onMount(() => {
		window.smoother = ScrollSmoother.create({
			smooth: 2,
			speed: 2,
			effects: false
		})

		// scroll down to work section when "work" is clicked in nav
		if (getSamePageLinks().length) {
			getSamePageLinks().forEach((a) => {
				a.addEventListener('click', (event) => {
					event.preventDefault()
					if (a.pathname !== location.pathname) {
						goto(a.pathname)
						scrollToElem = a.hash
					} else {
						window.smoother.scrollTo(document.querySelector(a.hash), true, 'top 10%')
					}
				})
			})
		}
	})

	// pulling "from" page out of document flow and positioning it absolutely over "to" page
	function wipe(
		node: HTMLElement,
		{ duration = 250, delay = 0 }: FadeParams = {}
	): TransitionConfig {
		// if (!node) return

		// moving "out" page to top of document and out of scroll smoother wrapper to make position fixed work
		const body = document.body
		body.appendChild(node)

		// setting "out" page to fixed position and full width/height
		gsap.set(node, {
			position: 'fixed',
			inset: 0,
			width: document.body.clientWidth,
			height: window.innerHeight,
			overflow: 'hidden',
			backgroundColor: '#fff',
			opacity: 1,
			visibility: 'visible',
			// fix for Safari bug where the video is still visible on transition
			backfaceVisibility: 'hidden',
			transform: 'translate3d(0,0,0)',
			zIndex: 9999
		})

		// When scrolling away from 'home' keep scroll position and store scrollPosition in variable
		if (data.url !== '/') {
			gsap.set(node.firstChild, {
				y: window.smoother.scrollTop() * -1
			})
			scrollPosition = window.smoother.scrollTop()
			// when going back to 'home' page, scroll to stored scrollPosition and kill all scroll triggers to prevent videos from scrolling
		} else if (data.url === '/') {
			ScrollTrigger.killAll()
			//set timeout to prevent weird issue where scroll position is not set correctly
			setTimeout(() => {
				// check if clicked on "work" or "get in touch" link
				if (scrollToElem) {
					window.smoother.scrollTo(document.querySelector(scrollToElem), true, 'top 10%')
					scrollToElem = null
				} else {
					window.smoother.scrollTop(scrollPosition ?? 0)
				}
			}, 500)
		}
		// make sure page is scrolled to top before animating. Will be overwritten by scrollTop within setTimeout
		window.smoother.scrollTop(0)

		// perform animation
		const tl = gsap.timeline({ delay, defaults: { duration: duration / 1000 } })

		tl.to(node, {
			height: 0,
			ease: 'power4.inOut'
		})

		return {
			duration,
			delay,
			/**
			 * The function to call on each animation frame.
			 * @param {number} t - The current tick value.
			 */
			tick: (t) => {
				tl.progress(1 - t)
			}
		}
	}
</script>

<svelte:head>
	<title>{$page.data.project?.client} - {$page.data.project?.title}</title>
	<meta name="description" content={$page.data.project?.description} />
</svelte:head>

<BaseNav />
<div id="smooth-wrapper">
	<div id="smooth-content">
		{#key data.url}
			<main out:wipe={{ duration: 2000 }}>
				<slot />
			</main>
		{/key}
	</div>
</div>
{#if !preloaderAnimationCompleted}
	<Preloader on:animationComplete={() => (preloaderAnimationCompleted = true)} />
{/if}
