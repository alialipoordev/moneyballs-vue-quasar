<template>
  <div class="fullscreen flex flex-center bg-gradient">
    <q-card class="q-pa-md">
      <q-card-section>
        <h5 class="text-h5 q-my-md text-weight-bold text-primary">Sign Up</h5>
        <q-form @submit="onSubmit">
          <q-input
            v-model="email"
            label="Email"
            type="email"
            required
            :rules="[
              (val) => !!val || 'Email is required',
              (val) => /.+@.+\..+/.test(val) || 'Invalid email format',
            ]"
          />
          <q-input
            v-model="password"
            label="Password"
            type="password"
            required
            class="q-mt-sm"
            :rules="[
              (val) => !!val || 'Password is required',
              (val) => val.length >= 8 || 'At least 8 characters',
            ]"
          />
          <q-btn
            label="Register"
            type="submit"
            color="primary"
            class="full-width q-mt-md"
          />
        </q-form>
        <q-btn
          label="Login"
          flat
          color="primary"
          class="full-width q-mt-sm"
          to="/login"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { sendEmailVerification } from "firebase/auth";
import { logoutUser, registerUser } from "src/services/auth.service";

const $q = useQuasar(),
  router = useRouter(),
  email = ref(""),
  password = ref("");

const onSubmit = async () => {
  try {
    const userCredential = await registerUser(email.value, password.value);
    await sendEmailVerification(userCredential.user);

    $q.notify({
      message:
        "Please verify your email before accessing the app.A verification link has been sent to your email.",
      position: "top",
      icon: "mark_email_read",
    });

    if (!userCredential.user.emailVerified) await logoutUser();
    router.push("/login");
  } catch (error) {
    const errors = {
      "auth/email-already-in-use": "This email is already in use.",
      "auth/invalid-credential": "Invalid email or password",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/weak-password": "Password is too weak.",
    };

    $q.notify({
      message: errors[error.code] || "An unknown error occurred.",
      position: "top",
    });
  }
};
</script>
