import { betterAuth, logger } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, createAuthMiddleware } from "better-auth/plugins";
import { db } from "./db"; // your drizzle instance
import * as schema from "./db/schema";
import { eq, sql } from "drizzle-orm";

export const auth = betterAuth({
  trustedOrigins: ["*"],
  appName: "metup",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  plugins: [
    admin(),
    schema.organization({
      organizationHooks: {},
    }),
  ],
  session: {},
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, url, token, newEmail }) => {
        logger.info("Email  ", user.email);
        logger.info("Verification Token: ", token);
        // try {
        // } catch (error) {
        //   logger.error("Failed to send verification email:", error);
        //   if (process.env.NODE_ENV !== "production") {
        //     logger.info("Email  ", user.email);
        //     logger.info("Verification Token: ", token);
        //   }
        // }
      },
    },

    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url, token }) => {
        logger.info("Email  ", user.email);
        logger.info("Verification Token: ", token);
        // try {
        // } catch (error) {
        //   logger.error("Failed to send verification email:", error);
        //   if (process.env.NODE_ENV !== "production") {
        //     logger.info("Email  ", user.email);
        //     logger.info("Verification Token: ", token);
        //   }
        // }
      },
    },

    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      //autoSignIn:true
      resetPasswordTokenExpiresIn: 3600,
    },
    socialProviders: {
      // github: {
      //   clientId: process.env.GITHUB_CLIENT_ID as string,
      //   clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      // },
      // google:{}
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: 3600,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }) => {
      logger.info("Email  ", user.email);
      logger.info("Verify Token: ", token);
      logger.info("Verify Token: ", url);
      // try {
      // } catch (error) {
      //   logger.error(" Failed to send verification email:", error);
      //   if (process.env.NODE_ENV !== "production") {
      //     logger.info("Email  ", user.email);
      //     logger.info("Reset Token: ", token);
      //     logger.info("Reset Token: ", url);
      //   }
      // }
    },
  },

  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      // const user = ctx.context.newSession?.user ?? {
      //   name: ctx.body.name,
      //   email: ctx.body.email,
      // };
      // logger.error("========> ");
      // logger.error("1: ", JSON.stringify(ctx.context.newSession));
      // logger.error("2: ", JSON.stringify(ctx.context.session));
      // logger.error("3: ", JSON.stringify(ctx.body.email));
      // logger.error("4: ", JSON.stringify(ctx.path));
      logger.error("========> ");
      if (ctx.path.startsWith("/sign-up/email")) {
        // if (user != null) {
        //TODO: sendWelcomeEmail();
        return;
        // }
      } else if (ctx.path === "/reset-password") {
        return;
      } else if (ctx.path === "/sign-in/email") {
        // let uid = await db
        //   .select({ id: schema.user.id })
        //   .from(schema.user)
        //   .where(eq(schema.user.email, ctx.body.email))
        //   .limit(1);
        // if (uid[0]) {
        //   await db
        //     .update(schema.userAnalytics)
        //     .set({ lastActiveAt: sql`CURRENT_TIMESTAMP` })
        //     .where(eq(schema.userAnalytics.userId, uid[0].id));
        // }
        return;
      }
      return;
    }),
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith("/sign-in/email")) {
        const user = ctx.context.session?.user ?? {
          email: ctx.body.email,
        };
        return;
        //check if user is banned
      }
      return;
    }),
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user, ctx) => {
          if (!ctx || !ctx.context || !ctx.context.adapter) {
            return;
          }
          // if (process.env.NODE_ENV !== "test") {
          // const sdb = await getDb();
          // const count = await sdb.query<[[{ count: number }]]>(
          //   "SELECT count() AS count FROM type::table(user);"
          // );

          const count = await ctx.context.adapter.count({
            model: "user",
          });
          if (count <= 1) {
            // * first user is automatically granted admin privileges
            await db
              .update(schema.user)
              .set({ role: "admin" })
              .where(eq(schema.user.id, user.id));
          }
          return;
        },
      },
    },
  },
});
