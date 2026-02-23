<template>
  <main>
    <UApp>
      <UContainer class="py-10 max-w-5xl relative">
        
        <nav class="fixed left-10 top-24 z-50 flex flex-col gap-3 print:hidden" aria-label="Opciones de factura">
          <UTooltip text="Opciones de diseño" side="right">
            <UButton
              icon="i-lucide-pencil"
              size="xl"
              color="primary"
              variant="solid"
              class="rounded-full shadow-lg"
              aria-label="Abrir menú de diseño" 
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
                  aria-label="Borrar todos los datos de la factura"
                  @click="resetInvoice" 
                />
              </UTooltip>
              <UTooltip text="Cambiar Color" side="right">
                <UButton 
                  icon="i-lucide-palette" 
                  :style="{ backgroundColor: themeColor, color: 'white' }" 
                  variant="solid" 
                  class="rounded-full shadow-md" 
                  aria-label="Cambiar color de tema"
                  @click="changeColor" 
                />
              </UTooltip>
            </div>
          </Transition>
        </nav>

        <UCard :ui="{ body: { padding: 'p-12' } }" class="shadow-2xl border-none bg-white min-h-[1000px]">
          
          <div class="flex justify-between items-start mb-12">
            <div class="flex-1 space-y-1">
              <h1 class="text-5xl font-serif text-gray-800 mb-6 italic">Invoice</h1>
              
              <div class="max-w-xs space-y-1">
                <UInput 
                  v-model="invoice.sender.name" 
                  placeholder="YOUR COMPANY*" 
                  variant="none" 
                  class="font-bold text-black text-sm mb-2 uppercase tracking-widest p-0 focus:ring-0 w-full" 
                  aria-label="Nombre de tu empresa"
                />
                
                <div class="flex gap-2">
                  <UInput v-model="invoice.sender.firstName" placeholder="First Name*" variant="none" class="p-0 focus:ring-0" aria-label="Tu nombre" />
                  <UInput v-model="invoice.sender.lastName" placeholder="Last Name*" variant="none" class="p-0 focus:ring-0" aria-label="Tu apellido" />
                </div>
                <UInput v-model="invoice.sender.website" placeholder="Company Website*" variant="none" class="p-0 focus:ring-0" aria-label="Sitio web de empresa" />
                <UInput v-model="invoice.sender.address" placeholder="Company Address" variant="none" class="p-0 focus:ring-0" aria-label="Dirección de empresa" />
                <UInput v-model="invoice.sender.cityStateZip" placeholder="City, State ZIP" variant="none" class="p-0 focus:ring-0" aria-label="Ciudad, Estado y Código Postal" />
                <UInput v-model="invoice.sender.country" placeholder="Country" variant="none" class="p-0 focus:ring-0" aria-label="País" />
                
                <div class="flex flex-col">
                  <UInput 
                    v-model="invoice.sender.phone" 
                    placeholder="Phone (10 digits)*" 
                    variant="none" 
                    class="p-0 focus:ring-0"
                    maxlength="10"
                    aria-label="Teléfono de contacto"
                    @keydown="onlyNumbers"
                    @paste="handlePasteNumbers"
                  />
                </div>
                
                <div class="flex flex-col">
                  <UInput v-model="invoice.sender.email" type="email" placeholder="Email Address*" variant="none" class="p-0 text-primary-600 focus:ring-0" aria-label="Correo electrónico del emisor" />
                  <span v-if="invoice.sender.email && !invoice.sender.email.includes('@')" class="text-[10px] text-red-600 font-bold italic mt-0.5 ml-1">Error: Correo emisor sin '@'</span>
                </div>
              </div>
            </div>

            <div class="relative w-64 h-40 border-2 border-dashed border-gray-300 rounded flex items-center justify-center bg-gray-50 cursor-pointer overflow-hidden group hover:border-primary-500 transition-colors">
              <input type="file" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer z-10" aria-label="Subir logo de la empresa" @change="handleLogoUpload" />
              <div v-if="!logo" class="text-center p-4">
                <UIcon name="i-lucide-image-plus" class="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p class="text-xs font-bold text-gray-600">Click to upload logo</p>
              </div>
              <img v-else :src="logo" class="object-contain w-full h-full" alt="Logo de la empresa" />
            </div>
          </div>

          <div class="flex justify-between items-start mb-12">
            <div class="flex-1 space-y-1">
              <UInput 
                v-model="invoice.client.sectionTitle" 
                variant="none" 
                class="font-bold text-black text-sm mb-2 uppercase tracking-widest p-0 focus:ring-0 w-full" 
                aria-label="Título de la sección del cliente"
              />
              
              <div class="max-w-xs space-y-1">
                <div class="flex gap-2">
                  <UInput v-model="invoice.client.firstName" placeholder="First Name" variant="none" class="p-0 focus:ring-0" aria-label="Nombre del cliente" />
                  <UInput v-model="invoice.client.lastName" placeholder="Last Name" variant="none" class="p-0 focus:ring-0" aria-label="Apellido del cliente" />
                </div>
                <UInput v-model="invoice.client.address" placeholder="Client's Address" variant="none" class="p-0 focus:ring-0" aria-label="Dirección del cliente" />
                <UInput v-model="invoice.client.cityStateZip" placeholder="City, State ZIP" variant="none" class="p-0 focus:ring-0" aria-label="Ciudad y Zip del cliente" />
                <UInput v-model="invoice.client.country" placeholder="Country" variant="none" class="p-0 focus:ring-0" aria-label="País del cliente" />
                
                <div class="flex flex-col">
                  <UInput v-model="invoice.client.email" type="email" placeholder="Client's Email" variant="none" class="p-0 focus:ring-0" aria-label="Correo electrónico del cliente" />
                  <span v-if="invoice.client.email && !invoice.client.email.includes('@')" class="text-[10px] text-red-600 font-bold italic mt-0.5 ml-1">Error: Correo cliente sin '@'</span>
                </div>
              </div>
            </div>

            <div class="w-64 space-y-3 text-right">
              <div class="flex items-center justify-end gap-4">
                <label for="invoice-number" class="text-sm text-gray-500">Invoice No:</label>
                <UInput id="invoice-number" v-model="invoice.number" placeholder="####" variant="none" class="w-24 text-right font-mono focus:ring-0" />
              </div>
              <div class="flex items-center justify-end gap-4">
                <label for="invoice-date" class="text-sm text-gray-500">Invoice Date:</label>
                <UInput id="invoice-date" v-model="invoice.date" type="date" variant="none" class="w-32 text-right focus:ring-0" />
              </div>
              <div class="flex items-center justify-end gap-4">
                <label for="due-date" class="text-sm text-gray-500">Due Date:</label>
                <UInput id="due-date" v-model="invoice.dueDate" type="date" variant="none" class="w-32 text-right focus:ring-0" />
              </div>
            </div>
          </div>

          <div class="mb-8">
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
                <UInput v-model="item.description" placeholder="Item description" variant="none" class="focus:ring-0" :aria-label="'Descripción del item ' + (index + 1)" />
              </div>
              
              <div class="col-span-2 px-2">
                <label :for="'type-' + index" class="sr-only">Tipo de item</label>
                <select 
                  :id="'type-' + index"
                  v-model="item.type" 
                  class="w-full bg-gray-50 border rounded p-1 text-xs outline-none focus:ring-1 focus:ring-primary-500"
                  @change="handleTypeChange(index)"
                >
                  <option value="Producto">Producto</option>
                  <option value="Servicio">Servicio</option>
                </select>
              </div>

              <div class="col-span-2 text-center">
                <UInput v-model.number="item.quantity" type="number" min="1" variant="none" class="text-center font-bold focus:ring-0" :aria-label="'Cantidad del item ' + (index + 1)" />
              </div>
              <div class="col-span-2 text-right">
                <UInput v-model.number="item.price" type="number" min="0" step="0.01" variant="none" class="text-right focus:ring-0" prefix="$" :aria-label="'Precio del item ' + (index + 1)" />
              </div>
              
              <UButton v-if="invoice.items.length > 1" icon="i-lucide-trash" color="red" variant="ghost" size="xs" class="absolute -right-10 opacity-0 group-hover:opacity-100 transition-opacity" :aria-label="'Eliminar fila ' + (index + 1)" @click="invoice.items.splice(index, 1)" />
            </div>
            
            <UButton icon="i-lucide-plus" variant="ghost" :style="{ color: themeColor }" class="mt-4 font-bold" @click="addItem">Add another line item</UButton>
          </div>

          <div class="grid grid-cols-2 gap-20 items-end">
            <div class="border border-gray-200 rounded-sm p-6 min-h-[160px] relative">
              <label for="invoice-notes" class="absolute -top-3 left-4 bg-white px-2 text-xs font-bold text-gray-500 uppercase tracking-tighter">Notes:</label>
              <UTextarea id="invoice-notes" v-model="invoice.notes" placeholder="Any additional comments" variant="none" :rows="4" class="focus:ring-0" />
            </div>

            <div class="space-y-4">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span class="font-bold text-gray-800">${{ subtotal.toFixed(2) }}</span>
              </div>
              
              <div class="flex justify-between items-center text-gray-600 border-b border-gray-100 pb-4">
                <label for="tax-input">Tax:</label>
                <div class="flex items-center gap-2">
                  <UInput id="tax-input" v-model.number="invoice.taxPercent" type="number" min="0" size="xs" class="w-20 text-right focus:ring-0 font-bold" variant="none" />
                  <span class="font-bold">%</span>
                </div>
              </div>

              <div class="flex justify-between items-center text-gray-600 border-b border-gray-100 pb-4">
                <label for="discount-input">Discount:</label>
                <div class="flex items-center gap-2">
                  <UInput id="discount-input" v-model.number="invoice.discountPercent" type="number" min="0" size="xs" class="w-20 text-right focus:ring-0 font-bold" variant="none" />
                  <span class="font-bold">%</span>
                </div>
              </div>

              <div class="flex justify-between text-2xl font-bold pt-2 border-t-2 border-gray-900">
                <div class="flex flex-col">
                  <span>Total:</span>
                  <span class="text-[10px] text-gray-500 uppercase font-sans tracking-widest">Modo: {{ invoice.items[0].type }}</span>
                </div>
                <span :style="{ color: themeColor }" class="font-serif transition-colors duration-500">${{ total.toFixed(2) }}</span>
              </div>
            </div>
          </div>
          
          <div class="mt-12 flex justify-end">
            <UButton 
              size="xl" 
              color="black" 
              icon="i-lucide-download" 
              class="font-black px-10 hover:scale-105 transition-transform"
              aria-label="Generar y descargar factura en PDF"
              @click="generatePDF"
            >
              GENERATE PDF
            </UButton>
          </div>
        </UCard>
      </UContainer>
    </UApp>
  </main>
</template>

<script setup>
// Tu lógica intacta...
const showMenu = ref(false)
const themeColor = ref('#000000')
const logo = ref(null)

const colors = [
  '#000000', '#1e40af', '#065f46', '#991b1b', '#5b21b6', 
  '#854d0e', '#374151', '#be185d', '#155e75', '#3f6212'
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

const onlyNumbers = (e) => {
  const key = e.key;
  const isControlKey = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter'].includes(key);
  const isNumber = /^[0-9]$/.test(key);
  if (!isNumber && !isControlKey) e.preventDefault();
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

const handleTypeChange = (index) => {
  const masterType = invoice.items[0].type
  if (index === 0) {
    invoice.items.forEach(item => item.type = masterType)
  } else {
    if (invoice.items[index].type !== masterType) {
      alert(`No se pueden mezclar tipos. Modo actual: ${masterType}`)
      invoice.items[index].type = masterType
    }
  }
}

const addItem = () => invoice.items.push({ description: '', quantity: 1, price: 0, type: invoice.items[0].type })
const subtotal = computed(() => invoice.items.reduce((acc, i) => acc + (i.quantity * i.price), 0))

const total = computed(() => {
  const S = subtotal.value; const T = invoice.taxPercent / 100; const D = invoice.discountPercent / 100
  if (invoice.items[0].type === 'Servicio') {
    const base = S - (S * D)
    return base + (base * T)
  } else {
    return (S + (S * T)) - (S * D)
  }
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

const changeColor = () => {
  const current = colors.indexOf(themeColor.value)
  themeColor.value = colors[(current + 1) % colors.length]
}

const generatePDF = async () => {
  if (invoice.sender.phone.length !== 10) { alert("Error: El teléfono debe tener 10 dígitos."); return; }
  if (!invoice.sender.email.includes('@') || (invoice.client.email && !invoice.client.email.includes('@'))) { alert("Error: Revisa los correos electrónicos."); return; }
  const { public: { apiBase } } = useRuntimeConfig() 
  try {
    const response = await fetch(`${apiBase}/generate-pdf`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/pdf' },
      body: JSON.stringify({ ...invoice, themeColor: themeColor.value, logo: logo.value })
    })
    if (!response.ok) throw new Error("Server error");
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Invoice_${invoice.number}.pdf`
    link.click()
    window.URL.revokeObjectURL(url)
  } catch (error) { alert("Error conectando con el servidor") }
}
</script>

<style>
body { background-color: #f8f7f5; font-family: 'Inter', sans-serif; }
/* Estilo para ocultar labels de forma accesible */
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
.p-0:focus { background-color: #f3f4f6 !important; border-radius: 2px; }
.slide-enter-active, .slide-leave-active { transition: all 0.3s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateX(-20px); }
</style>