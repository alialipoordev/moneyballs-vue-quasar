<template>
  <div class="fullscreen flex flex-center bg-gradient">
    <q-card class="q-pa-md">
      <q-card-section>
        <h5 class="text-h5 q-my-md text-weight-bold text-primary">Sign In</h5>
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
            label="Login"
            type="submit"
            color="primary"
            class="full-width q-mt-md"
          />
        </q-form>

        <q-btn
          label="Register"
          flat
          color="primary"
          class="full-width q-mt-sm"
          to="/register"
        />
        <q-btn
          label="Forgot Password"
          flat
          color="primary"
          class="full-width q-mt-sm"
          to="/forgot-password"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { loginUser, logoutUser } from "src/services/auth.service";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

const $q = useQuasar(),
  router = useRouter(),
  email = ref(""),
  password = ref("");

const onSubmit = async () => {
  try {
    const userCredential = await loginUser(email.value, password.value);
    if (!userCredential.user.emailVerified) {
      $q.notify({
        message: "Please verify your email before logging in.",
        position: "top",
      });

      await logoutUser();
      return;
    }

    $q.notify({
      message: "Login Success",
      position: "top",
    });

    router.push("/");
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
