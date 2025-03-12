<script setup>
import Button from "~/components/ui/button/Button.vue";
import Card from "~/components/ui/card/Card.vue";
import CardHeader from "~/components/ui/card/CardHeader.vue";
import CardTitle from "~/components/ui/card/CardTitle.vue";
import CardDescription from "~/components/ui/card/CardDescription.vue";
import CardContent from "~/components/ui/card/CardContent.vue";
import Input from "~/components/ui/input/Input.vue";
import { ref } from "vue";
import { useToast } from "~/components/ui/toast";
import MyPhoneInput from "~/components/ui/phone-input/SphoneInput.vue";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import countries from "~/assets/constants/countries";
import ErrorMessage from "~/components/ErrorMessage.vue";
import { useValidation } from "~/composables/useValidation";

definePageMeta({
  layout: "custom",
  middleware: "public",
});

useSeoMeta({
  title: "Register",
  description: "Register new user",
});

const email = ref("");
const password = ref("");
const repeatPassword = ref("");
const firstName = ref("");
const lastName = ref("");
const phoneNumber = ref("");
const country = ref("");
const address = ref("");
const { toast } = useToast();
const { errors, validate, isValid } = useValidation();

const onSubmit = async () => {
  const supabase = useSupabaseClient();

  const formData = {
    email: email.value,
    password: password.value,
    repeatPassword: repeatPassword.value,
    firstName: firstName.value,
    lastName: lastName.value,
    phoneNumber: phoneNumber.value,
    country: country.value,
    address: address.value,
  };

  // Validate the form data
  validate(formData);

  if (!isValid.value) {
    toast({
      title: "Please fix the errors before submitting.",
      duration: 3000,
      variant: "destructive",
    });
    return;
  }

  // Sign up the user
  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: {
        first_name: firstName.value,
        last_name: lastName.value,
        country: country.value,
        phone_number: phoneNumber.value,
        address: address.value,
      },
    },
  });

  // If there is an error in signing up the user, show the error message
  if (error) {
    toast({
      title: error.message,
      duration: 3000,
      variant: "destructive",
    });
    return;
  }

  toast({
    title: "Successfully created account!",
    duration: 3000,
    variant: "success",
  });

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
        <div class="flex flex-col gap-4">
          <div class="flex justify-around">
            <div class="grid gap-2 relative">
              <label for="email" class="text-white">First Name</label>
              <Input
                class="text-white"
                v-model="firstName"
                type="text"
                placeholder="John"
                required
              />
              <ErrorMessage :error="errors.firstName" />
            </div>
            <div class="grid gap-2 relative">
              <label for="email" class="text-white">Last Name</label>
              <Input
                class="text-white"
                v-model="lastName"
                type="text"
                placeholder="Doe"
                required
              />
              <ErrorMessage :error="errors.lastName" />
            </div>
          </div>
          <div class="flex justify-around">
            <div class="grid gap-2 relative">
              <label for="email" class="text-white">Email</label>
              <Input
                class="text-white"
                v-model="email"
                type="email"
                placeholder="johnDoe@gmail.com"
                required
              />
              <ErrorMessage :error="errors.email" />
            </div>
            <div class="grid gap-2 relative">
              <label for="address" class="text-white">Address</label>
              <Input
                class="text-white"
                v-model="address"
                type="text"
                placeholder="Wall Street 12"
                required
              />
              <ErrorMessage :error="errors.address" />
            </div>
          </div>
          <div class="w-[415px] mx-auto flex flex-col gap-2">
            <Select v-model:model-value="country" class="flex flex-col">
              <label for="country" class="text-white">Country</label>
              <SelectTrigger>
                <SelectValue
                  class="text-white"
                  placeholder="Select a country"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="country in countries"
                  :key="country.name"
                  :value="country.name"
                >
                  {{ country.name }}
                </SelectItem>
              </SelectContent>
            </Select>
            <ErrorMessage :error="errors.country" />
          </div>

          <div class="flex flex-col pr-6 pl-6 gap-2">
            <div class="flex items-center">
              <label for="phoneNumber" class="text-white">Phone Number</label>
            </div>
            <MyPhoneInput class="text-white" v-model="phoneNumber" />
            <ErrorMessage :error="errors.phoneNumber" />
          </div>
          <div class="flex justify-around">
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
              <ErrorMessage :error="errors.password" />
            </div>

            <div class="grid gap-2 relative">
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
              <ErrorMessage :error="errors.repeatPassword" />
            </div>
          </div>

          <Button
            @click.prevent="onSubmit"
            class="w-full text-white bg-[#0c431e] p-2 mt-5 max-w-[415px] mx-auto rounded-md"
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
