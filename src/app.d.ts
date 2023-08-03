import { ScrollSmoother } from 'gsap/dist/ScrollSmoother'
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}

	interface Window {
		smoother: ScrollSmoother
	}
}

export {}
