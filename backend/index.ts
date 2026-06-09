import app from "./src/app.js";
import { PORT } from "./src/configs/constant.js";
import { connectToMongoDB } from "./src/database/mongodb.js";

async function bootstrap() {
  await connectToMongoDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

bootstrap();
