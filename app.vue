<script setup lang="ts">
onMounted(() => {
  // document.addEventListener('keydown', (event) => {
  //   if (event.ctrlKey && event.key === 'v') {
  //     console.log('Ctrl + V');
  //   }
  // });
  const preview = document.querySelector("#preview");
  document.addEventListener('paste', (event) => {
    event.preventDefault();
    event.stopPropagation();

    const items = event.clipboardData?.items;
    console.log(items?.length);
    if (items) {
      for (const item of items) {
        if (item.type.indexOf('image') !== -1) {
          const blob = item.getAsFile();
          console.log('b', blob);
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            console.log('img', img);
            preview?.appendChild(img);
          };
          reader.readAsDataURL(blob!);
        }
      }
    }
  })
});
;
</script>

<template>
  <main class="">
    <section class="h-screen">
      <div class="h-3/4 m-4 border border-gray-600 rounded-3xl text-center">
        <h1 class="text-lg font-bold text-white">Press Ctrl + V to download</h1>
        <div id="preview" />
      </div>
    </section>
  </main>
</template>
