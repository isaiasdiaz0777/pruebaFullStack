<template>
  <UApp>
    <main>
      <UContainer class="py-10 max-w-5xl relative">
        
        <div class="fixed left-10 top-24 z-50 flex flex-col gap-3 print:hidden">
          <UTooltip text="Opciones de diseño" side="right">
            <UButton
              aria-label="Abrir menú de diseño"
              icon="i-lucide-pencil"
              size="xl"
              color="primary"
              variant="solid"
              class="rounded-full shadow-lg"
              @click="showMenu = !showMenu"
            />
          </UTooltip>
          
          <Transition name="slide">
            <div v-if="showMenu" class="flex flex-col gap-2">
              <UTooltip text="Resetear factura" side="right">
                <UButton aria-label="Limpiar factura" icon="i-lucide-trash-2" color="red" variant="soft" class="rounded-full" @click="resetInvoice" />
              </UTooltip>
              
              <UPopover side="right">
                <UButton 
                  aria-label="Cambiar color de tema"
                  icon="i-lucide-palette" 
                  :style="{ backgroundColor: themeColor, color: '#fff' }" 
                  variant="solid" 
                  class="rounded-full shadow-md" 
                />
                <template #content>
                  <div class="p-3 bg-white border rounded-lg shadow-xl w-64">
                    <p class="text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest">Seleccionar Color</p>
                    <div class="grid grid-cols-6 gap-2 mb-3">
                      <button 
                        v-for="color in colors" 
                        :key="color"
                        type="button"
                        :aria-label="'Cambiar color a ' + color"
                        class="w-8 h-8 rounded-md border border-gray-100 hover:scale-110 transition-transform focus:ring-2 focus:ring-offset-2"
                        :style="{ backgroundColor: color }"
                        @click="themeColor = color"
                      />
                    </div>
                    <div class="flex items-center gap-2 border-t pt-2">
                      <label for="hex-color" class="text-[10px] font-bold text-gray-400">HEX</label>
                      <span class="text-xs text-gray-500 font-mono">#</span>
                      <input 
                        id="hex-color"
                        v-model="themeColor" 
                        type="text" 
                        class="text-xs font-mono uppercase w-full outline-none focus:bg-gray-50 p-1"
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
                <label for="comp-name" class="sr-only">Nombre de la Empresa</label>
                <UInput id="comp-name" v-model="invoice.sender.name" placeholder="YOUR COMPANY*" variant="none" class="font-bold text-black text-sm mb-2 uppercase tracking-widest p-0 focus:ring-0 w-full" />
                
                <div class="flex gap-2">
                  <div class="flex-1">
                    <label for="send-fname" class="sr-only">Nombre</label>
                    <UInput id="send-fname" v-model="invoice.sender.firstName" placeholder="First Name*" variant="none" class="p-0 focus:ring-0 w-full" />
                  </div>
                  <div class="flex-1">
                    <label for="send-lname" class="sr-only">Apellido</label>
                    <UInput id="send-lname" v-model="invoice.sender.lastName" placeholder="Last Name*" variant="none" class="p-0 focus:ring-0 w-full" />
                  </div>
                </div>
                
                <UInput id="send-web" aria-label="Sitio Web" v-model="invoice.sender.website" placeholder="Company Website*" variant="none" class="p-0 focus:ring-0" />
                <UInput id="send-addr" aria-label="Dirección" v-model="invoice.sender.address" placeholder="Company Address" variant="none" class="p-0 focus:ring-0" />
                <UInput id="send-zip" aria-label="Ciudad y CP" v-model="invoice.sender.cityStateZip" placeholder="City, State ZIP" variant="none" class="p-0 focus:ring-0" />
                <UInput id="send-country" aria-label="País" v-model="invoice.sender.country" placeholder="Country" variant="none" class="p-0 focus:ring-0" />
                
                <UInput id="send-phone" aria-label="Teléfono" v-model="invoice.sender.phone" placeholder="Phone (10 digits)*" variant="none" class="p-0 focus:ring-0" maxlength="10" @keydown="onlyNumbers" @paste="handlePasteNumbers" />
                
                <UInput id="send-email" aria-label="Email" v-model="invoice.sender.email" type="email" placeholder="Email Address*" variant="none" class="p-0 text-primary-600 focus:ring-0" />
                <p v-if="emailError" class="text-[10px] text-red-600 font-bold italic mt-0.5 ml-1">Error: Correo emisor inválido</p>
              </div>
            </div>

            <div class="relative w-64 h-40 border-2 border-dashed border-gray-300 rounded flex items-center justify-center bg-gray-50 cursor-pointer overflow-hidden group hover:border-primary-500 transition-colors">
              <label for="logo-upload" class="sr-only">Subir Logo</label>
              <input id="logo-upload" type="file" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer z-10" @change="handleLogoUpload" />
              <div v-if="!logo" class="text-center p-4">
                <UIcon name="i-lucide-image-plus" class="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p class="text-xs font-bold text-gray-600">Click to upload logo</p>
              </div>
              <img v-else :src="logo" alt="Logo de la empresa" width="256" height="160" class="object-contain w-full h-full" />
            </div>
          </div>

          <div class="flex justify-between items-start mb-12">
            <div class="flex-1 space-y-1">
              <UInput id="client-title" aria-label="Título Sección Cliente" v-model="invoice.client.sectionTitle" variant="none" class="font-bold text-black text-sm mb-2 uppercase tracking-widest p-0 focus:ring-0 w-full" />
              
              <div class="max-w-xs space-y-1">
                <div class="flex gap-2">
                  <UInput aria-label="Nombre Cliente" v-model="invoice.client.firstName" placeholder="First Name" variant="none" class="p-0 focus:ring-0 w-full" />
                  <UInput aria-label="Apellido Cliente" v-model="invoice.client.lastName" placeholder="Last Name" variant="none" class="p-0 focus:ring-0 w-full" />
                </div>
                <UInput aria-label="Dirección Cliente" v-model="invoice.client.address" placeholder="Client's Address" variant="none" class="p-0 focus:ring-0" />
                <UInput aria-label="Ciudad Cliente" v-model="invoice.client.cityStateZip" placeholder="City, State ZIP" variant="none" class="p-0 focus:ring-0" />
                <UInput aria-label="País Cliente" v-model="invoice.client.country" placeholder="Country" variant="none" class="p-0 focus:ring-0" />
                <UInput aria-label="Email Cliente" v-model="invoice.client.email" type="email" placeholder="Client's Email" variant="none" class="p-0 focus:ring-0" />
              </div>
            </div>

            <div class="w-64 space-y-3 text-right">
              <div class="flex items-center justify-end gap-4">
                <label for="inv-num" class="text-sm text-gray-500">Invoice No:</label>
                <UInput id="inv-num" v-model="invoice.number" placeholder="####" variant="none" class="w-24 text-right font-mono focus:ring-0" />
              </div>
              <div class="flex items-center justify-end gap-4">
                <label for="inv-date" class="text-sm text-gray-500">Invoice Date:</label>
                <UInput id="inv-date" v-model="invoice.date" type="date" variant="none" class="w-32 text-right focus:ring-0" />
              </div>
              <div class="flex items-center justify-end gap-4">
                <label for="inv-due" class="text-sm text-gray-500">Due Date:</label>
                <UInput id="inv-due" v-model="invoice.dueDate" type="date" variant="none" class="w-32 text-right focus:ring-0" />
              </div>
            </div>
          </div>

          <div class="mb-8 overflow-visible">
            <div :style="{ backgroundColor: themeColor }" class="grid grid-cols-12 text-white p-3 font-bold text-sm rounded-t-sm transition-colors duration-500">
              <div class="col-span-1">ID</div>
              <div class="col-span-5">Description</div>
              <div class="col-span-2 text-center">Type</div>
              <div class="col-span-2 text-center">Quantity</div>
              <div class="col-span-2 text-right">Price</div>
            </div>
            
            <div v-for="(item, index) in invoice.items" :key="index" class="grid grid-cols-12 border-b border-gray-100 p-4 items-center group relative hover:bg-gray-50 transition-colors">
              <div class="col-span-1 text-gray-400 font-mono text-sm">{{ (index + 1).toString().padStart(2, '0') }}</div>
              <div class="col-span-5 pr-4">
                <UInput :aria-label="'Descripción item ' + (index+1)" v-model="item.description" placeholder="Item description" variant="none" class="focus:ring-0 w-full" />
              </div>
              
              <div class="col-span-2 px-2">
                <select 
                  aria-label="Tipo de ítem"
                  v-model="item.type" 
                  class="w-full bg-gray-50 border border-gray-200 rounded p-1 text-xs outline-none focus:ring-1 focus:ring-primary-500"
                  @change="handleTypeChange(index)"
                >
                  <option value="Producto">Producto</option>
                  <option value="Servicio">Servicio</option>
                </select>
              </div>

              <div class="col-span-2 text-center">
                <UInput :aria-label="'Cantidad item ' + (index+1)" v-model.number="item.quantity" type="number" min="1" variant="none" class="text-center font-bold focus:ring-0 w-full" />
              </div>
              <div class="col-span-2 text-right">
                <UInput :aria-label="'Precio item ' + (index+1)" v-model.number="item.price" type="number" min="0" step="0.01" variant="none" class="text-right focus:ring-0 w-full" prefix="$" />
              </div>
              
              <UButton v-if="invoice.items.length > 1" aria-label="Eliminar línea" icon="i-lucide-trash" color="red" variant="ghost" size="xs" class="absolute -right-10 opacity-0 group-hover:opacity-100 transition-opacity" @click="invoice.items.splice(index, 1)" />
            </div>
            
            <UButton icon="i-lucide-plus" variant="ghost" :style="{ color: themeColor }" class="mt-4 font-bold" @click="addItem">Add another line item</UButton>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-end">
            <div class="border border-gray-200 rounded-sm p-6 min-h-[160px] relative">
              <label for="notes" class="absolute -top-3 left-4 bg-white px-2 text-xs font-bold text-gray-500 uppercase tracking-tighter">Notes:</label>
              <UTextarea id="notes" v-model="invoice.notes" placeholder="Any additional comments" variant="none" :rows="4" class="focus:ring-0 w-full" />
            </div>

            <div class="space-y-4">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span class="font-bold text-gray-800">${{ subtotal.toFixed(2) }}</span>
              </div>
              
              <div class="flex justify-between items-center text-gray-600 border-b border-gray-100 pb-4">
                <label for="tax-input">Tax (%):</label>
                <div class="flex items-center gap-2">
                  <UInput id="tax-input" v-model.number="invoice.taxPercent" type="number" min="0" size="xs" class="w-20 text-right focus:ring-0 font-bold" variant="none" />
                  <span class="font-bold">%</span>
                </div>
              </div>

              <div class="flex justify-between items-center text-gray-600 border-b border-gray-100 pb-4">
                <label for="discount-input">Discount (%):</label>
                <div class="flex items-center gap-2">
                  <UInput id="discount-input" v-model.number="invoice.discountPercent" type="number" min="0" size="xs" class="w-20 text-right focus:ring-0 font-bold" variant="none" />
                  <span class="font-bold">%</span>
                </div>
              </div>

              <div class="flex justify-between text-2xl font-bold pt-2 border-t-2 border-gray-900">
                <div class="flex flex-col">
                  <span>Total:</span>
                  <span class="text-[10px] text-gray-500 uppercase font-sans tracking-widest">Modo: {{ currentMode }}</span>
                </div>
                <span :style="{ color: themeColor }" class="font-serif transition-colors duration-500">${{ total.toFixed(2) }}</span>
              </div>
            </div>
          </div>
          
          <div class="mt-12 flex justify-end print:hidden">
            <UButton 
              size="xl" 
              color="black" 
              icon="i-lucide-download" 
              class="font-black px-10 hover:scale-105 transition-transform"
              @click="generatePDF"
            >
              GENERATE PDF
            </UButton>
          </div>
        </UCard>
      </UContainer>
    </main>
  </UApp>
</template>

<script setup>
const showMenu = ref(false)
const themeColor = ref('#1F1F1F')
const logo = ref(null)

const colors = [
  '#1F1F1F', '#D97706', '#B45309', '#059669', '#047857', '#0284C7', 
  '#0369A1', '#DB2777', '#BE185D', '#9333EA', '#7C3AED', '#4F46E5'
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

// Computeds optimizados
const subtotal = computed(() => invoice.items.reduce((acc, i) => acc + (i.quantity * i.price), 0))
const currentMode = computed(() => invoice.items[0]?.type || 'Producto')
const emailError = computed(() => invoice.sender.email && !invoice.sender.email.includes('@'))

const total = computed(() => {
  const S = subtotal.value
  const T = invoice.taxPercent / 100
  const D = invoice.discountPercent / 100
  return currentMode.value === 'Servicio' ? (S - (S * D)) * (1 + T) : (S * (1 + T)) - (S * D)
})

// Handlers
const onlyNumbers = (e) => {
  if (['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter'].includes(e.key)) return
  if (!/^[0-9]$/.test(e.key)) e.preventDefault()
}

const handlePasteNumbers = (e) => {
  const pasteData = e.clipboardData.getData('text')
  if (/[^0-9]/.test(pasteData)) {
    e.preventDefault()
    invoice.sender.phone = pasteData.replace(/\D/g, '').slice(0, 10)
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

const handleTypeChange = (index) => {
  if (index === 0) {
    const masterType = invoice.items[0].type
    invoice.items.forEach(item => item.type = masterType)
  }
}

const addItem = () => invoice.items.push({ 
  description: '', 
  quantity: 1, 
  price: 0, 
  type: currentMode.value 
})

const resetInvoice = () => {
  if(confirm('¿Limpiar factura?')) {
    Object.assign(invoice, {
      items: [{ description: 'Item description', quantity: 1, price: 0, type: 'Producto' }],
      taxPercent: 0, 
      discountPercent: 0, 
      notes: '',
      client: { sectionTitle: "CLIENT'S COMPANY", firstName: '', lastName: '', address: '', cityStateZip: '', country: '', email: '' }
    })
    logo.value = null
  }
}

const generatePDF = () => {
  window.print() // El navegador maneja mejor el PDF que alert() para performance
}
</script>

<style>
body { background-color: #f8f7f5; font-family: 'Inter', sans-serif; }

/* Accesibilidad: Ocultar visualmente pero mantener para lectores de pantalla */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Mejora de UX en Focus */
.p-0:focus { background-color: #f9fafb !important; border-radius: 2px; }

/* Transiciones */
.slide-enter-active, .slide-leave-active { transition: all 0.3s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateX(-20px); }

/* Optimización para Impresión */
@media print {
  body { background: white; }
  .shadow-2xl { shadow: none !important; }
  .fixed, .print\:hidden { display: none !important; }
}
</style>