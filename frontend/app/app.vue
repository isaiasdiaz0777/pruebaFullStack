<template>
  <main>
    <UApp>
      <UContainer class="py-10 max-w-5xl relative">

        <div class="fixed left-10 top-24 z-50 flex flex-col gap-3 print:hidden">
          <UTooltip text="Opciones de diseño" side="right">
            <UButton
              icon="i-lucide-pencil"
              size="xl"
              color="primary"
              variant="solid"
              class="rounded-full shadow-lg"
              aria-label="Abrir menú de configuración"
              @click="showMenu = !showMenu"
            />
          </UTooltip>
          
          <Transition name="slide">
            <div v-if="showMenu" class="flex flex-col gap-2">
              <UTooltip text="Resetear factura" side="right">
                <UButton 
                  icon="i-lucide-trash-2" 
                  color="red" 
                  variant="soft" 
                  class="rounded-full" 
                  @click="resetInvoice" 
                />
              </UTooltip>
              
              <UPopover side="right">
                <UButton 
                  icon="i-lucide-palette" 
                  :style="{ backgroundColor: themeColor, color: 'white' }" 
                  variant="solid" 
                  class="rounded-full shadow-md" 
                />
                <template #content>
                  <div class="p-3 bg-white border rounded-lg shadow-xl w-64">
                    <p class="text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">Seleccionar Color</p>
                    <div class="grid grid-cols-6 gap-2 mb-3">
                      <button 
                        v-for="color in colors" 
                        :key="color"
                        type="button"
                        class="w-8 h-8 rounded-md border border-gray-100 hover:scale-110 transition-transform"
                        :style="{ backgroundColor: color }"
                        @click="themeColor = color"
                      />
                    </div>
                    <div class="flex items-center gap-2 border-t pt-2">
                      <span class="text-xs text-gray-500 font-mono">#</span>
                      <input 
                        v-model="themeColor" 
                        type="text" 
                        class="text-xs font-mono uppercase w-full outline-none"
                        maxlength="7"
                      />
                    </div>
                  </div>
                </template>
              </UPopover>
            </div>
          </Transition>
        </div>

        <UCard :ui="{ body: { padding: 'p-12' } }" class="shadow-2xl border-none bg-white min-h-[1000px]">
          
          <div class="flex justify-between items-start mb-12">
            <div class="flex-1 space-y-1">
              <h1 class="text-5xl font-serif text-gray-800 mb-6 italic">Invoice</h1>
              
              <div class="max-w-xs space-y-1">
                <UInput v-model="invoice.sender.name" placeholder="YOUR COMPANY*" variant="none" class="font-bold text-black text-sm mb-2 uppercase tracking-widest p-0 focus:ring-0 w-full" />
                <div class="flex gap-2">
                  <UInput v-model="invoice.sender.firstName" placeholder="First Name*" variant="none" class="p-0 focus:ring-0" />
                  <UInput v-model="invoice.sender.lastName" placeholder="Last Name*" variant="none" class="p-0 focus:ring-0" />
                </div>
                <UInput v-model="invoice.sender.website" placeholder="Company Website*" variant="none" class="p-0 focus:ring-0" />
                <UInput v-model="invoice.sender.address" placeholder="Address" variant="none" class="p-0 focus:ring-0" />
                <UInput v-model="invoice.sender.cityStateZip" placeholder="City, State ZIP" variant="none" class="p-0 focus:ring-0" />
                <UInput v-model="invoice.sender.phone" placeholder="Phone*" variant="none" class="p-0 focus:ring-0" maxlength="10" @keydown="onlyNumbers" @paste="handlePasteNumbers" />
                <UInput v-model="invoice.sender.email" type="email" placeholder="Email Address*" variant="none" class="p-0 text-primary-600 focus:ring-0" />
              </div>
            </div>

            <div class="relative w-64 h-40 border-2 border-dashed border-gray-300 rounded flex items-center justify-center bg-gray-50 cursor-pointer overflow-hidden group hover:border-primary-500 transition-colors">
              <input type="file" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer z-10" @change="handleLogoUpload" />
              <div v-if="!logo" class="text-center p-4">
                <UIcon name="i-lucide-image-plus" class="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p class="text-xs font-bold text-gray-600">Click to upload logo</p>
              </div>
              <img v-else :src="logo" class="object-contain w-full h-full" />
            </div>
          </div>

          <div class="flex justify-between items-start mb-12">
            <div class="flex-1 space-y-1">
              <UInput v-model="invoice.client.sectionTitle" variant="none" class="font-bold text-black text-sm mb-2 uppercase tracking-widest p-0 focus:ring-0 w-full" />
              <div class="max-w-xs space-y-1">
                <div class="flex gap-2">
                  <UInput v-model="invoice.client.firstName" placeholder="First Name" variant="none" class="p-0 focus:ring-0" />
                  <UInput v-model="invoice.client.lastName" placeholder="Last Name" variant="none" class="p-0 focus:ring-0" />
                </div>
                <UInput v-model="invoice.client.address" placeholder="Client's Address" variant="none" class="p-0 focus:ring-0" />
                <UInput v-model="invoice.client.cityStateZip" placeholder="City, State ZIP" variant="none" class="p-0 focus:ring-0" />
                <UInput v-model="invoice.client.email" type="email" placeholder="Client's Email" variant="none" class="p-0 focus:ring-0" />
              </div>
            </div>

            <div class="w-64 space-y-3 text-right">
              <div class="flex items-center justify-end gap-4">
                <label class="text-sm text-gray-500">Invoice No:</label>
                <UInput v-model="invoice.number" variant="none" class="w-24 text-right font-mono focus:ring-0" />
              </div>
              <div class="flex items-center justify-end gap-4">
                <label class="text-sm text-gray-500">Invoice Date:</label>
                <UInput v-model="invoice.date" type="date" variant="none" class="w-32 text-right focus:ring-0" />
              </div>
            </div>
          </div>

          <div class="mb-8">
            <div :style="{ backgroundColor: themeColor }" class="grid grid-cols-12 text-white p-3 font-bold text-sm rounded-t-sm transition-colors duration-500">
              <div class="col-span-1">ID</div>
              <div class="col-span-5">Description</div>
              <div class="col-span-2 text-center">Type</div>
              <div class="col-span-2 text-center">Qty</div>
              <div class="col-span-2 text-right">Price</div>
            </div>
            
            <div v-for="(item, index) in invoice.items" :key="index" class="grid grid-cols-12 border-b border-gray-100 p-4 items-center group relative hover:bg-gray-50 transition-colors">
              <div class="col-span-1 text-gray-300 font-mono text-sm">{{ (index + 1).toString().padStart(2, '0') }}</div>
              <div class="col-span-5 pr-4">
                <UInput v-model="item.description" placeholder="Item description" variant="none" class="focus:ring-0" />
              </div>
              
              <div class="col-span-2 px-2">
                <select 
                  v-if="index === 0"
                  v-model="item.type" 
                  class="w-full bg-white border border-gray-200 rounded p-1 text-xs font-bold outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                  @change="syncAllTypes"
                >
                  <option value="Producto">Product</option>
                  <option value="Servicio">Servicio</option>
                </select>
                <div v-else class="text-[10px] uppercase font-bold text-gray-400 text-center bg-gray-50 py-1.5 rounded border border-transparent">
                  {{ invoice.items[0].type }}
                </div>
              </div>

              <div class="col-span-2 text-center">
                <UInput v-model.number="item.quantity" type="number" min="1" variant="none" class="text-center font-bold focus:ring-0" />
              </div>
              <div class="col-span-2 text-right">
                <UInput v-model.number="item.price" type="number" min="0" step="0.01" variant="none" class="text-right focus:ring-0" prefix="$" />
              </div>
              
              <UButton v-if="invoice.items.length > 1" icon="i-lucide-trash" color="red" variant="ghost" size="xs" class="absolute -right-10 opacity-0 group-hover:opacity-100 transition-opacity" @click="removeItem(index)" />
            </div>
            
            <UButton icon="i-lucide-plus" variant="ghost" :style="{ color: themeColor }" class="mt-4 font-bold" @click="addItem">Add another line item</UButton>
          </div>

          <div class="grid grid-cols-2 gap-20 items-end">
            <div class="border border-gray-200 rounded-sm p-6 min-h-[160px] relative">
              <label class="absolute -top-3 left-4 bg-white px-2 text-xs font-bold text-gray-400 uppercase tracking-tighter">Notes:</label>
              <UTextarea v-model="invoice.notes" placeholder="Any additional comments" variant="none" :rows="4" class="focus:ring-0" />
            </div>

            <div class="space-y-4">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span class="font-bold text-gray-800">${{ subtotal.toFixed(2) }}</span>
              </div>
              
              <div class="flex justify-between items-center text-gray-600 border-b border-gray-100 pb-4">
                <span>Tax (%):</span>
                <UInput v-model.number="invoice.taxPercent" type="number" min="0" size="xs" class="w-20 text-right font-bold" variant="none" />
              </div>

              <div class="flex justify-between items-center text-gray-600 border-b border-gray-100 pb-4">
                <span>Discount (%):</span>
                <UInput v-model.number="invoice.discountPercent" type="number" min="0" size="xs" class="w-20 text-right font-bold" variant="none" />
              </div>

              <div class="flex justify-between text-2xl font-bold pt-2 border-t-2 border-gray-900">
                <div class="flex flex-col">
                  <span>Total:</span>
                  <span class="text-[10px] text-gray-400 uppercase tracking-widest">Modo: {{ invoice.items[0]?.type }}</span>
                </div>
                <span :style="{ color: themeColor }" class="font-serif transition-colors duration-500">${{ total.toFixed(2) }}</span>
              </div>
            </div>
          </div>
          
          <div class="mt-12 flex justify-end print:hidden">
            <UButton size="xl" color="black" icon="i-lucide-download" class="font-black px-10 hover:scale-105 transition-transform" @click="generatePDF">
              GENERATE PDF
            </UButton>
          </div>
        </UCard>
      </UContainer>
    </UApp>
  </main>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const showMenu = ref(false)
const themeColor = ref('#1F1F1F')
const logo = ref(null)

const colors = [
  '#1F1F1F', '#FF6B00', '#FFC700', '#7FDBB6', '#00D17B', '#87CEFA', 
  '#0095E8', '#E91E63', '#F48FB1', '#9C27B0', '#673AB7', '#3F51B5'
]

const invoice = reactive({
  number: '1',
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date().toISOString().split('T')[0],
  sender: { name: '', firstName: '', lastName: '', website: '', address: '', cityStateZip: '', country: '', phone: '', email: '' },
  client: { sectionTitle: "CLIENT'S COMPANY", firstName: '', lastName: '', address: '', cityStateZip: '', country: '', email: '' },
  items: [{ description: 'Item description', quantity: 1, price: 0, type: 'Producto' }],
  taxPercent: 0,
  discountPercent: 0,
  notes: ''
})

// SINCRONIZACIÓN DE TIPOS
// Esta función asegura que todos los ítems en el array tengan el mismo tipo que el primero
const syncAllTypes = () => {
  const masterType = invoice.items[0].type
  invoice.items.forEach(item => {
    item.type = masterType
  })
}

const addItem = () => {
  // Heredamos el tipo actual del primer ítem para el nuevo
  const currentMasterType = invoice.items[0]?.type || 'Producto'
  invoice.items.push({ 
    description: '', 
    quantity: 1, 
    price: 0, 
    type: currentMasterType 
  })
}

const removeItem = (index) => {
  invoice.items.splice(index, 1)
  // Al eliminar, nos aseguramos de que los que quedan sigan sincronizados
  if (invoice.items.length > 0) syncAllTypes()
}

// CÁLCULOS
const subtotal = computed(() => {
  return invoice.items.reduce((acc, i) => acc + (i.quantity * i.price), 0)
})

const total = computed(() => {
  const S = subtotal.value
  const T = invoice.taxPercent / 100
  const D = invoice.discountPercent / 100
  
  // Lógica de cálculo según tipo de factura (Servicio vs Producto)
  return invoice.items[0]?.type === 'Servicio' 
    ? (S - (S * D)) * (1 + T) 
    : (S * (1 + T)) - (S * D)
})

// VALIDACIONES Y UTILIDADES
const onlyNumbers = (e) => {
  const isControlKey = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter'].includes(e.key);
  if (!/^[0-9]$/.test(e.key) && !isControlKey) e.preventDefault();
}

const handlePasteNumbers = (e) => {
  const pasteData = e.clipboardData.getData('text');
  if (/[^0-9]/.test(pasteData)) {
    e.preventDefault();
    invoice.sender.phone = pasteData.replace(/\D/g, '').slice(0, 10);
  }
}

const handleLogoUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (event) => { logo.value = event.target.result }
    reader.readAsDataURL(file)
  }
}

const resetInvoice = () => {
  if(confirm('¿Limpiar factura?')) {
    location.reload()
  }
}

const generatePDF = () => {
  window.print()
}
</script>

<style>
body { background-color: #f8f7f5; font-family: 'Inter', sans-serif; }
.slide-enter-active, .slide-leave-active { transition: all 0.3s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateX(-20px); }

@media print {
  .print\:hidden, .fixed { display: none !important; }
  .shadow-2xl { box-shadow: none !important; }
  body { background-color: white !important; }
}

/* Chrome, Safari, Edge, Opera - Ocultar flechas de input number */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] { -moz-appearance: textfield; }
</style>