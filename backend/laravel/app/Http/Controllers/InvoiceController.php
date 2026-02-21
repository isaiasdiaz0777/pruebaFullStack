<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceController extends Controller
{
    public function generate(Request $request)
{
    $data = $request->all(); // Obtenemos todo el objeto invoice
    
    // Cálculos (Misma lógica que el front)
    $subtotal = collect($data['items'])->sum(fn($i) => $i['quantity'] * $i['price']);
    $tax = $data['taxPercent'] / 100;
    $discount = $data['discountPercent'] / 100;
    
    if ($data['items'][0]['type'] === 'Servicio') {
        $base = $subtotal - ($subtotal * $discount);
        $total = $base + ($base * $tax);
    } else {
        $base = $subtotal + ($subtotal * $tax);
        $total = $base - ($subtotal * $discount);
    }

    $pdf = Pdf::loadView('pdf.invoice', array_merge($data, [
        'subtotal' => $subtotal,
        'total' => $total
    ]));

    return response($pdf->output(), 200)
        ->header('Content-Type', 'application/pdf');
}
}