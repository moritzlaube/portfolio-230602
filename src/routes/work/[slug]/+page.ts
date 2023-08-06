import type { PageLoad } from './$types'
import db from '../../../data.json'

export const load: PageLoad = ({ params }) => {
	return {
		project: db.find((project) => project.slug === params.slug)
	}
}
