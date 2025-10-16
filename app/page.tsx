import RegistrationForm from "./components/RegistrationForm";

export const metadata = {
  title: "Registration Form",
};

export default function Page() {
  return (
    <div className="p-16">
      <RegistrationForm />
    </div>
  );
}
