// /server/routes/content.ts

import express from "express";
import { ContentSchema } from "../contracts/content.schema";
import { validate } from "../middleware/validate";

const router = express.Router();

router.post(
	"/content",
	validate(ContentSchema),
	async (req, res) => {
		const data = req.body;

		// TODO: persist to DB

		return res.json({
			status: "ok",
			data,
		});
	}
);

export default router;