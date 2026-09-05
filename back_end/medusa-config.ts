import { defineConfig, Modules } from "@medusajs/framework/utils";

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:3000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:9000",
      authCors: process.env.AUTH_CORS || "http://localhost:9000",
      jwtSecret: process.env.JWT_SECRET || "supersecret_dev_only_change_in_prod",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret_dev_only_change_in_prod",
    },
  },
  modules: [
    {
      resolve: "@medusajs/medusa/cache-redis",
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
    {
      resolve: "@medusajs/medusa/workflow-engine-redis",
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
    {
      resolve: "@medusajs/medusa/file",
      options: {
        provider: "cloudinary",
        options: {
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
          upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET || "ml_default",
        },
      },
    },
    {
      resolve: "@medusajs/medusa/notification",
      options: {
        provider: "sendgrid",
        options: {
          api_key: process.env.SENDGRID_API_KEY,
          from: process.env.SENDGRID_FROM_EMAIL,
        },
      },
    },
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/payment-stripe",
            id: "stripe",
            options: {
              api_key: process.env.STRIPE_API_KEY,
              webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
              capture: true,
              automatic_payment_methods: true,
            },
          },
        ],
      },
    },
    {
      resolve: "./src/modules/try-on",
    },
    {
      resolve: "./src/modules/measurements",
    },
  ],
  plugins: [],
});