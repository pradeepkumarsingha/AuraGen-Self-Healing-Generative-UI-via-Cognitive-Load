// backend/src/routes/health.js
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'auragen-backend' });
});

export default router;