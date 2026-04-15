export default function blogRoutes(app) {
	app.get('/api/blog/posts', (req, res) => {
		res.json({ posts: [] });
	});
}