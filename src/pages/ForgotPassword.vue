<template>
  <div class="fullscreen flex flex-center bg-gradient">
    <q-card class="q-pa-md">
      <q-card-section>
        <h5 class="text-h5 q-my-md text-weight-bold text-primary">
          Forgot Password
        </h5>
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

          <q-btn
            label="Send Link"
            type="submit"
            color="primary"
            class="full-width q-mt-md"
          />
        </q-form>

        <q-btn
          label="Back To Login"
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
import { resetPasswordUser } from "../services/auth.service.js";

const $q = useQuasar(),
  email = ref("");

const onSubmit = async () => {
  try {
    await resetPasswordUser(email.value);
    $q.notify({
      message: "Password reset link sent to your email.",
      icon: "mark_email_read",
      position: "top",
    });
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
