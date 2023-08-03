export const prerender = true

import db from '../data.json'

export function load({ url }) {
	return {
		url: url.pathname,
		db
	}
}
