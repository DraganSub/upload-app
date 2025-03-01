<script>
import Button from "~/components/ui/button/Button.vue";
import Card from "~/components/ui/card/Card.vue";
import CardHeader from "~/components/ui/card/CardHeader.vue";
import CardTitle from "~/components/ui/card/CardTitle.vue";
import CardDescription from "~/components/ui/card/CardDescription.vue";
import CardContent from "~/components/ui/card/CardContent.vue";
import Input from "~/components/ui/input/Input.vue";

definePageMeta({
  layout: "custom",
});

useSeoMeta({
  title: "Login",
});
</script>

<template>
  <div class="flex min-h-[100vh] items-center">
    <Card class="mx-auto max-w-lg w-full bg-transparent border-[#0c431e]">
      <CardHeader>
        <CardTitle class="text-2xl text-white"> Login </CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <label for="email" class="text-white">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div class="grid gap-2">
            <div class="flex items-center">
              <label for="password" class="text-white">Password</label>
            </div>
            <Input id="password" type="password" required />
          </div>
          <Button
            type="submit"
            class="w-full text-white bg-[#0c431e] p-2 rounded-md"
          >
            Login
          </Button>
        </div>
        <div class="mt-4 text-center text-sm text-white">
          Don't have an account?
          <NuxtLink to="/register" class="underline"> Sign up </NuxtLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
