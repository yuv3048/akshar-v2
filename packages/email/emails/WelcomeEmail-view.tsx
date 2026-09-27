import  WelcomeEmail  from "../src/templates/WelcomeEmail";

export default function Preview() {
  return (
    <WelcomeEmail
      appUrl="https://akshar.example.com/verify-email"
      logoUrl="https://res.cloudinary.com/icf0ttng/image/upload/v1790495747/akshar.png"
    />
  );
}

