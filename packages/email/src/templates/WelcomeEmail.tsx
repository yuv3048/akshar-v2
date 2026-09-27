import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "react-email";

import { barebonesBoxedTailwindConfig } from "../theme";
import { BarebonesFonts } from "../theme-fonts";

type WelcomeEmailProps = {
  appUrl: string;
  logoUrl: string;
};

export const WelcomeEmail = ({
  appUrl,
  logoUrl,
}: WelcomeEmailProps) => (
  <Tailwind config={barebonesBoxedTailwindConfig}>
    <Html>
      <Head>
        <BarebonesFonts />
      </Head>

      <Body className="bg-bg-2 m-0 text-center font-sans">
        <Preview>
          Welcome to Akshar — your account is ready.
        </Preview>

        <Container className="mobile:mt-0 mx-auto mt-8 w-full max-w-[640px]">
          <Section>
            {/* Main email container */}
            <Section className="bg-bg mobile:px-2 px-6 py-4">
              {/* Header */}
              <Section className="mb-3 px-6">
                <Row>
                  <Column className="w-1/2 py-[7px] align-middle">
                    <Img
                      src={logoUrl}
                      alt="Akshar"
                      width={23}
                      height={23}
                      className="block rounded-[5px]"
                    />
                  </Column>

                  <Column
                    align="right"
                    className="w-1/2 py-[7px] align-middle"
                  >
                    <Text className="font-13 m-0 text-right font-sans">
                      <span className="text-fg-3">Akshar</span>
                    </Text>
                  </Column>
                </Row>
              </Section>

              {/* Main content */}
              <Section className="bg-bg-2 mobile:px-6 mobile:py-12 rounded-[8px] px-[40px] py-[64px] text-center">
                <Section className="mb-3">
                  <Img
                    src={logoUrl}
                    alt="Akshar"
                    width={48}
                    height={48}
                    className="mx-auto mb-5 block rounded-[10px]"
                  />

                  <Heading
                    as="h1"
                    className="font-28 text-fg m-0 font-sans"
                  >
                    Welcome to Akshar
                  </Heading>
                </Section>

                <Text className="font-16 text-fg-2 mx-auto mt-0 mb-8 max-w-[380px] text-center font-sans">
                  Your email has been verified and your Akshar account is now
                  ready. Welcome aboard.
                </Text>

                <Text className="font-16 text-fg-2 mx-auto mt-0 mb-8 max-w-[380px] text-center font-sans">
                  Akshar is a place to share ideas, discover perspectives, and
                  turn your thoughts into something worth remembering. We&apos;re
                  glad to have you here.
                </Text>

                {/* CTA */}
                <Section className="mb-6 text-center">
                  <Button
                    href={appUrl}
                    className="bg-fg font-16 text-fg-inverted inline-block rounded-lg px-7 py-4 text-center font-sans leading-6 no-underline"
                  >
                    Explore Akshar
                  </Button>
                </Section>

                <Text className="font-13 text-fg-3 mx-auto mt-8 mb-0 max-w-[400px] text-center font-sans">
                  Start reading, discover new perspectives, and share your own
                  ideas with the Akshar community.
                </Text>
              </Section>

              {/* Welcome note */}
              <Section className="bg-bg">
                <Row>
                  <Column className="px-6 py-10 text-center">
                    <Text className="font-14 text-fg-2 mx-auto mt-0 mb-0 max-w-[420px] text-center font-sans">
                      Your account was created successfully after verifying
                      your email address. You can now sign in and start using
                      Akshar.
                    </Text>
                  </Column>
                </Row>
              </Section>

              {/* Footer */}
              <Section className="bg-bg">
                <Row>
                  <Column className="px-6 py-10 text-center">
                    <Text className="font-13 text-fg-3 mx-auto mt-0 mb-8 max-w-[320px] text-center font-sans">
                      Akshar is a place to share ideas, discover perspectives,
                      and find words worth remembering.
                    </Text>

                    {/* Social links */}
                    <Section className="mb-8">
                      <Link
                        href="https://x.com/yuvvraj_devl"
                        className="font-13 text-fg-3 inline-block px-2 align-middle no-underline"
                      >
                        X
                      </Link>

                      <Link
                        href="https://www.linkedin.com/in/yuvraj-sharma-13a87a25b/"
                        className="font-13 text-fg-3 inline-block px-2 align-middle no-underline"
                      >
                        LinkedIn
                      </Link>

                      <Link
                        href="https://github.com/yuv3048/akshar-v2"
                        className="font-13 text-fg-3 inline-block px-2 align-middle no-underline"
                      >
                        GitHub
                      </Link>
                    </Section>

                    <Text className="font-11 text-fg-3 m-0 text-center font-sans">
                      This is an automated email from Akshar. Please do not
                      reply to this email.
                    </Text>
                  </Column>
                </Row>
              </Section>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  </Tailwind>
);


export default WelcomeEmail;