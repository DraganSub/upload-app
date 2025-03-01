<script setup>
import Button from "~/components/ui/button/Button.vue";
import Card from "~/components/ui/card/Card.vue";
import CardHeader from "~/components/ui/card/CardHeader.vue";
import CardTitle from "~/components/ui/card/CardTitle.vue";
import CardDescription from "~/components/ui/card/CardDescription.vue";
import CardContent from "~/components/ui/card/CardContent.vue";
import Input from "~/components/ui/input/Input.vue";
import { ref } from "vue";

definePageMeta({
  layout: "custom",
  middleware: "public",
});
const email = ref("");
const password = ref("");
const repeatPassword = ref("");
const firstName = ref("");
const lastName = ref("");
const isPasswordMatching = ref(true);

const onSubmit = async () => {
  const supabase = useSupabaseClient();

  if (password.value !== repeatPassword.value) {
    // TODO: Add error handling on field
    isPasswordMatching.value = false;
    throw new Error("Passwords do not match");
  }
  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: {
        fullName: firstName + " " + lastName,
      },
    },
  });
  // TODO: optional if time, add email confirmation
  if (error) throw error;

  navigateTo("/");
};
</script>

<template>
  <div class="flex min-h-[100vh] items-center">
    <Card class="mx-auto max-w-lg w-full bg-transparent border-[#0c431e]">
      <CardHeader>
        <CardTitle class="text-2xl text-white"> Register </CardTitle>
        <CardDescription> Fill up your credentials to sign up </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <label for="email" class="text-white">First Name</label>
            <Input
              class="text-white"
              v-model="firstName"
              type="text"
              placeholder="John"
              required
            />
          </div>
          <div class="grid gap-2">
            <label for="email" class="text-white">Last Name</label>
            <Input
              class="text-white"
              v-model="lastName"
              type="text"
              placeholder="Doe"
              required
            />
          </div>
          <div class="grid gap-2">
            <label for="email" class="text-white">Email</label>
            <Input
              class="text-white"
              v-model="email"
              type="email"
              placeholder="johnDoe@gmail.com"
              required
            />
          </div>
          <div class="grid gap-2">
            <div class="flex items-center">
              <label for="password" class="text-white">Password</label>
            </div>
            <Input
              class="text-white"
              v-model="password"
              type="password"
              required
            />
          </div>

          <div class="grid gap-2">
            <div class="flex items-center">
              <label for="repeatPassword" class="text-white"
                >Repeat Password</label
              >
            </div>
            <Input
              class="text-white"
              v-model="repeatPassword"
              type="password"
              required
            />
          </div>
          <Button
            @click.prevent="onSubmit"
            class="w-full text-white bg-[#0c431e] p-2 rounded-md"
          >
            Register
          </Button>
        </div>
        <div class="mt-4 text-center text-sm text-white">
          Already have an account?
          <NuxtLink to="/login" class="underline"> Sign in </NuxtLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
