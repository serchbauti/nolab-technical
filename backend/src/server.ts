import app from '@/app';
import { config } from '@/config';

app.listen(config.port, () => {
  console.log(`API listening on http://localhost:${config.port}`);
});
