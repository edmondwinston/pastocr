<script setup lang="ts">
onMounted(() => {
  const preview = document.querySelector("#replace-with-preview");
  document.addEventListener("paste", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const items = event.clipboardData?.items;
    console.log(items?.length);
    if (items) {
      for (const item of items) {
        if (item.type.indexOf("image") !== -1) {
          const blob = item.getAsFile();
          console.log("b", blob);
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            console.log("img", img);
            preview?.replaceWith(img);
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
      </div>
    </section>
  </main>
</template>
