<script setup lang="ts">
const shouldShowOCRButton = ref(false);

interface RequestData {
  imageBase64: string;
  languageIndex: string;
}
function postOcr(data: RequestData) {
  return $fetch('https://app.easyscreenocr.com/api/ocr/GetBaiduOcrTextNew', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

let imgBase64;
onMounted(() => {
  const preview = document.querySelector("#replace-with-preview");
  document.addEventListener("paste", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const items = event.clipboardData?.items;
    if (items) {
      for (const item of items) {
        console.log(item.type);
        if (item.type.indexOf("image") !== -1) {
          const blob = item.getAsFile();
          const reader = new FileReader();
          reader.onload = async (event) => {
            const img = new Image();
            imgBase64 = event.target?.result as string;

            img.src = imgBase64;
            preview?.replaceWith(img);
            shouldShowOCRButton.value = true;
          };
          reader.readAsDataURL(blob!);
        }
      }
    }
  });
});
</script>

<template>
  <main class="">
    <section class="h-screen">
      <div class="h-3/4 m-4 grid place-items-center border border-gray-600 rounded-3xl">
        <h1 id="replace-with-preview" class="text-lg font-bold text-white">
          Paste to begin
        </h1>


        <UButton v-if="shouldShowOCRButton" icon="i-heroicons-document-text" size="sm" color="primary" variant="soft"
          :trailing="false">
          OCR this
        </UButton>
      </div>
    </section>
  </main>
</template>
