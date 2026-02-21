<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Helvetica', sans-serif; color: #374151; font-size: 12px; line-height: 1.5; }
        .bg-theme { background-color: {{ $themeColor }}; color: white; }
        .text-primary { color: {{ $themeColor }}; }
        .header-table { width: 100%; margin-bottom: 40px; }
        .invoice-title { font-size: 45px; font-style: italic; margin: 0; color: #1f2937; }
        .section-title { font-weight: bold; color: #9ca3af; text-transform: uppercase; font-size: 10px; letter-spacing: 1px; margin-bottom: 8px; }
        .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .table th { padding: 12px; text-align: left; font-weight: bold; }
        .table td { padding: 12px; border-bottom: 1px solid #f3f4f6; }
        .text-right { text-align: right; }
        .totals-table { width: 300px; margin-left: auto; margin-top: 30px; }
        .totals-table td { padding: 8px 0; }
        .total-row { font-size: 18px; font-weight: bold; border-top: 2px solid #000; padding-top: 10px; }
        .logo { max-width: 200px; max-height: 100px; object-fit: contain; }
    </style>
</head>
<body>
    <table class="header-table">
        <tr>
            <td style="width: 60%;">
                <h1 class="invoice-title">Invoice</h1>
                <div style="margin-top: 20px;">
                    <strong>{{ $sender['name'] }}</strong><br>
                    {{ $sender['firstName'] }} {{ $sender['lastName'] }}<br>
                    {{ $sender['website'] }}<br>
                    {{ $sender['address'] }}<br>
                    {{ $sender['cityStateZip'] }}<br>
                    {{ $sender['country'] }}<br>
                    {{ $sender['phone'] }}<br>
                    <span class="text-primary">{{ $sender['email'] }}</span>
                </div>
            </td>
            <td class="text-right" style="vertical-align: top;">
                @if($logo)
                    <img src="{{ $logo }}" class="logo">
                @endif
                <div style="margin-top: 20px;">
                    <p><strong>Invoice No:</strong> {{ $number }}</p>
                    <p><strong>Date:</strong> {{ $date }}</p>
                    <p><strong>Due Date:</strong> {{ $dueDate }}</p>
                </div>
            </td>
        </tr>
    </table>

    <div style="margin-bottom: 30px;">
        <div><strong>{{ $client['sectionTitle'] }}</strong></div>
        {{ $client['firstName'] }} {{ $client['lastName'] }}<br>
        {{ $client['address'] }}<br>
        {{ $client['cityStateZip'] }}<br>
        {{ $client['country'] }}<br>
        {{ $client['email'] }}
    </div>

    <table class="table">
        <thead class="bg-theme">
            <tr>
                <th style="width: 50%;">Description</th>
                <th style="text-align: center;">Type</th>
                <th style="text-align: center;">Quantity</th>
                <th class="text-right">Price</th>
            </tr>
        </thead>
        <tbody>
            @foreach($items as $item)
            <tr>
                <td>{{ $item['description'] }}</td>
                <td style="text-align: center;">{{ $item['type'] }}</td>
                <td style="text-align: center;">{{ $item['quantity'] }}</td>
                <td class="text-right">${{ number_format($item['price'], 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <table style="width: 100%; margin-top: 40px;">
        <tr>
            <td style="width: 50%; vertical-align: top;">
                <div style="border: 1px solid #e5e7eb; padding: 15px; min-height: 100px;">
                    <div class="section-title" style="margin-top: -22px; background: white; width: 50px; text-align: center;">Notes</div>
                    {{ $notes }}
                </div>
            </td>
            <td style="width: 50%;">
                <table class="totals-table">
                    <tr>
                        <td>Subtotal:</td>
                        <td class="text-right">${{ number_format($subtotal, 2) }}</td>
                    </tr>
                    <tr>
                        <td>Tax ({{ $taxPercent }}%):</td>
                        <td class="text-right">+</td>
                    </tr>
                    <tr>
                        <td style="border-bottom: 1px solid #f3f4f6;">Discount ({{ $discountPercent }}%):</td>
                        <td class="text-right" style="border-bottom: 1px solid #f3f4f6;">-</td>
                    </tr>
                    <tr class="total-row">
                        <td>Total:</td>
                        <td class="text-right" class="text-primary">${{ number_format($total, 2) }}</td>
                    </tr>
                    <tr>
                        <td colspan="2" style="font-size: 8px; color: #9ca3af; text-align: right;">Calculado como: {{ $items[0]['type'] }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>