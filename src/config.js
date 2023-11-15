import { config } from "dotenv";

config();

export const PORT = 5000;
export const HOST = "http://localhost: " + PORT;

export const PAY_PAL_C = "Ab7FA1ndpItrTMH4iSnpiAfxssFkLKM5-T88H61XWY37npvF2aBiWB8nHjvK_9Rw1YpuYu9uJdtjFd7c";
export const PAY_PAL_S = "EBj-hesgdF_q9YFDRkZ1xnuO3eLN9WjycLOYoWI7ffpbbfVvf3AbKk_x67KlUncikbXz-i-7IikPcS5v";

export const PAYPAL_API = "https://api.sandbox.paypal.com";
