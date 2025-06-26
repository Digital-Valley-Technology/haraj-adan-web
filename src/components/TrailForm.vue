<template>
  <div
    class="card z-20 bg-[var(--light-clr)] rounded-3xl py-8 md:py-6 px-6 mx-auto max-w-[900px]"
  >
    <div class="flex flex-wrap md:flex-nowrap justify-between gap-1 mb-4">
      <InputText
        name="phone"
        type="text"
        :placeholder="$t('home.trail.phone')"
        fluid
        size="large"
        class="round-start-top mb-2 md:mb-0"
      />
      <InputText
        name="title"
        type="text"
        :placeholder="$t('home.trail.name-title')"
        fluid
        size="large"
        class="mb-2 md:mb-0"
      />
      <InputText
        name="name"
        type="text"
        :placeholder="$t('home.trail.name')"
        fluid
        size="large"
        class="round-end-top mb-2 md:mb-0"
      />
    </div>
    <Button
      class="!bg-[var(--accent-clr)] !border-[var(--accent-clr)] !px-10 !block mx-auto !rounded-2xl"
      type="submit"
      :label="$t('home.trail.send-invitation')"
    />
  </div>
</template>
