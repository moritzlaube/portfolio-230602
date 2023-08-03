import db from '../../../data.json'

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	return {
		project: db.find((project) => project.slug === params.slug)
	}
}
