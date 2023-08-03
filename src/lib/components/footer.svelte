<script>
	export let color = 'black'
	export let className = ''

	function handleBackToTop() {
		window.smoother.scrollTo(0, true)
	}
</script>

<footer
	class={`wrapper grid grid-cols-footerMobile items-center pb-12 pt-32 text-xs sm:grid-cols-footer sm:text-sm ${className}`}
	class:text-white={color === 'white'}
>
	<div>All Rights Reserved ©2023</div>
	<div class="flex flex-col text-center sm:m-auto sm:flex-row sm:space-x-4">
		<div><a href="https://vimeo.com/moritzlaube">Vimeo</a></div>
		<div><a href="https://www.instagram.com/moritzlaube/">Instagram</a></div>
		<div><a href="https://www.linkedin.com/in/moritz-laube-39aa35245/">LinkedIn</a></div>
	</div>
	<button class="text-right" on:click={handleBackToTop}>Back to top</button>
</footer>
