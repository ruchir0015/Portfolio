import app from './api/_lib/app';

const PORT = process.env.PORT || 3001;

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`[API] Local server running on http://localhost:${PORT}`);
  });
}
