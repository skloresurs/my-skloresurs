import axios from 'axios';
import moment from 'moment-timezone';
import { NextRequest, NextResponse } from 'next/server';

import { env } from '@/env.mjs';
import verifyReCaptcha from '@/libs/recaptcha';
import getSession from '@/libs/server-session';

const TELEGRAM_API_ROUTE = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}`;

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(null, { status: 401 });
    }

    const { message, captcha } = await request.json();

    const verifyCaptcha = verifyReCaptcha(captcha);
    if (!verifyCaptcha) {
      return NextResponse.json(
        {
          error: 'Помилка reCaptcha',
        },
        { status: 429 }
      );
    }

    if (!message) {
      return NextResponse.json(
        {
          error: 'Відсутній один або декілька параметрів',
        },
        { status: 400 }
      );
    }

    const createTopicResponse = await axios
      .post(`${TELEGRAM_API_ROUTE}/createForumTopic`, {
        chat_id: env.TELEGRAM_CHAT_ID,
        name: `[MySkloresurs] ${session.user.fullname} ${moment(new Date())
          .tz('Europe/Kiev')
          .format('DD.MM.YYYY HH:mm')}`,
      })
      .catch(() => null);

    if (!createTopicResponse) {
      return NextResponse.json('Помилка створення', { status: 500 });
    }

    await axios.post(`${TELEGRAM_API_ROUTE}/sendMessage`, {
      chat_id: env.TELEGRAM_CHAT_ID,
      message_thread_id: createTopicResponse.data.result.message_thread_id,
      text: `🆔:${session.user.id}\n👤:${session.user.fullname}\n📧:${
        session.user.email
      }\n🗓:${moment(new Date())
        .tz('Europe/Kiev')
        .format('DD.MM.YYYY HH:mm')}\n\n${message}`,
    });

    return NextResponse.json(null, { status: 200 });
  } catch {
    return NextResponse.json('Помилка сервера', { status: 500 });
  }
}
