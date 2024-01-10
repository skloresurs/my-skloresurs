import { sessionSchema } from '@/libs/db/schema';

type ISession = typeof sessionSchema.$inferSelect;
export default ISession;
