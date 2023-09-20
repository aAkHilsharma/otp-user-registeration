document.addEventListener("DOMContentLoaded", function () {
  const heading = document.getElementById("heading");
  const step1Button = document.getElementById("step-1-button");
  const step2Button = document.getElementById("step-2-button");
  const step3Button = document.getElementById("step-3-button");
  const messageColumn = document.getElementById("message-column"); // Add this line

  const step1Input = document.getElementById("phone");
  const step2Input = document.getElementById("otp");
  const step3EmailInput = document.getElementById("email");
  const step3UsernameInput = document.getElementById("username");
  const step3PasswordInput = document.getElementById("password");

  let phoneNumber = "";

  step1Button.addEventListener("click", async function () {
    phoneNumber = step1Input.value;

    if (phoneNumber.trim() === "") {
      messageColumn.textContent =
        "Please enter a phone number with country code attached in front.";
      return;
    }

    const userData = {
      phone: phoneNumber,
    };

    try {
      const response = await fetch("/register/step-1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (data.success) {
        document.getElementById("step-1").style.display = "none";
        document.getElementById("step-2").style.display = "block";
        messageColumn.textContent = `An OTP has been sent to your mobile number ${phoneNumber}`;
      } else {
        messageColumn.textContent = "Failed to send OTP. Please try again.";
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  });

  step2Button.addEventListener("click", async function () {
    const enteredOTP = step2Input.value;

    if (enteredOTP.trim() === "") {
      messageColumn.textContent = "Please enter the OTP.";
      return;
    }

    const userData = {
      phone: phoneNumber,
      otp: enteredOTP,
    };

    try {
      const response = await fetch("/register/step-2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (data.success) {
        document.getElementById("step-2").style.display = "none";
        document.getElementById("step-3").style.display = "block";
        messageColumn.textContent =
          "Please fill the below fields to register the user";
      } else {
        messageColumn.textContent = data.message;
      }
    } catch (error) {
      console.error("Invalid otp please try again");
    }
  });

  step3Button.addEventListener("click", async function () {
    const email = step3EmailInput.value;
    const username = step3UsernameInput.value;
    const password = step3PasswordInput.value;

    if (
      email.trim() === "" ||
      username.trim() === "" ||
      password.trim() === ""
    ) {
      messageColumn.textContent = "Please fill out all the fields.";
      return;
    }

    const userData = {
      phone: phoneNumber,
      email,
      username,
      password,
    };

    try {
      const response = await fetch("/register/step-3", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (data.success) {
        messageColumn.textContent = "";
        document.getElementById("step-3").style.display = "none";
        heading.textContent = "User registered successfully";

        const payloadMessage = document.createElement("p");
        payloadMessage.textContent = `Username: ${data.payload.username}`;
        messageColumn.appendChild(payloadMessage);

        const emailMessage = document.createElement("p");
        emailMessage.textContent = `Email: ${data.payload.email}`;
        messageColumn.appendChild(emailMessage);

        const phoneMessage = document.createElement("p");
        phoneMessage.textContent = `Phone: ${data.payload.phone}`;
        messageColumn.appendChild(phoneMessage);
      } else {
        messageColumn.textContent = "Some error occured! Please try again.";
      }
    } catch (error) {
      console.error("Error while trying to register the user");
    }
  });
});
