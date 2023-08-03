<script>
	/**
	 * @param {HTMLElement} node
	 */
	function portal(node) {
		let target

		target = document.querySelector('body')
		target?.appendChild(node)
		node.hidden = false

		return {
			destroy() {
				if (node.parentNode) {
					node.parentNode.removeChild(node)
				}
			}
		}
	}
</script>

<div hidden use:portal>
	<slot />
</div>
