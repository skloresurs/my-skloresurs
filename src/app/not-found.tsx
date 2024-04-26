import { Button, Container, Group, Text, Title } from "@mantine/core";
import { StatusCodes } from "http-status-codes";
import type { GetServerSideProps } from "next";
import Link from "next/link";

import classes from "@/css/Error.module.css";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.statusCode = StatusCodes.NOT_FOUND;
  return { props: {} };
};

export default async function NotFound() {
  return (
    <Container className={classes.root}>
      <div className={classes.label}>404</div>
      <Title className={classes.title}>Ви знайшли секретне місце.</Title>
      <Text c="dimmed" size="lg" ta="center" className={classes.description}>
        На жаль, це лише сторінка 404. Можливо, ви неправильно ввели або сторінку переміщено на іншу URL-адресу.
      </Text>
      <Group justify="center">
        <Button component={Link} href="/" variant="subtle" size="md">
          На головну
        </Button>
      </Group>
    </Container>
  );
}
