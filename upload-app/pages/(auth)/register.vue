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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import countries from "~/assets/constants/countries";

definePageMeta({
  layout: "custom",
  middleware: "public",
});

useSeoMeta({
  name: "Register",
  description: "Register new user",
});
const email = ref("");
const password = ref("");
const repeatPassword = ref("");
const firstName = ref("");
const lastName = ref("");
const phoneNumber = ref("");
const isPasswordMatching = ref(true);
const country = ref("");
const address = ref("");
const { toast } = useToast();

const onSubmit = async () => {
  const supabase = useSupabaseClient();
  console.log(
    "phone",
    phoneNumber.value,
    "country",
    country.value,
    "address",
    address.value
  );
  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: {
        full_name: firstName.value + " " + lastName.value,
      },
    },
  });

  if (error) throw error;

  const { data: dbData, error: dbError } = await supabase.from("users").insert({
    id: data.user.id,
    email: email.value,
    full_name: firstName.value + " " + lastName.value,
    country: country.value,
    phone_number: phoneNumber.value,
    address: address.value,
  });

  if (dbError) throw error(dbError);
  toast({
    title: "Successfully created account!",
    duration: 3000,
    variant: "success",
  });

  navigateTo("/");
};

const checkIsPasswordMatching = () => {
  if (password.value !== repeatPassword.value) {
    isPasswordMatching.value = false;
  } else {
    isPasswordMatching.value = true;
  }
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
          </div>
          <div class="flex justify-around">
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
              <label for="address" class="text-white">Address</label>
              <Input
                class="text-white"
                v-model="address"
                type="text"
                placeholder="Wall Street 12"
                required
              />
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
          </div>

          <div class="flex flex-col pr-6 pl-6 gap-2">
            <div class="flex items-center">
              <label for="phoneNumber" class="text-white">Phone Number</label>
            </div>
            <MyPhoneInput class="text-white" v-model="phoneNumber" />
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
                @input="checkIsPasswordMatching"
              />
              <p
                v-if="!isPasswordMatching"
                class="text-red-500 absolute -bottom-7 -left-5 w-[230px]"
              >
                Please enter the same password
              </p>
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
