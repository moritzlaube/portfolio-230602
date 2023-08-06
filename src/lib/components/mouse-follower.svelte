<script lang="ts">
	import { gsap } from 'gsap'
	import { page } from '$app/stores'

	let hovered = false

	let xTo: (x: number) => void, yTo: (y: number) => void

	let onMouseMove: (e: MouseEvent) => void, onMouseOver: (e: MouseEvent) => void

	function followMouse(node: HTMLElement) {
		if (!node) return

		xTo = gsap.quickTo(node, 'x', { duration: 0.5, ease: 'power3' })
		yTo = gsap.quickTo(node, 'y', { duration: 0.5, ease: 'power3' })

		gsap.set(node, {
			scale: 0,
			yPercent: -50,
			xPercent: -50,
			x: window.innerWidth / 2,
			y: window.innerHeight / 2
		})

		onMouseMove = (event: MouseEvent) => {
			xTo(event.clientX)
			yTo(event.clientY)
		}

		const onClick = (event: MouseEvent) => {
			if (
				(event?.target as HTMLElement)?.nodeName === 'VIDEO' ||
				(event?.target as HTMLElement)?.nodeName === 'A'
			) {
				gsap.to(node, { scale: 0, duration: 0.5, ease: 'power4.out' })
			}
		}

		onMouseOver = (event: MouseEvent) => {
			hovered = false

			if (
				(event?.target as HTMLElement)?.nodeName === 'A' ||
				(event?.target as HTMLElement)?.nodeName === 'VIDEO'
			) {
				gsap.to(node, { scale: 2, duration: 0.5, ease: 'back.out(1.4)' })

				if ((event?.target as HTMLElement)?.nodeName === 'VIDEO') {
					hovered = true
				}
			} else {
				gsap.to(node, { scale: 1, duration: 0.5, ease: 'back.out(1.4)' })
			}
		}

		window.addEventListener('mousemove', onMouseMove)
		window.addEventListener('mouseover', onMouseOver)
		window.addEventListener('click', onClick)

		return {
			destroy() {
				window.removeEventListener('mousemove', onMouseMove)
				window.removeEventListener('mouseover', onMouseOver)
				window.removeEventListener('click', onClick)
			}
		}
	}

	$: {
		if ($page.data.url !== '/') {
			window.removeEventListener('mousemove', onMouseMove)
			window.removeEventListener('mouseover', onMouseOver)
		}
	}
</script>

<div
	use:followMouse
	data-cursor
	class="pointer-events-none fixed z-50 hidden h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white text-[8px] uppercase text-primary mix-blend-difference md:flex md:cursor-none"
	class:hovered
>
	<span class="transition-opacity duration-100 ease-out">play</span>
</div>

<style>
	[data-cursor] span {
		content: 'play';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		opacity: 0;
	}

	[data-cursor].hovered span {
		opacity: 1;
	}
</style>
