<script>
	import { gsap } from 'gsap'
	import { page } from '$app/stores'

	let hovered = false

	let /** @type {typeof gsap.quickTo} */ xTo, /** @type {typeof gsap.quickTo} */ yTo

	let onMouseMove, onMouseOver

	/**
	 * Follows the mouse movement.
	 * @param {HTMLElement} node - The HTML element to follow the mouse.
	 * @returns {Object|undefined}  An object with a `destroy` method to remove the event listeners.
	 */
	function followMouse(node) {
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

		onMouseMove = /** @param {MouseEvent} event */ (event) => {
			xTo(event.clientX)
			yTo(event.clientY)
		}

		/**
		 * Handles the on click event.
		 * @param {MouseEvent & { target?: { nodeName?: string } }} event - The mouse over event.
		 */
		const onClick = (event) => {
			if (event?.target?.nodeName === 'VIDEO' || event.target?.nodeName === 'A') {
				gsap.to(node, { scale: 0, duration: 0.5, ease: 'power4.out' })
			}
		}

		/**
		 * Handles the mouse over event.
		 * @param {MouseEvent & { target?: { nodeName?: string } }} event - The mouse over event.
		 */
		onMouseOver = (event) => {
			hovered = false

			if (event.target?.nodeName === 'A' || event.target?.nodeName === 'VIDEO') {
				gsap.to(node, { scale: 2, duration: 0.5, ease: 'back.out(1.4)' })

				if (event.target?.nodeName === 'VIDEO') {
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
	class="pointer-events-none fixed z-50 hidden h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white text-[8px] uppercase text-primary mix-blend-difference sm:flex md:cursor-none"
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
