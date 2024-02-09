import { enableInactivityRedirection } from "@/global/js/inactivity.ts";

enableInactivityRedirection().beforeRedirect(() =>
  console.log("log before redirect to home")
);
