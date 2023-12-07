import axios from 'axios';
import moment from 'moment-timezone';
import { NextRequest, NextResponse } from 'next/server';

import ServerError from '@/app/error';
import { MissingParamsError } from '@/classes/CustomError';
import { env } from '@/env.mjs';
import apiErrorHandler from '@/libs/api-error-handler';
import verifyReCaptcha from '@/libs/recaptcha';
import { getSession } from '@/libs/sessions';
import verifyIp from '@/libs/verify-ip';

const TELEGRAM_API_ROUTE = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}`;

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    await verifyIp(session.user.ip);

    const { message, captcha } = await request.json();

    await verifyReCaptcha(captcha);

    if (!message) {
      throw MissingParamsError;
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
      return ServerError;
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
  } catch (error) {
    return apiErrorHandler(error);
  }
}
