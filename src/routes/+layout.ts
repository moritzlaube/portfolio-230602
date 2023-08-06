import type { LayoutLoad } from './$types'

export const prerender = true

import db from '../data.json'

export const load: LayoutLoad = ({ url }) => {
	return {
		url: url.pathname,
		db
	}
}
