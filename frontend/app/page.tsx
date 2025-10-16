import RegistrationForm from "./components/RegistrationForm";
import "./style.css";

export const metadata = {
  title: "Registration Form",
};

export default function Page() {
  return (
    <div className="registration-page">
      <div className="registration-container">
        <div className="registration-header">
          <h1 className="registration-title">Create Account</h1>
          <p className="registration-subtitle">Join us today and get started</p>
        </div>

        <div className="registration-card">
          <RegistrationForm />
        </div>

        <p className="registration-footer">
          Already have an account? <a href="#">Sign in</a>
        </p>
      </div>
    </div>
  );
}
