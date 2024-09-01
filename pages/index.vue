<script lang="ts" setup>
// Columns
// const columns = [{
//   key: 'id',
//   label: '#',
//   sortable: true
// }, {
//   key: 'title',
//   label: 'Title',
//   sortable: true
// }, {
//   key: 'completed',
//   label: 'Status',
//   sortable: true
// }, {
//   key: 'actions',
//   label: 'Actions',
//   sortable: false
// }]
const columns = [{
  key: 'id',
  label: '#',
  sortable: true
}, {
  key: 'name',
  label: 'Name',
  sortable: true
}, {
  key: 'phone',
  label: 'Phone',
  sortable: true
}, {
  key: 'industry',
  label: 'Industry',
  sortable: true
}, {
  key: 'source',
  label: 'Source',
  sortable: true
}, {
  key: 'location',
  label: 'Location',
  sortable: true
}, {
  key: 'time',
  label: 'Time',
  sortable: true
}, {
  key: 'situation',
  label: 'Situation',
  sortable: true
}, {
  key: 'employee',
  label: 'Employee',
  sortable: true
}, {
  key: 'type',
  label: 'Type',
  sortable: true
}]

const selectedColumns = ref(columns)
const columnsTable = computed(() => columns.filter((column) => selectedColumns.value.includes(column)))

// Selected Rows
const selectedRows = ref([])

function select(row) {
  const index = selectedRows.value.findIndex((item) => item.id === row.id)
  if (index === -1) {
    selectedRows.value.push(row)
  } else {
    selectedRows.value.splice(index, 1)
  }
}

// Actions
const actions = [
  [{
    key: 'completed',
    label: 'Completed',
    icon: 'i-heroicons-check'
  }], [{
    key: 'uncompleted',
    label: 'In Progress',
    icon: 'i-heroicons-arrow-path'
  }]
]

// Filters
const todoStatus = [{
  key: 'uncompleted',
  label: 'In Progress',
  value: false
}, {
  key: 'completed',
  label: 'Completed',
  value: true
}]

const search = ref('')
const selectedStatus = ref([])
const searchStatus = computed(() => {
  if (selectedStatus.value?.length === 0) {
    return ''
  }

  if (selectedStatus?.value?.length > 1) {
    return `?completed=${selectedStatus.value[0].value}&completed=${selectedStatus.value[1].value}`
  }

  return `?completed=${selectedStatus.value[0].value}`
})

const resetFilters = () => {
  search.value = ''
  selectedStatus.value = []
}

// Pagination
const sort = ref({ column: 'id', direction: 'asc' as const })
const page = ref(1)
const pageCount = ref(10)
const pageTotal = ref(200) // This value should be dynamic coming from the API
const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1)
const pageTo = computed(() => Math.min(page.value * pageCount.value, pageTotal.value))

// Data
const { data: todos, pending } = await useLazyAsyncData<MeetupRecord[]>('records', () => ($fetch as any)("/api/crm", {
  query: {
    q: search.value,
    '_page': page.value,
    '_limit': pageCount.value,
    '_sort': sort.value.column,
    '_order': sort.value.direction
  }
}), {
  default: () => [],
  watch: [page, search, searchStatus, pageCount, sort]
})
</script>

<template>
  <UCard class="w-full" :ui="{
    base: '',
    ring: '',
    background: 'bg-white dark:bg-black',
    divide: 'divide-y divide-gray-200 dark:divide-gray-700',
    header: { padding: 'px-4 py-5' },
    body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' },
    footer: { padding: 'p-4' }
  }">
    <template #header>
      <h2 class="font-semibold text-xl text-gray-900 dark:text-white leading-tight">
        CRM
      </h2>
    </template>

    <template #empty-state>
      <div class="flex flex-col items-center justify-center py-6 gap-3">
        <span class="italic text-sm">No one here!</span>
        <UButton label="Add people" />
      </div>
    </template>

    <!-- Filters -->
    <div class="flex items-center justify-between gap-3 px-4 py-3">
      <UInput v-model="search" icon="i-heroicons-magnifying-glass-20-solid" placeholder="Search..." />

      <USelectMenu v-model="selectedStatus" :options="todoStatus" multiple placeholder="Status" class="w-40" />
    </div>

    <!-- Header and Action buttons -->
    <div class="flex justify-between items-center w-full px-4 py-3">
      <div class="flex items-center gap-1.5">
        <span class="text-sm leading-5">Rows per page:</span>

        <USelect v-model="pageCount" :options="[3, 5, 10, 20, 30, 40]" class="me-2 w-20" size="xs" />
      </div>

      <div class="flex gap-1.5 items-center">
        <UDropdown v-if="selectedRows.length > 1" :items="actions" :ui="{ width: 'w-36' }">
          <UButton icon="i-heroicons-chevron-down" trailing color="gray" size="xs">
            Mark as
          </UButton>
        </UDropdown>

        <USelectMenu v-model="selectedColumns" :options="columns" multiple>
          <UButton icon="i-heroicons-view-columns" color="gray" size="xs">
            Columns
          </UButton>
        </USelectMenu>

        <UButton icon="i-heroicons-funnel" color="gray" size="xs"
          :disabled="search === '' && selectedStatus.length === 0" @click="resetFilters">
          Reset
        </UButton>
      </div>
    </div>

    <!-- Table -->
    <UTable v-model="selectedRows" v-model:sort="sort" :rows="todos" :columns="columnsTable" :loading="pending"
      :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
      :progress="{ color: 'primary', animation: 'carousel' }" sort-asc-icon="i-heroicons-arrow-up"
      sort-desc-icon="i-heroicons-arrow-down" sort-mode="manual" class="w-full"
      :ui="{ td: { base: 'max-w-[0] truncate' }, default: { checkbox: { color: 'gray' } } }" @select="select">
      <template #completed-data="{ row }">
        <UBadge size="xs" :label="row.completed ? 'Completed' : 'In Progress'"
          :color="row.completed ? 'emerald' : 'orange'" variant="subtle" />
      </template>

      <template #actions-data="{ row }">
        <UButton v-if="!row.completed" icon="i-heroicons-check" size="2xs" color="emerald" variant="outline"
          :ui="{ rounded: 'rounded-full' }" square />

        <UButton v-else icon="i-heroicons-arrow-path" size="2xs" color="orange" variant="outline"
          :ui="{ rounded: 'rounded-full' }" square />
      </template>
    </UTable>

    <!-- Number of rows & Pagination -->
    <template #footer>
      <div class="flex flex-wrap justify-between items-center">
        <div>
          <span class="text-sm leading-5">
            Showing
            <span class="font-medium">{{ pageFrom }}</span>
            to
            <span class="font-medium">{{ pageTo }}</span>
            of
            <span class="font-medium">{{ pageTotal }}</span>
            results
          </span>
        </div>

        <UPagination v-model="page" :page-count="pageCount" :total="pageTotal" :ui="{
          wrapper: 'flex items-center gap-1',
          rounded: '!rounded-full min-w-[32px] justify-center',
          default: {
            activeButton: {
              variant: 'outline'
            }
          }
        }" />
      </div>
    </template>
  </UCard>
</template>