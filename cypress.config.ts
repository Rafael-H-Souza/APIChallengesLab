

import { defineConfig } from "cypress";
import fs from "fs";
import FormData from "form-data";
const fetch = require("node-fetch"); // v2

export default defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:3000",
    supportFile: false,
    setupNodeEvents(on) {
      on("task", {
        async uploadTxt({ url, filePath }) {
          const form = new FormData();
          form.append("file", fs.createReadStream(filePath));
          const resp = await fetch(url, { method: "POST", body: form });
          return { status: resp.status, body: await resp.text() };
        }
      });
    },
  },
});


