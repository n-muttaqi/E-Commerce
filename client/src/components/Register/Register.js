import React, { useState } from "react";
import axios from "axios";
import { getBaseURL } from "../apiConfig";
import "./Register.scss";

function Register(props) {
  const [email, setEmail] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [pass, setPass] = useState("");
  const [isAdmin, setAdmin] = useState("0");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  // Validation helpers
  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const validatePassword = (v) => (v || "").length >= 6;

  const validateInputs = () => {
    if (!validateEmail(email)) {
      setError("Please provide a valid email address.");
      return false;
    }
    if (!fname.trim()) {
      setError("Please provide your first name.");
      return false;
    }
    if (!lname.trim()) {
      setError("Please provide your last name.");
      return false;
    }
    if (!validatePassword(pass)) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    setError("");
    return true;
  };

  // Submit handler
  const handleUserRegistration = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const url = getBaseURL() + "api/users/register";
      const newUser = {
        email,
        password: pass,
        isAdmin,
        fname,
        lname,
      };

      const res = await axios.post(url, newUser);
      if (res.data != null) {
        props.navigateToLoginPage();
      } else {
        setError("Unexpected issue. Try again.");
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const h = React.createElement;

  // Icons
  const MailIcon = h(
    "svg",
    { width: 18, height: 18, viewBox: "0 0 24 24", "aria-hidden": "true" },
    h("path", { d: "M12 13L2 6.76V18h20V6.76L12 13zm0-2L2 4h20L12 11z" })
  );
  const UserIcon = h(
    "svg",
    { width: 18, height: 18, viewBox: "0 0 24 24", "aria-hidden": "true" },
    h("path", { d: "M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-5 0-9 3-9 6v2h18v-2c0-3-4-6-9-6z" })
  );
  const LockIcon = h(
    "svg",
    { width: 18, height: 18, viewBox: "0 0 24 24", "aria-hidden": "true" },
    h("path", { d: "M17 8V7a5 5 0 10-10 0v1H5v12h14V8h-2zm-8 0V7a3 3 0 016 0v1H9z" })
  );
  const AlertIcon = h(
    "svg",
    { width: 18, height: 18, viewBox: "0 0 24 24", "aria-hidden": "true" },
    h("path", { d: "M12 2L1 21h22L12 2zm1 15h-2v2h2v-2zm0-8h-2v6h2V9z" })
  );

  const disabled = loading || !email || !fname || !lname || !pass;

  return h(
    "div",
    { className: "register-page" },

    // Brand (same as login)
    h(
      "div",
      { className: "brand" },
      h("div", { className: "logo-dot" }),
      h("span", null, "E-Commerce App")
    ),

    // Card container
    h(
      "div",
      { className: "auth-card" },
      h("h1", { className: "title" }, "Create Account"),
      h("p", { className: "subtitle" }, "Sign up to get started"),

      error &&
        h(
          "div",
          { className: "error-banner", role: "alert" },
          AlertIcon,
          h("span", null, error)
        ),

      // Registration form
      h(
        "form",
        { className: "form", noValidate: true, onSubmit: handleUserRegistration },

        // Email
        h(
          "div",
          { className: "field" },
          h("label", { htmlFor: "email" }, "Email"),
          h(
            "div",
            { className: "input-wrap" },
            h("span", { className: "icon", "aria-hidden": "true" }, MailIcon),
            h("input", {
              id: "email",
              type: "email",
              placeholder: "you@example.com",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              autoComplete: "email",
            })
          )
        ),

        // First name
        h(
          "div",
          { className: "field" },
          h("label", { htmlFor: "fname" }, "First Name"),
          h(
            "div",
            { className: "input-wrap" },
            h("span", { className: "icon", "aria-hidden": "true" }, UserIcon),
            h("input", {
              id: "fname",
              type: "text",
              placeholder: "John",
              value: fname,
              onChange: (e) => setFname(e.target.value),
              autoComplete: "given-name",
            })
          )
        ),

        // Last name
        h(
          "div",
          { className: "field" },
          h("label", { htmlFor: "lname" }, "Last Name"),
          h(
            "div",
            { className: "input-wrap" },
            h("span", { className: "icon", "aria-hidden": "true" }, UserIcon),
            h("input", {
              id: "lname",
              type: "text",
              placeholder: "Doe",
              value: lname,
              onChange: (e) => setLname(e.target.value),
              autoComplete: "family-name",
            })
          )
        ),

        // Password
        h(
          "div",
          { className: "field" },
          h("label", { htmlFor: "password" }, "Password"),
          h(
            "div",
            { className: "input-wrap" },
            h("span", { className: "icon", "aria-hidden": "true" }, LockIcon),
            h("input", {
              id: "password",
              type: showPwd ? "text" : "password",
              placeholder: "••••••••",
              value: pass,
              onChange: (e) => setPass(e.target.value),
              autoComplete: "new-password",
            }),
            h(
              "button",
              {
                type: "button",
                className: "ghost-btn",
                onClick: () => setShowPwd((s) => !s),
                "aria-label": showPwd ? "Hide password" : "Show password",
              },
              showPwd ? "🙈" : "👁️"
            )
          ),
          h("div", { className: "row between" },
            h("span", { className: "hint" }, "At least 6 characters")
          )
        ),

        // Role selector
        h(
          "div",
          { className: "segmented" },
          h(
            "label",
            { className: isAdmin === "0" ? "seg active" : "seg" },
            h("input", {
              type: "radio",
              name: "role",
              value: "0",
              checked: isAdmin === "0",
              onChange: () => setAdmin("0"),
            }),
            h("span", null, "Customer")
          ),
          h(
            "label",
            { className: isAdmin === "1" ? "seg active" : "seg" },
            h("input", {
              type: "radio",
              name: "role",
              value: "1",
              checked: isAdmin === "1",
              onChange: () => setAdmin("1"),
            }),
            h("span", null, "Admin")
          )
        ),

        // Register button
        h(
          "button",
          {
            type: "submit",
            className: "primary-btn",
            disabled,
          },
          loading ? h("span", { className: "spinner" }) : "Create Account"
        ),

        // Divider + back button
        h("div", { className: "divider" }, h("span", null, "or")),
        h(
          "button",
          {
            type: "button",
            className: "secondary-btn",
            onClick: () => props.navigateToLoginPage(),
          },
          "Back to Sign In"
        )
      )
    ),

    // Footer
    h(
      "footer",
      { className: "footer" },
      "© ",
      new Date().getFullYear(),
      " E-Commerce App"
    )
  );
}

export default Register;
